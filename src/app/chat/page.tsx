"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, AlertCircle, Mic, MicOff } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers";

// Fallback utility
function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}

interface Message {
    id: string;
    role: "user" | "bot";
    content: string;
}

// --- TYPEWRITER COMPONENT dengan Markdown Real-time ---
const Typewriter = ({ text, speed = 10, onTyping }: { text: string; speed?: number; onTyping?: () => void }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        setDisplayedText("");
        setIsTyping(true);
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
                // Scroll ke bawah setiap karakter baru
                onTyping?.();
            } else {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, onTyping]);

    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Style untuk bold
                    strong: ({ children }) => <strong className="font-bold text-orange-500">{children}</strong>,
                    // Style untuk table
                    table: ({ children }) => <table className="border-collapse my-4 w-full text-sm">{children}</table>,
                    thead: ({ children }) => <thead className="bg-orange-500/20">{children}</thead>,
                    th: ({ children }) => <th className="border border-gray-600 px-3 py-2 text-left font-bold">{children}</th>,
                    td: ({ children }) => <td className="border border-gray-700 px-3 py-2">{children}</td>,
                    // Style untuk list
                    ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="ml-2">{children}</li>,
                    // Style untuk code
                    code: ({ children }) => <code className="bg-orange-500/20 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                    // Style untuk heading
                    h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-bold mt-2 mb-1">{children}</h3>,
                }}
            >
                {displayedText}
            </ReactMarkdown>
            {isTyping && (
                <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-orange-500 animate-pulse" />
            )}
        </div>
    );
};

