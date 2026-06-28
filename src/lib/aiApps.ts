export interface AiAppOption {
  id: string;
  name: string;
  buildUrl: (query?: string) => string;
}

export const AI_APPS: AiAppOption[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    buildUrl: (query) => (query ? `https://chatgpt.com/?q=${encodeURIComponent(query)}` : "https://chatgpt.com/"),
  },
  {
    id: "claude",
    name: "Claude",
    buildUrl: (query) => (query ? `https://claude.ai/new?q=${encodeURIComponent(query)}` : "https://claude.ai/new"),
  },
  {
    id: "gemini",
    name: "Google Gemini",
    buildUrl: (query) => (query ? `https://gemini.google.com/app?q=${encodeURIComponent(query)}` : "https://gemini.google.com/app"),
  },
  {
    id: "perplexity",
    name: "Perplexity",
    buildUrl: (query) => (query ? `https://www.perplexity.ai/search?q=${encodeURIComponent(query)}` : "https://www.perplexity.ai/"),
  },
  {
    id: "copilot",
    name: "Microsoft Copilot",
    buildUrl: (query) => (query ? `https://copilot.microsoft.com/?q=${encodeURIComponent(query)}` : "https://copilot.microsoft.com/"),
  },
];

export function getAiApp(id: string | null): AiAppOption | undefined {
  return AI_APPS.find((a) => a.id === id);
}

export function openInAiApp(app: AiAppOption, query?: string) {
  window.location.href = app.buildUrl(query);
}
