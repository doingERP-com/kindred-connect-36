import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, X, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RetellWebClient } from "retell-client-js-sdk";
import { supabase } from "@/integrations/supabase/client";

interface Transcript {
  role: "agent" | "user";
  content: string;
}

const AGENT_ID = "agent_ec9be380f089686b64dce6289a";

export function FloatingAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [inputText, setInputText] = useState("");
  const retellClientRef = useRef<RetellWebClient | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts]);

  useEffect(() => {
    return () => {
      if (retellClientRef.current) {
        retellClientRef.current.stopCall();
      }
    };
  }, []);

  const startCall = async () => {
    setIsConnecting(true);
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get access token from edge function
      const { data, error } = await supabase.functions.invoke("retell-create-web-call", {
        body: { agent_id: AGENT_ID },
      });

      if (error || !data?.access_token) {
        throw new Error(error?.message || "Failed to get access token");
      }

      // Initialize Retell client
      const retellWebClient = new RetellWebClient();
      retellClientRef.current = retellWebClient;

      // Set up event listeners
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
          setTranscripts(
            update.transcript.map((t) => ({
              role: t.role as "agent" | "user",
              content: t.content,
            }))
          );
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

      // Start the call
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

  return (
    <>
      {/* Floating Widget Button - shows when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full gradient-primary glow-primary flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-7 h-7 text-primary-foreground" />
        </button>
      )}

      {/* Main Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl animate-fade-up">
          <div className="glass-card rounded-3xl p-6 border-primary/20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            
            {/* Close Button */}
            <button
              onClick={() => {
                stopCall();
                setIsOpen(false);
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Transcript Area */}
            {transcripts.length > 0 && (
              <div className="mb-4 max-h-48 overflow-y-auto space-y-2 pr-2">
                {transcripts.map((t, i) => (
                  <div
                    key={i}
                    className={`text-sm p-2 rounded-lg ${
                      t.role === "agent"
                        ? "bg-primary/10 text-foreground"
                        : "bg-secondary text-muted-foreground ml-8"
                    }`}
                  >
                    <span className="font-medium text-xs text-primary mr-2">
                      {t.role === "agent" ? "Lisa:" : "You:"}
                    </span>
                    {t.content}
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </div>
            )}

            {/* Input Area */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Ask Lisa about ERP issues, Oracle Cloud HCM, or implementations..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full bg-secondary/50 border-border/50 rounded-full py-6 pl-5 pr-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
                  disabled={isCallActive}
                />
              </div>

              {/* Voice Button */}
              <Button
                onClick={handleToggleCall}
                disabled={isConnecting}
                className={`w-14 h-14 rounded-full flex-shrink-0 transition-all duration-300 ${
                  isCallActive
                    ? isSpeaking
                      ? "bg-primary animate-pulse glow-primary"
                      : "bg-primary glow-primary"
                    : "gradient-primary hover:scale-105"
                }`}
              >
                {isConnecting ? (
                  <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
                ) : isCallActive ? (
                  <MicOff className="w-6 h-6 text-primary-foreground" />
                ) : (
                  <Mic className="w-6 h-6 text-primary-foreground" />
                )}
              </Button>
            </div>

            {/* Helper Text */}
            <p className="text-center text-muted-foreground text-sm mt-4">
              {isCallActive
                ? isSpeaking
                  ? "Lisa is speaking..."
                  : "Listening... Speak now"
                : "Type or click the mic to speak with Lisa, your AI ERP expert"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
