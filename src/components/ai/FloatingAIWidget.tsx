import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Loader2, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RetellWebClient } from "retell-client-js-sdk";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const VOICE_AGENT_ID = "agent_034266f5f5da7f771e6ce8a76d";
const DOCTOR_AI_AGENT_ID = "agent_a14a542d3a6ac9353e45338f3a";
const PROPERTY_AGENT_ID = "agent_d08b63f706de8be2deb9a1e25a";
const CHAT_AGENT_ID = "agent_02c29f63f5d480c9737369dbf9";

const detectSpecialAgent = (text: string): string | null => {
  const lower = text.toLowerCase();
  if (lower.includes("doctor") || lower.includes("medical") || lower.includes("health")) {
    return DOCTOR_AI_AGENT_ID;
  }
  if (
    lower.includes("realtor") ||
    lower.includes("property") ||
    lower.includes("maintenance") ||
    lower.includes("tenant") ||
    lower.includes("lease")
  ) {
    return PROPERTY_AGENT_ID;
  }
  return null;
};

export function FloatingAIWidget() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const retellClientRef = useRef<RetellWebClient | null>(null);
  const chatSessionIdRef = useRef<string | null>(null);
  const currentAgentIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Listen for glow trigger event
  const handleGlowTrigger = useCallback(() => {
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 3000);
  }, []);

  useEffect(() => {
    window.addEventListener("triggerLisaGlow", handleGlowTrigger);
    return () => window.removeEventListener("triggerLisaGlow", handleGlowTrigger);
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

  const startCall = async (agentId: string = VOICE_AGENT_ID) => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const { data, error } = await supabase.functions.invoke("retell-create-web-call", {
        body: { agent_id: agentId },
      });

      if (error || !data?.access_token) {
        throw new Error(error?.message || "Failed to get access token");
      }

      const retellWebClient = new RetellWebClient();
      retellClientRef.current = retellWebClient;

      retellWebClient.on("call_started", () => {
        console.log("Call started with agent:", agentId);
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
          description: "Failed to connect. Please try again.",
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

  // Switch to a special agent: disconnect current voice agent and start a chat session, then forward the user's first message
  const switchToSpecialAgent = async (agentId: string, firstMessage: string = "Hi") => {
    stopCall();
    chatSessionIdRef.current = null;
    setIsLoading(true);

    try {
      const { data: chatData, error: chatError } = await supabase.functions.invoke("retell-chat", {
        body: {
          action: "create_chat",
          agent_id: agentId,
          customer_id: "feb8dc09-6566-4d2a-bcc1-79a1abde07a7",
          agent_name: "Lisa",
          customer_company: "KairosFS",
          customer_name: "Roy",
        },
      });
      if (chatError || !chatData?.chat_id) {
        throw new Error(chatError?.message || "Failed to create chat session");
      }
      chatSessionIdRef.current = chatData.chat_id;
      currentAgentIdRef.current = agentId;

      const { data, error } = await supabase.functions.invoke("retell-chat", {
        body: {
          action: "send_message",
          session_id: chatData.chat_id,
          message: firstMessage,
        },
      });
      if (error) throw new Error(error.message);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data?.response || "Hello! How can I help you?",
        },
      ]);
    } catch (error) {
      console.error("Failed to connect to special agent:", error);
      // Reset session refs on failure so the next message can retry cleanly
      chatSessionIdRef.current = null;
      currentAgentIdRef.current = null;
      toast({
        title: "Error",
        description: "Failed to connect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Text chat via retell-chat edge function
  const sendTextMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const messageContent = inputText.trim();

    // Check for special agent triggers — only switch if we're not already on that agent
    const specialAgentId = detectSpecialAgent(messageContent);
    if (specialAgentId && currentAgentIdRef.current !== specialAgentId) {
      const userMessage: Message = { role: "user", content: messageContent };
      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      // Forward the user's actual message to the new agent instead of a hardcoded "Hi"
      await switchToSpecialAgent(specialAgentId, messageContent);
      return;
    }

    const userMessage: Message = { role: "user", content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Create chat session if we don't have one
      if (!chatSessionIdRef.current) {
        const { data: chatData, error: chatError } = await supabase.functions.invoke("retell-chat", {
          body: { action: "create_chat", agent_id: CHAT_AGENT_ID },
        });

        if (chatError || !chatData?.chat_id) {
          throw new Error(chatError?.message || "Failed to create chat session");
        }
        chatSessionIdRef.current = chatData.chat_id;
        currentAgentIdRef.current = CHAT_AGENT_ID;
      }

      // Send message
      const { data, error } = await supabase.functions.invoke("retell-chat", {
        body: {
          action: "send_message",
          session_id: chatSessionIdRef.current,
          message: messageContent,
        },
      });

      if (error) throw new Error(error.message);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data?.response || "I'm sorry, I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      // Reset session on error — the chat may have expired on Retell's side.
      // The next message will create a fresh session instead of repeatedly hitting a dead one.
      chatSessionIdRef.current = null;
      currentAgentIdRef.current = null;
      toast({
        title: "Connection lost",
        description: "Reconnecting… please send your message again.",
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

  const clearChat = () => {
    setMessages([]);
    chatSessionIdRef.current = null;
    currentAgentIdRef.current = null;
  };

  const sendSuggestion = async (text: string) => {
    if (isLoading) return;
    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    try {
      if (!chatSessionIdRef.current) {
        const { data: chatData, error: chatError } = await supabase.functions.invoke("retell-chat", {
          body: { action: "create_chat", agent_id: CHAT_AGENT_ID },
        });
        if (chatError || !chatData?.chat_id) throw new Error(chatError?.message || "Failed to create chat session");
        chatSessionIdRef.current = chatData.chat_id;
        currentAgentIdRef.current = CHAT_AGENT_ID;
      }
      const { data, error } = await supabase.functions.invoke("retell-chat", {
        body: { action: "send_message", session_id: chatSessionIdRef.current, message: text },
      });
      if (error) throw new Error(error.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data?.response || "I'm sorry, I couldn't generate a response." },
      ]);
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const SUGGESTIONS = [
    "Setup meeting with DoingERP staff",
    "Setup interviews",
    "Screen candidates",
    "Staff mode",
    "Something Else",
  ];

  return (
    <div
      className={`fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[85%] max-w-3xl md:max-w-2xl transition-all duration-500 ${isGlowing ? "scale-105" : ""}`}
    >
      {/* Chat Panel */}
      {messages.length > 0 && (
        <div
          className="mb-2 md:mb-3 relative rounded-2xl border border-border overflow-hidden"
          style={{ background: "hsl(222 47% 7%)" }}
        >
          <button
            onClick={clearChat}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary hover:bg-destructive flex items-center justify-center transition-colors z-10"
            title="Close chat"
          >
            <X size={14} className="text-foreground" />
          </button>

          <div className="max-h-[40vh] md:max-h-[22rem] overflow-y-auto space-y-2 p-3 md:p-4 scrollbar-thin">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm p-2 md:p-3 rounded-lg ${
                  m.role === "assistant" ? "text-foreground" : "ml-6 md:ml-8 text-muted-foreground"
                }`}
                style={{
                  background: m.role === "assistant" ? "hsl(222 47% 11%)" : "hsl(222 47% 14%)",
                }}
              >
                <span className="font-medium text-xs text-primary mr-2">
                  {m.role === "assistant" ? "Lisa:" : "You:"}
                </span>
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div className="text-sm p-2 md:p-3 rounded-lg text-foreground" style={{ background: "hsl(222 47% 11%)" }}>
                <span className="font-medium text-xs text-primary mr-2">Lisa:</span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Main Input Bar */}
      <div className="relative flex items-end">
        <div
          className={`flex-1 border rounded-2xl flex flex-col transition-all duration-500 overflow-hidden md:shadow-[0_0_30px_hsl(5_91%_52%/0.25),0_0_60px_hsl(5_91%_52%/0.15)] md:hover:shadow-[0_0_40px_hsl(5_91%_52%/0.4),0_0_80px_hsl(5_91%_52%/0.2)] ${
            isGlowing
              ? "border-primary shadow-[0_0_40px_hsl(5_91%_52%/0.5),0_0_80px_hsl(5_91%_52%/0.3)] animate-pulse"
              : "border-border md:border-primary/30"
          }`}
          style={{ background: "hsl(222 47% 10%)" }}
        >
          <div className="flex items-center pr-2 md:pr-4 gap-1.5 md:gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message or tap mic to talk to Lisa"
              className="flex-1 min-w-0 py-2.5 md:py-2.5 pl-3 md:pl-5 pr-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none min-h-[44px] md:min-h-[40px] truncate"
              disabled={isLoading}
            />

            <div className="flex items-center flex-shrink-0 my-1 p-0.5 md:my-1.5 md:p-1 rounded-full bg-background/40 border border-border/60 ring-1 ring-primary/10 shadow-[0_0_0_3px_hsl(222_47%_10%)] md:shadow-[0_0_0_4px_hsl(222_47%_10%)]">
              {inputText.trim() ? (
                <button
                  onClick={sendTextMessage}
                  disabled={isLoading}
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-primary animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  )}
                </button>
              ) : (
                <button
                  onClick={handleToggleCall}
                  disabled={isConnecting || isLoading}
                  className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCallActive
                      ? isSpeaking
                        ? "bg-primary animate-pulse"
                        : "bg-primary"
                      : "bg-primary hover:bg-primary/90 hover:shadow-[0_0_18px_hsl(5_91%_52%/0.45)]"
                  }`}
                  aria-label={isCallActive ? "Stop voice call" : "Start voice call"}
                >
                  {isConnecting ? (
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground animate-spin" />
                  ) : isCallActive ? (
                    <MicOff className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                  ) : (
                    <Mic className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Suggestion Chips — inside the box, below the textarea */}
          {messages.length === 0 && !isCallActive && (
            <div className="flex gap-1.5 px-3 md:px-4 pb-2 md:pb-3 pt-1 overflow-x-auto md:overflow-visible md:flex-nowrap md:justify-between no-scrollbar border-t border-border/40">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendSuggestion(s)}
                  disabled={isLoading}
                  className="flex-shrink-0 md:flex-1 md:min-w-0 px-2.5 py-1 rounded-full text-xs border border-border text-muted-foreground hover:text-foreground hover:border-primary/60 transition-all duration-200 whitespace-nowrap md:truncate md:text-center"
                  style={{ background: "hsl(222 47% 13%)" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
