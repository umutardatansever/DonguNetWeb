"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./ChatbotView.module.css";
import { ChatMessage } from "../../types";

interface ChatbotViewProps {
  chatMessages: ChatMessage[];
  onSend: (message: string) => void;
  isTyping: boolean;
}

export default function ChatbotView({ chatMessages, onSend, isTyping }: ChatbotViewProps) {
  const [chatInput, setChatInput] = useState("");
  const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    onSend(chatInput.trim());
    setChatInput("");
  };

  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isTyping]);

  return (
    <div className={`glass-panel rounded-2xl overflow-hidden ${styles.container}`}>
      <div className="bg-slate-900/60 p-4 border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-mint/10 flex items-center justify-center border border-accent-mint/20">
          <span className="material-symbols-outlined text-accent-mint">smart_toy</span>
        </div>
        <div>
          <h3 className="font-title font-bold text-white text-sm">DöngüNet AI Sürdürülebilirlik Asistanı</h3>
          <p className="text-[10px] text-teal-400 font-medium">Claude API ile Mevzuat Danışmanlığı (Simüle)</p>
        </div>
      </div>

      <div className={styles.messagesArea}>
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 max-w-[80%] ${msg.role === "assistant" ? "self-start" : "self-end flex-row-reverse"}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                msg.role === "assistant"
                  ? "bg-accent-mint/10 text-accent-mint border-accent-mint/20"
                  : "bg-slate-700 text-white border-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {msg.role === "assistant" ? "smart_toy" : "person"}
              </span>
            </div>
            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-surface/60 text-white rounded-tl-none border border-white/5"
                  : "bg-accent-mint text-white rounded-tr-none"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.content }}
            />
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-[80%] self-start">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-accent-mint/10 text-accent-mint border border-accent-mint/20">
              <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            </div>
            <div className="p-3.5 rounded-2xl text-xs bg-surface/60 text-on-surface-variant rounded-tl-none border border-white/5 flex items-center gap-1.5 font-medium">
              Asistan cevap hazırlıyor
              <span className="inline-flex gap-0.5">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </span>
            </div>
          </div>
        )}
        <div ref={chatMessagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/5 bg-slate-900/40 flex gap-3">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleChatSend();
          }}
          type="text"
          className="flex-grow bg-slate-900 border border-white/10 rounded-xl text-sm px-4 py-3 text-white focus:outline-none focus:border-accent-mint focus:ring-1 focus:ring-accent-mint"
          placeholder="SKDM mevzuatı, atık kodları veya simbiyoz kazançları hakkında soru sorun..."
        />
        <button
          onClick={handleChatSend}
          className="btn-primary w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  );
}
