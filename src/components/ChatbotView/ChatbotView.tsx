"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./ChatbotView.module.css";
import { ChatMessage } from "../../types";

interface ChatbotViewProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function ChatbotView({ chatMessages, setChatMessages }: ChatbotViewProps) {
  const [chatInput, setChatInput] = useState("");
  const [chatIsTyping, setChatIsTyping] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setChatIsTyping(true);

    setTimeout(() => {
      setChatIsTyping(false);
      const lower = userMsg.toLowerCase();
      let reply =
        "DöngüNet AI asistanı olarak sorunuzu tam olarak anlayamadım. Ancak sürdürülebilirlik, SKDM (sınırda karbon vergisi), Dijital Ürün Pasaportları (DPP) veya endüstriyel simbiyoz süreçlerimiz hakkında sorular sorabilirsiniz.";

      if (lower.includes("skdm") || lower.includes("cbam") || lower.includes("karbon")) {
        reply =
          "<strong>Sınırda Karbon Düzenleme Mekanizması (SKDM - CBAM) Hakkında:</strong> AB Yeşil Mutabakatı kapsamında, birlik dışından ithal edilen çimento, demir-çelik, alüminyum, gübre, hidrojen ve elektrik gibi ürünlerin gömülü karbon emisyonlarına göre gümrükte vergilendirilmesidir. DöngüNet üzerinde yaptığınız atık eşleştirmeleri, birincil (virgin) metal kullanımı yerine ikincil alaşım kullanımı sağladığı için gömülü karbon miktarınızı önemli ölçüde azaltır ve yasal uyumluluk raporu (CBAM Raporu) olarak çıktı alınabilir.";
      } else if (lower.includes("pasaport") || lower.includes("dpp") || lower.includes("espr")) {
        reply =
          "<strong>Dijital Ürün Pasaportu (DPP) Nedir?</strong> AB'nin Ecodesign for Sustainable Products Regulation (ESPR) yönetmeliğine göre ürünlerin malzeme kimliği, saflığı, menşei, karbon ayak izi ve geri dönüştürülebilirlik durumunu dijital olarak barındıran yapıdır. DöngüNet'te oluşturduğumuz pasaportlar, atığınızın değerini kanıtlar ve izlenebilirlik sağlayan benzersiz bir QR Kod ile üretilir.";
      } else if (
        lower.includes("simbiyoz") ||
        lower.includes("eşleştirme") ||
        lower.includes("nasıl") ||
        lower.includes("skor")
      ) {
        reply =
          "<strong>DöngüNet AI Eşleştirme Sistemi:</strong> Tesislerimizin sisteme girdiği çıktılar ile diğer tesislerin girdileri arasında anlamsal S-BERT analizi yapılır (benzerlik limiti $\\ge 0.65$). Eşleşen adaylar; <strong>Malzeme Uyumu (%30)</strong>, <strong>Kalite Uyumu (%20)</strong>, <strong>Çevresel Kazanç (%20)</strong>, <strong>Lojistik (%15)</strong> ve <strong>Ekonomik Fayda (%15)</strong> olmak üzere 5 farklı ağırlık üzerinden AHP (Analitik Hiyerarşi Süreci) algoritmasıyla puanlanarak listelenir.";
      }

      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    }, 1500);
  };

  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatIsTyping]);

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

        {chatIsTyping && (
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
