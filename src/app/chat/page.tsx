"use client";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/app/providers";
import { Send, Bot, User } from "lucide-react";

export default function ChatPage() {
  const { lang } = useLanguage();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      initialMsg: "Hello! I'm Sentimind AI. Let's talk about your personality.",
      placeholder: "Type a message...",
      error: "Error: Server is busy.",
      typing: "Sentimind is typing..."
    },
    id: {
      initialMsg: "Halo! Saya Sentimind AI. Mari ngobrol soal kepribadianmu.",
      placeholder: "Ketik pesan...",
      error: "Error: Server lagi pusing.",
      typing: "Sentimind sedang mengetik..."
    }
  };

  const content = t[lang];
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);

  useEffect(() => {
    setMessages([{ role: "bot", text: content.initialMsg }]);
  }, [lang]);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, mbti_type: "INTJ" }), 
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "bot", text: content.error }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIX: Height calc, Main jadi Div, No Padding
    <div className="h-[calc(100vh-9rem)] flex flex-col font-sans bg-fixed relative overflow-hidden">
      
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto p-2 overflow-hidden z-10">
        {/* Area Chat Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-4 scrollbar-thin scrollbar-thumb-orange-500/20">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 animate-in fade-in slide-in-from-bottom-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-full h-fit w-fit flex-shrink-0 ${m.role === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-white/10'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 px-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-tr-none shadow-md' 
                  : 'liquid-glass rounded-tl-none border-gray-200 dark:border-white/10 bg-white/60 dark:bg-black/40'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-center text-xs opacity-50 animate-pulse">{content.typing}</div>}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="liquid-glass p-2 flex gap-2 items-center mt-2 bg-white/50 dark:bg-black/30 backdrop-blur-md">
          <input 
            className="flex-1 bg-transparent p-3 outline-none text-base placeholder:text-gray-400"
            placeholder={content.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="p-3 bg-orange-600 rounded-xl text-white hover:scale-105 transition-transform shadow-lg flex-shrink-0">
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* BLOB DIHAPUS DARI SINI BIAR POLOS */}
    </div>
  );
}