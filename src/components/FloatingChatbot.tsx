import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  User, 
  Copy, 
  Check, 
  Minimize2, 
  Maximize2,
  ChevronDown,
  Info
} from 'lucide-react';
import { Asset } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface FloatingChatbotProps {
  assets: Asset[];
  selectedAsset: Asset;
  isOpen: boolean;
  onToggle: () => void;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({
  assets,
  selectedAsset,
  isOpen,
  onToggle,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hi, I'm the Daxoriq maintenance copilot.

I can help you explore the selected demo asset, understand the sample readings shown in this prototype, and draft questions for a qualified maintenance professional.

This sandbox uses embedded benchmark samples and simulated telemetry. It is not connected to a live factory, OEM manuals, or a CMMS. Do not use it for safety-critical decisions.

Selected demo asset: **${selectedAsset.name}** (${selectedAsset.tag}).`,
      timestamp: 'Just now'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickChips = [
    `How does NASA C-MAPSS calculate RUL?`,
    `Explain vibration spike on ${selectedAsset.tag}`,
    `ISO 10816-3 velocity alarm thresholds`,
    `Draft work order for bearing replacement`
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          contextAsset: {
            name: selectedAsset.name,
            tag: selectedAsset.tag,
            status: selectedAsset.status,
            healthScore: selectedAsset.healthScore,
            rulHours: selectedAsset.rulHours,
            sensors: selectedAsset.sensors.map(s => ({ name: s.name, value: s.value, unit: s.unit })),
            manuals: selectedAsset.manuals,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || `AI service returned HTTP ${response.status}`);
      }
      const botMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const botMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: err instanceof Error
          ? `I couldn't reach the AI service: ${err.message}. Check that the server is running and GEMINI_API_KEY is configured, then try again. No diagnosis was generated.`
          : 'I could not reach the AI service. Check the server configuration and try again. No diagnosis was generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-cyan-400/40"
      >
        <Bot className="w-5 h-5 text-cyan-100" />
        <span>Ask Daxoriq AI</span>
        <span className="text-[10px] font-medium text-cyan-100/80">Demo</span>
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden ${
      isExpanded 
        ? 'inset-4 sm:inset-10' 
        : 'bottom-6 right-6 w-[92vw] sm:w-[420px] h-[580px]'
    }`}>
      
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>Daxoriq AI Copilot</span>
              <span className="text-[10px] font-medium text-cyan-300 bg-cyan-950 px-1.5 rounded">
                AI assistant
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Machine: <strong className="text-slate-300">{selectedAsset.tag}</strong> ({selectedAsset.healthScore}% Health)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Restore chat size' : 'Expand chat'}
            className="p-2 hover:text-white hover:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title={isExpanded ? 'Restore chat size' : 'Expand chat'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggle}
            aria-label="Close AI copilot"
            className="p-2 hover:text-white hover:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title="Close AI copilot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900 text-xs">
        {messages.map(msg => {
          const isBot = msg.role === 'assistant';
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}>
              {isBot && (
                <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}

              <div className={`relative max-w-[85%] rounded-xl p-3 text-xs leading-relaxed space-y-1.5 ${
                isBot 
                  ? 'bg-slate-950 border border-slate-800 text-slate-200 shadow-sm' 
                  : 'bg-cyan-600 text-white font-medium'
              }`}>
                {isBot && (
                  <button
                    onClick={() => copyToClipboard(msg.id, msg.content)}
                    className="absolute top-2 right-2 p-1 text-slate-500 hover:text-slate-300"
                    title="Copy"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}

                <div className="whitespace-pre-wrap">
                  {msg.content}
                </div>

                <div className={`text-[10px] font-mono text-right ${isBot ? 'text-slate-500' : 'text-cyan-200'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {!isBot && (
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Analyzing telemetry & consulting OEM manual...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2 bg-slate-950/70 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap transition-colors shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask maintenance question..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputPrompt.trim() || isLoading}
          className="p-2 text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
