import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatSession {
  chat_id: string;
  agent_id: string;
}

// Store chat sessions in memory (in production, use a database)
const chatSessions = new Map<string, string>();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RETELL_API_KEY = Deno.env.get("RETELL_API_KEY");
    if (!RETELL_API_KEY) {
      throw new Error("RETELL_API_KEY is not configured");
    }

    const { action, agent_id, message, session_id } = await req.json();

    // Create a new chat session
    if (action === "create_chat") {
      console.log("Creating chat session for agent:", agent_id);
      
      const response = await fetch("https://api.retellai.com/v2/create-chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RETELL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agent_id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Retell create chat error:", response.status, errorText);
        throw new Error(`Retell API error: ${response.status} - ${errorText}`);
      }

      const data: ChatSession = await response.json();
      console.log("Chat session created:", data.chat_id);

      return new Response(JSON.stringify({ chat_id: data.chat_id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send a message in an existing chat
    if (action === "send_message") {
      if (!session_id || !message) {
        throw new Error("session_id and message are required");
      }

      console.log("Sending message to chat:", session_id);

      const response = await fetch("https://api.retellai.com/v2/create-chat-completion", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RETELL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: session_id,
          content: message,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Retell chat completion error:", response.status, errorText);
        throw new Error(`Retell API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Chat response received");

      // Extract the latest agent message
      const messages = data.messages || [];
      const lastAgentMessage = messages.filter((m: { role: string }) => m.role === "agent").pop();

      return new Response(JSON.stringify({ 
        response: lastAgentMessage?.content || "I'm sorry, I couldn't generate a response.",
        messages: messages
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action. Use 'create_chat' or 'send_message'");

  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
