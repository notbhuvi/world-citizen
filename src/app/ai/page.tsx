"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Mic, Volume2, KeyRound, Bot, User } from "lucide-react";
import SectionShell from "@/components/common/SectionShell";
import GlassCard from "@/components/common/GlassCard";
import { getSetting, setSetting } from "@/lib/db";
import { askAssistant, type AiMessage } from "@/lib/aiClient";
import { getSection } from "@/lib/sections";

export default function AiPage() {
  const meta = getSection("ai")!;
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSetting<string>("ai_api_key", "").then((k) => {
      setApiKey(k);
      setShowKeyInput(!k);
    });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const listen = () => {
    const SpeechRecognitionImpl =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognitionImpl) {
      alert("Voice input isn't supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognitionImpl();
    recognition.lang = "en-US";
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    setListening(true);
    recognition.start();
  };

  const send = async () => {
    if (!input.trim()) return;
    const next: AiMessage[] = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");

    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    setLoading(true);
    try {
      const reply = await askAssistant(next);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I couldn't reach the assistant. Check your API key and connection." }]);
    } finally {
      setLoading(false);
    }
  };

  const saveKey = async () => {
    await setSetting("ai_api_key", apiKey);
    setShowKeyInput(false);
  };

  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      {showKeyInput && (
        <GlassCard className="mb-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <KeyRound size={16} /> Connect an AI provider
          </div>
          <p className="mb-3 text-xs text-muted">
            Voice search and text-to-speech work right now without any setup. For conversational AI, trip planning, and
            document help, add your own Anthropic API key — it&apos;s stored only on this device, never sent anywhere
            except directly to Anthropic.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="glass flex-1 rounded-xl px-3 py-2 text-sm outline-none"
            />
            <button onClick={saveKey} className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white">
              Save
            </button>
          </div>
        </GlassCard>
      )}

      <div className="mb-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted">
            Ask me about local rules, plan a trip, explain a document, or just tap the mic to speak.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                <Bot size={14} />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${m.role === "user" ? "bg-accent text-white" : "glass"}`}>
              {m.content}
              {m.role === "assistant" && (
                <button onClick={() => speak(m.content)} className="ml-2 inline text-muted">
                  <Volume2 size={12} className="inline" />
                </button>
              )}
            </div>
            {m.role === "user" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/10 dark:bg-white/10">
                <User size={14} />
              </div>
            )}
          </div>
        ))}
        {loading && <p className="text-xs text-muted">Thinking…</p>}
        <div ref={endRef} />
      </div>

      <div className="fixed bottom-24 left-0 right-0 px-4">
        <div className="glass mx-auto flex max-w-md items-center gap-2 rounded-2xl p-2">
          <button
            onClick={listen}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${listening ? "bg-danger/20 text-danger" : "text-muted"}`}
          >
            <Mic size={18} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask anything…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
          <button onClick={send} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
            <Send size={16} />
          </button>
        </div>
      </div>
    </SectionShell>
  );
}
