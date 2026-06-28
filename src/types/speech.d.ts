interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResult {
  [index: number]: { [index: number]: SpeechRecognitionResultItem; transcript: string };
  0: { 0: { transcript: string }; transcript: string };
}

interface SpeechRecognitionEvent extends Event {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

declare const SpeechRecognition: {
  new (): SpeechRecognition;
};
