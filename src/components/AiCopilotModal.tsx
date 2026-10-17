import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RotateCcw, 
  BookOpen, 
  ShieldCheck, 
  Cpu, 
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { Asset } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AiCopilotModalProps {
  assets: Asset[];
  currentAsset: Asset;
}

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({
  assets,
  currentAsset,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(currentAsset.id);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello! I am **Daxoriq AI Copilot**, your certified condition monitoring and industrial reliability assistant.

I am actively connected to your plant's SCADA sensor streams, OEM service manuals, and CMMS work order registry. 

Currently monitoring: **${currentAsset.name}** (${currentAsset.tag}). How can I assist you with diagnostic triage, vibration spectral analysis, or maintenance procedures today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeAsset = assets.find(a => a.id === selectedAssetId) || currentAsset;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    `Analyze vibration peaks and ISO 10816-3 compliance for ${activeAsset.tag}`,
    `Step-by-step bearing replacement guide and induction heating parameters`,
    `How does NASA C-MAPSS model RUL degradation curves?`,
    `Troubleshoot spindle chatter and cutting tool wear on CNC-04`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          contextAsset: {
            name: activeAsset.name,
            tag: activeAsset.tag,
            status: activeAsset.status,
            healthScore: activeAsset.healthScore,
            rulHours: activeAsset.rulHours,
            sensors: activeAsset.sensors.map(s => ({ name: s.name, value: s.value, unit: s.unit })),
            manuals: activeAsset.manuals,
          },
        }),
      });

      const data = await response.json();
      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'Unable to reach the Daxoriq AI engine. Please verify network connectivity or check server logs.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <span>AI Diagnostic Copilot & Maintenance Knowledge Base</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Powered by Gemini 3.8 Flash, grounded in OEM machinery manuals, vibration standards, and live SCADA telemetry.
          </p>
        </div>

        {/* Machine Context Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
          <span className="text-slate-400 font-medium">Context Asset:</span>
          <select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500"
          >
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.tag})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col h-[650px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => {
            const isBot = msg.role === 'assistant';
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                )}

                <div className={`relative max-w-2xl rounded-lg p-4 text-xs leading-relaxed space-y-2 ${
                  isBot 
                    ? 'bg-slate-950 border border-slate-800 text-slate-200' 
                    : 'bg-cyan-600 text-white font-medium'
                }`}>
                  {/* Copy Button for Bot Messages */}
                  {isBot && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.content)}
                      className="absolute top-2 right-2 p-1 text-slate-500 hover:text-slate-300 rounded"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Consulting OEM service manuals and analyzing sensor telemetry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-6 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">Quick Inquiries:</span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded px-2.5 py-1 whitespace-nowrap transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            placeholder={`Ask Daxoriq AI about ${activeAsset.name}, ISO standards, or repair steps...`}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isLoading}
            className="flex items-center justify-center p-2.5 text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 rounded-lg transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
