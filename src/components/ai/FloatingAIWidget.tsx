import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2, Send } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lisa-chat`;

export function FloatingAIWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWebListening, setIsWebListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // 🎙️ Speech Recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- WEB CALL (Browser STT) ---------------- */

  const startWebCall = () => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Not Supported",
        description: "Your browser does not support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    resetTranscript();
    setIsWebListening(true);

    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const stopWebCall = () => {
    SpeechRecognition.stopListening();
    setIsWebListening(false);

    if (transcript.trim()) {
      setInputText(transcript.trim());
    }
  };

  /* ---------------- SEND MESSAGE ---------------- */

  const sendTextMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to get response");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last?.role === "assistant") {
                    return prev.map((m, i) =>
                      i === prev.length - 1
                        ? { ...m, content: assistantContent }
                        : m
                    );
                  }
                  return [...prev, { role: "assistant", content: assistantContent }];
                });
              }
            } catch {
              // ignore partial JSON
            }
          }
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl">
      {/* Messages */}
      {messages.length > 0 && (
        <div className="mb-3 max-h-60 overflow-y-auto space-y-2 px-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`text-sm p-3 rounded-lg ${
                m.role === "assistant"
                  ? "bg-card/80"
                  : "bg-secondary/50 ml-8"
              }`}
            >
              <strong>{m.role === "assistant" ? "Lisa: " : "You: "}</strong>
              {m.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input */}
      <div className="relative flex items-center">
        {isWebListening && transcript && (
          <div className="absolute -top-8 left-4 right-4 text-sm italic text-muted-foreground truncate">
            🎙️ {transcript}
          </div>
        )}

        <div className="flex-1 bg-card/80 rounded-full flex items-center pr-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Lisa about ERP, Oracle HCM, implementations..."
            className="flex-1 py-4 px-6 bg-transparent outline-none"
            disabled={isLoading || isWebListening}
          />

          {inputText.trim() && !isWebListening && (
            <button
              onClick={sendTextMessage}
              className="w-10 h-10 rounded-full flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send />
              )}
            </button>
          )}

          {/* Mic Button */}
          <button
            onClick={() =>
              isWebListening ? stopWebCall() : startWebCall()
            }
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isWebListening ? "bg-primary animate-pulse" : "bg-primary"
            }`}
          >
            {isWebListening ? <MicOff /> : <Mic />}
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-3">
        {isWebListening
          ? "Listening… Speak now"
          : isLoading
          ? "Lisa is thinking…"
          : "Type or click the mic to speak"}
      </p>
    </div>
  );
}
