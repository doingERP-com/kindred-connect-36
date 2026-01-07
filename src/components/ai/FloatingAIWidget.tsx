import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RetellWebClient } from "retell-client-js-sdk";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AGENT_ID = "agent_ec9be380f089686b64dce6289a";
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lisa-chat`;

export function FloatingAIWidget() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const retellClientRef = useRef<RetellWebClient | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Listen for glow trigger event
  const handleGlowTrigger = useCallback(() => {
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 3000);
  }, []);

  useEffect(() => {
    window.addEventListener('triggerLisaGlow', handleGlowTrigger);
    return () => window.removeEventListener('triggerLisaGlow', handleGlowTrigger);
  }, [handleGlowTrigger]);

  useEffect(() => {
    return () => {
      if (retellClientRef.current) {
        retellClientRef.current.stopCall();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startCall = async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const { data, error } = await supabase.functions.invoke("retell-create-web-call", {
        body: { agent_id: AGENT_ID },
      });

      if (error || !data?.access_token) {
        throw new Error(error?.message || "Failed to get access token");
      }

      const retellWebClient = new RetellWebClient();
      retellClientRef.current = retellWebClient;

      retellWebClient.on("call_started", () => {
        console.log("Call started");
        setIsCallActive(true);
        setIsConnecting(false);
      });

      retellWebClient.on("call_ended", () => {
        console.log("Call ended");
        setIsCallActive(false);
        setIsSpeaking(false);
      });

      retellWebClient.on("agent_start_talking", () => {
        setIsSpeaking(true);
      });

      retellWebClient.on("agent_stop_talking", () => {
        setIsSpeaking(false);
      });

      retellWebClient.on("update", (update: { transcript?: { role: string; content: string }[] }) => {
        if (update.transcript) {
          const newMessages = update.transcript.map((t) => ({
            role: (t.role === "agent" ? "assistant" : "user") as "user" | "assistant",
            content: t.content,
          }));
          setMessages(newMessages);
        }
      });

      retellWebClient.on("error", (error: Error) => {
        console.error("Retell error:", error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to Lisa. Please try again.",
          variant: "destructive",
        });
        setIsCallActive(false);
        setIsConnecting(false);
      });

      await retellWebClient.startCall({
        accessToken: data.access_token,
        sampleRate: 24000,
      });
    } catch (error) {
      console.error("Failed to start call:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start voice call",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const stopCall = () => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall();
      retellClientRef.current = null;
    }
    setIsCallActive(false);
    setIsSpeaking(false);
  };

  const handleToggleCall = () => {
    if (isCallActive) {
      stopCall();
    } else {
      startCall();
    }
  };

  const sendTextMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: inputText.trim() };
    setMessages(prev => [...prev, userMessage]);
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
        body: JSON.stringify({ messages: [...messages, userMessage] }),
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

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            // Incomplete JSON, continue
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
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

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl transition-all duration-500 ${isGlowing ? 'scale-105' : ''}`}>
      {/* Messages Area */}
      {messages.length > 0 && (
        <div className="mb-3 max-h-60 overflow-y-auto space-y-2 px-4 scrollbar-thin">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`text-sm p-3 rounded-lg ${
                m.role === "assistant"
                  ? "bg-card/80 text-foreground"
                  : "bg-secondary/50 text-muted-foreground ml-8"
              }`}
            >
              <span className="font-medium text-xs text-primary mr-2">
                {m.role === "assistant" ? "Lisa:" : "You:"}
              </span>
              {m.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Main Input Bar */}
      <div className="relative flex items-center">
        <div 
          className={`flex-1 bg-card/80 backdrop-blur-sm border rounded-full flex items-center pr-2 transition-all duration-500 ${
            isGlowing 
              ? 'border-primary shadow-[0_0_40px_hsl(5_91%_52%/0.5),0_0_80px_hsl(5_91%_52%/0.3)] animate-pulse' 
              : 'border-border/30'
          }`}
          style={{ 
            background: 'linear-gradient(145deg, hsl(222 47% 12% / 0.9) 0%, hsl(222 47% 8% / 0.95) 100%)'
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Lisa about ERP issues, Oracle Cloud HCM, or implementations..."
            className="flex-1 py-4 px-6 bg-transparent text-foreground placeholder:text-muted-foreground text-base outline-none"
            disabled={isLoading || isCallActive}
          />
          
          {/* Send Button */}
          {inputText.trim() && !isCallActive && (
            <button
              onClick={sendTextMessage}
              disabled={isLoading}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary/50 hover:bg-secondary transition-colors mr-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-primary" />
              )}
            </button>
          )}
          
          {/* Mic Button */}
          <button
            onClick={handleToggleCall}
            disabled={isConnecting || isLoading}
            className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
              isCallActive
                ? isSpeaking
                  ? "bg-primary animate-pulse shadow-[0_0_30px_hsl(187_100%_42%/0.5)]"
                  : "bg-primary shadow-[0_0_20px_hsl(187_100%_42%/0.4)]"
                : "bg-primary hover:scale-105 hover:shadow-[0_0_25px_hsl(187_100%_42%/0.4)]"
            }`}
          >
            {isConnecting ? (
              <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
            ) : isCallActive ? (
              <MicOff className="w-6 h-6 text-primary-foreground" />
            ) : (
              <Mic className="w-6 h-6 text-primary-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Helper Text */}
      <p className="text-center text-muted-foreground text-sm mt-4">
        {isCallActive
          ? isSpeaking
            ? "Lisa is speaking..."
            : "Listening... Speak now"
          : isLoading
            ? "Lisa is thinking..."
            : "Type a message or click the mic to speak with Lisa"}
      </p>
    </div>
  );
}
