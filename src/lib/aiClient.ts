import { getSetting } from "./db";

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export async function hasApiKey(): Promise<boolean> {
  const key = await getSetting<string>("ai_api_key", "");
  return Boolean(key);
}

export async function askAssistant(messages: AiMessage[]): Promise<string> {
  const apiKey = await getSetting<string>("ai_api_key", "");
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`Assistant request failed (${res.status})`);
  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}
