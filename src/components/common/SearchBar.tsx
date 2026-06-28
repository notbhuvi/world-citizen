"use client";

import { Search, Mic } from "lucide-react";
import { useState, useRef } from "react";

export default function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  onVoice,
}: {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onVoice?: (transcript: string) => void;
}) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startVoice = () => {
    const SpeechRecognitionImpl =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionImpl) {
      alert("Voice search isn't supported in this browser yet.");
      return;
    }

    const recognition = new SpeechRecognitionImpl();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange(transcript);
      onVoice?.(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  return (
    <div className="glass flex items-center gap-2 rounded-xl px-3 py-2.5">
      <Search size={16} className="text-muted shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
      />
      <button
        aria-label="Voice search"
        onClick={startVoice}
        className={`shrink-0 rounded-full p-1.5 transition-colors ${listening ? "bg-danger/20 text-danger" : "text-muted"}`}
      >
        <Mic size={16} />
      </button>
    </div>
  );
}
