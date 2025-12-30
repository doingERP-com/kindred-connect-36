import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RetellWebClient } from "retell-client-js-sdk";
import { supabase } from "@/integrations/supabase/client";

interface Transcript {
  role: "agent" | "user";
  content: string;
}

const AGENT_ID = "agent_ec9be380f089686b64dce6289a";

export function FloatingAIWidget() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const retellClientRef = useRef<RetellWebClient | null>(null);
  const { toast } = useToast();

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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl">
      {/* Transcript Area - Only shows when there are transcripts */}
      {transcripts.length > 0 && (
        <div className="mb-3 max-h-40 overflow-y-auto space-y-2 px-4">
          {transcripts.map((t, i) => (
            <div
              key={i}
              className={`text-sm p-2 rounded-lg ${
                t.role === "agent"
                  ? "bg-card/80 text-foreground"
                  : "bg-secondary/50 text-muted-foreground ml-8"
              }`}
            >
              <span className="font-medium text-xs text-primary mr-2">
                {t.role === "agent" ? "Lisa:" : "You:"}
              </span>
              {t.content}
            </div>
          ))}
        </div>
      )}

      {/* Main Input Bar */}
      <div className="relative flex items-center">
        <div 
          className="flex-1 bg-card/80 backdrop-blur-sm border border-border/30 rounded-full flex items-center pr-2"
          style={{ 
            background: 'linear-gradient(145deg, hsl(222 47% 12% / 0.9) 0%, hsl(222 47% 8% / 0.95) 100%)'
          }}
        >
          <div className="flex-1 py-4 px-6">
            <span className="text-muted-foreground text-base">
              Ask Lisa about ERP issues, Oracle Cloud HCM, or implementations...
            </span>
          </div>
          
          {/* Mic Button */}
          <button
            onClick={handleToggleCall}
            disabled={isConnecting}
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
          : "Type or click the mic to speak with Lisa, your AI ERP expert"}
      </p>
    </div>
  );
}