export default function ChatPage() {
    const { lang } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                // CONTINUOUS: TRUE -> Biar gak berhenti pas diem bentar (nunggu mikir)
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = lang === 'id' ? 'id-ID' : 'en-US';

                recognition.onresult = (event: any) => {
                    let currentTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                    // Kita update input value realtime, tapi user harus STOP manual biar UX nya jelas
                    // Atau bisa juga kita append ke existing value
                    if (currentTranscript) {
                        // Strategi: Karena continuous, kita ambil yang paling baru
                        // Tapi logic update state di React agak tricky sama continuous speech
                        // Simplifikasi: Kita ambil transcript terakhir yang final atau interim
                        // Note: Ini versi simple biar gak ribet state merging-nya
                        setInputValue(currentTranscript);
                    }
                };

                recognition.onerror = (event: any) => {
                    console.error("Voice Error:", event.error);
                    if (event.error !== 'no-speech') {
                        setIsListening(false);
                    }
                };

                // Jangan auto setsListening(false) di onend, biar user yg kontrol (toggle)
                // Kecuali error berat

                recognitionRef.current = recognition;
            }
        }
    }, [lang]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Browser kamu gak support voice input bro. Coba Chrome.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            // Reset input pas mulai ngomong (opsional, tergantung preferensi)
            // setInputValue(""); 
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleSendMessage = async (text: string) => {
        const messageText = text || inputValue;
        if (!messageText.trim()) return;

        // Stop listening if sending
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        setError(null);
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: messageText,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_CHATBOT_URL || "http://localhost:8000/api/chat";

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: messageText,
                    lang: lang
                }),
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                content: data.response || "Maaf, saya tidak mengerti.",
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (err: any) {
            console.error("Chat Error:", err);
            setError("Gagal terhubung ke backend. Pastikan server API (port 8000) sudah jalan.");
        } finally {
            setIsLoading(false);
        }
    };

    const t = {
        en: {
            title: "Sentimind Chat",
            desc: "Consult about MBTI, psychology, and mental health.",
            placeholder: "Type or use voice...",
            thinking: "Thinking...",
            powerBy: "Powered by Gemini. AI may make mistakes.",
            suggestions: [
                "What is INTJ personality?",
                "How to overcome social anxiety?",
                "Explain Fe vs Fi cognitive functions",
                "Why do INFJs feel lonely?"
            ],
            emptyState: "Start a conversation..."
        },
        id: {
            title: "Sentimind AI Chat",
            desc: "Ngobrol santai soal MBTI, psikologi, dan kesehatan mental.",
            placeholder: "Ketik atau ngomong langsung...",
            thinking: "Bentar bre, mikir dulu...",
            powerBy: "Ditenagai Gemini. AI bisa aja salah, namanya juga bot.",
            suggestions: [
                "Apa itu tipe kepribadian INTJ?",
                "Gimana cara ngilangin cemas?",
                "Bedanya Fe sama Fi apa sih?",
                "Kenapa INFJ sering merasa kesepian?"
            ],
            emptyState: "Tanya apa gitu..."
        }
    };

    const content = t[lang] || t.en;

    return (
        <div className="w-full flex flex-col pt-20 font-sans min-h-screen">

            {/* Main Chat Content */}
            <div className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-0 flex flex-col">

                {/* Header (Only show if no messages) */}
                {messages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500 py-10 min-h-[40vh]">
                        <div className="p-2 bg-orange-100 dark:bg-orange-500/10 rounded-full mb-2">
                            <Sparkles className="text-orange-600 dark:text-orange-400 w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                                {content.title}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">
                                {content.desc}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
                            {content.suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSendMessage(s)}
                                    className="p-4 text-left text-sm bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:bg-orange-50 dark:hover:bg-neutral-800 hover:border-orange-300 dark:hover:border-orange-700/50 rounded-2xl transition-all text-gray-600 dark:text-gray-300 shadow-sm"
                                >
                                    "{s}"
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chat Messages */}
                <div className="space-y-6 flex-1 mb-8">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={classNames(
                                "flex gap-4 md:gap-6 animate-in slide-in-from-bottom-2 duration-300",
                                msg.role === "user" ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            {/* Avatar */}
                            <div className={classNames(
                                "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1",
                                msg.role === "user"
                                    ? "bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-200"
                                    : "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400"
                            )}>
                                {msg.role === "user" ? <User size={18} /> : <Bot size={20} />}
                            </div>

                            {/* Content */}
                            <div className={classNames(
                                "max-w-[85%] md:max-w-[80%] text-[15px] md:text-base leading-7",
                                msg.role === "user"
                                    ? "bg-orange-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md"
                                    : "text-gray-800 dark:text-gray-200 px-2 py-1 prose dark:prose-invert max-w-none"
                            )}>
                                {msg.role === "bot" ? (
                                    <Typewriter text={msg.content} speed={15} onTyping={scrollToBottom} />
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex gap-4 md:gap-6 animate-pulse">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-1">
                                <Bot size={20} />
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                    <Loader2 size={16} className="animate-spin" />
                                    {content.thinking}
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-center">
                            <p>{error}</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* STICKY Input Area */}
            <div className="sticky bottom-0 left-0 w-full bg-background pb-6 pt-4 px-4 md:px-0 z-30">
                <div className="max-w-3xl mx-auto relative">
                    {/* Shadow gradient top for nice effect */}
                    <div className="absolute -top-10 left-0 w-full h-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />

                    <div className="relative flex items-center bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm rounded-3xl p-2 transition-all focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500">
                        {/* Voice Button */}
                        <button
                            onClick={toggleListening}
                            className={classNames(
                                "p-3 rounded-full transition-all flex items-center justify-center mr-1",
                                isListening
                                    ? "bg-red-500 text-white animate-pulse"
                                    : "bg-transparent text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800 hover:text-gray-600"
                            )}
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>

                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                            placeholder={content.placeholder}
                            disabled={isLoading}
                            className="w-full bg-transparent border-none focus:ring-0 rounded-full px-2 py-3 text-base text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
                        />
                        <button
                            onClick={() => handleSendMessage(inputValue)}
                            disabled={!inputValue.trim() || isLoading}
                            className="p-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:hover:bg-orange-600 text-white rounded-full transition-all shadow-sm transform hover:scale-105 active:scale-95 ml-2"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-center text-[10px] md:text-xs text-gray-400 mt-3 -mb-3 opacity-70">
                        {content.powerBy}
                    </p>
                </div>
            </div>
        </div>
    );
}
