"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, AlertCircle, Mic, MicOff } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers";
import { motion, AnimatePresence } from "framer-motion";

// Fallback utility
function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}

interface Message {
    id: string;
    role: "user" | "bot";
    content: string;
}

// --- REUSABLE MARKDOWN COMPONENTS ---
const markdownComponents = {
    // Style untuk bold
    strong: ({ children }: any) => <strong className="font-bold text-orange-500">{children}</strong>,
    // Style untuk table
    table: ({ children }: any) => <div className="overflow-x-auto my-4"><table className="border-collapse w-full text-sm">{children}</table></div>,
    thead: ({ children }: any) => <thead className="bg-orange-500/10 dark:bg-orange-500/20">{children}</thead>,
    th: ({ children }: any) => <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-bold">{children}</th>,
    td: ({ children }: any) => <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">{children}</td>,
    // Style untuk list
    ul: ({ children }: any) => <ul className="list-disc list-outside pl-5 my-2 space-y-1">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-outside pl-5 my-2 space-y-1">{children}</ol>,
    // Code block styling
    code: ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || "");
        return !inline ? (
            <div className="rounded-md overflow-hidden my-2 border border-gray-200 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs text-gray-500 font-mono border-b border-gray-200 dark:border-gray-700">
                    {match ? match[1] : 'code'}
                </div>
                <div className="bg-gray-50 dark:bg-[#1e1e1e] p-3 overflow-x-auto">
                    <code className={className} {...props}>
                        {children}
                    </code>
                </div>
            </div>
        ) : (
            <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-orange-600 dark:text-orange-400" {...props}>
                {children}
            </code>
        );
    }
};

// --- TYPEWRITER COMPONENT dengan Markdown Real-time ---
const Typewriter = ({ text, speed = 10, onTyping, onComplete }: { text: string; speed?: number; onTyping?: () => void; onComplete?: () => void }) => {
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
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
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
    const [typedMessages, setTypedMessages] = useState<Set<string>>(new Set());

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    // Only auto-scroll if user is already near the bottom
    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        const container = messagesContainerRef.current;
        if (!container) return;

        // Threshold lebih kecil (50px) biar user gampang scroll ke atas tanpa ditarik balik
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
        if (isNearBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
        }
    };

    useEffect(() => {
        // Force scroll on new messages
        scrollToBottom("smooth");
    }, [messages, isLoading]);

    // Initialize Speech Recognition
    const accumulatedTranscriptRef = useRef<string>('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = lang === 'id' ? 'id-ID' : 'en-US';

                recognition.onresult = (event: any) => {
                    let finalTranscript = '';
                    let interimTranscript = '';

                    for (let i = 0; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript + ' ';
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }

                    // Gabungkan final + interim untuk display
                    setInputValue(finalTranscript + interimTranscript);
                    accumulatedTranscriptRef.current = finalTranscript;
                };

                recognition.onerror = (event: any) => {
                    console.error("Voice Error:", event.error);
                    if (event.error !== 'no-speech') {
                        setIsListening(false);
                    }
                };

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
            title: "Sentimind Chat",
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
        <div className="w-full flex flex-col pt-28 md:pt-32 font-sans min-h-screen justify-start">

            {/* Main Chat Content */}
            <div className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-0 flex flex-col">

                {/* Header (Only show if no messages) */}
                <AnimatePresence>
                    {messages.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center text-center space-y-6 py-10"
                        >
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                                className="p-2 bg-orange-100 dark:bg-orange-500/10 rounded-full mb-2"
                            >
                                <Sparkles className="text-orange-600 dark:text-orange-400 w-6 h-6" />
                            </motion.div>
                            <div>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 leading-[1.1] pb-2">
                                    {content.title}
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                                    {content.desc}
                                </p>
                            </div>

                            <motion.div 
                                className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mt-12"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                            >
                                {content.suggestions.map((s, i) => (
                                    <motion.button
                                        key={i}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSendMessage(s)}
                                        className="p-4 text-left text-sm bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:bg-orange-50 dark:hover:bg-neutral-800 hover:border-orange-300 dark:hover:border-orange-700/50 rounded-2xl transition-colors text-gray-600 dark:text-gray-300 shadow-sm"
                                    >
                                        "{s}"
                                    </motion.button>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat Messages */}
                <div ref={messagesContainerRef} className="space-y-6 flex-1 mb-8">
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className={classNames(
                                    "flex gap-4 md:gap-6",
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
                                        typedMessages.has(msg.id) ? (
                                            <div className="markdown-content">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={markdownComponents}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <Typewriter
                                                text={msg.content}
                                                speed={15}
                                                onTyping={() => scrollToBottom("auto")}
                                                onComplete={() => setTypedMessages(prev => new Set([...prev, msg.id]))}
                                            />
                                        )
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Loading State */}
                    {isLoading && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 md:gap-6"
                        >
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-1">
                                <Bot size={20} />
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                    <Loader2 size={16} className="animate-spin" />
                                    {content.thinking}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-center"
                        >
                            <p>{error}</p>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* STICKY Input Area */}
            <div className="sticky bottom-0 left-0 w-full bg-background pb-6 pt-4 px-4 md:px-0 z-30">
                <div className="max-w-3xl mx-auto relative">
                    {/* Shadow gradient top for nice effect */}
                    <div className="absolute -top-10 left-0 w-full h-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />

                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="relative flex items-center bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm rounded-3xl p-2 transition-all focus-within:border-orange-500"
                    >
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
                            className="w-full bg-transparent border-none outline-none focus:ring-0 focus:outline-none rounded-full px-2 py-3 text-base text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
                        />
                        <button
                            onClick={() => handleSendMessage(inputValue)}
                            disabled={!inputValue.trim() || isLoading}
                            className="p-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:hover:bg-orange-600 text-white rounded-full transition-all shadow-sm transform hover:scale-105 active:scale-95 ml-2"
                        >
                            <Send size={18} />
                        </button>
                    </motion.div>
                    <p className="text-center text-[10px] md:text-xs text-gray-400 mt-3 -mb-3 opacity-70">
                        {content.powerBy}
                    </p>
                </div>
            </div>
        </div>
    );
}