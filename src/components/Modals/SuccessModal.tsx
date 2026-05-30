"use client";

import React from "react";
import styles from "./Modal.module.css";
import { MatchCandidate } from "../../types";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMatch: MatchCandidate | null;
}

export default function SuccessModal({ isOpen, onClose, selectedMatch }: SuccessModalProps) {
  if (!isOpen || !selectedMatch) return null;

  return (
    <div className={styles.backdrop}>
      <div className={`${styles.modalContent} glass-panel flex items-center text-center`}>
        <div className="w-16 h-16 rounded-full bg-accent-mint/10 border-2 border-accent-mint flex items-center justify-center animate-bounce">
          <span className="material-symbols-outlined text-accent-mint text-4xl">handshake</span>
        </div>
        <div>
          <h3 className="font-title font-bold text-xl text-white">Eşleştirme Başarıyla Onaylandı!</h3>
          <p className="text-sm text-on-surface-variant mt-2">
            Endüstriyel döngüsel simbiyoz akışı taraflarca kabul edildi. İletişim bilgileri açılmıştır.
          </p>
        </div>
        <div className="w-full bg-slate-900/60 p-5 rounded-2xl text-left flex flex-col gap-3 text-xs border border-white/5">
          <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-teal-400 text-sm">contact_phone</span>
            Karşı Tesis İletişim Detayları
          </h4>
          <p className="text-white">
            <strong className="text-on-surface-variant">Firma Adı:</strong> <span>{selectedMatch.name}</span>
          </p>
          <p className="text-white">
            <strong className="text-on-surface-variant">Temsilci:</strong> Ahmet Yılmaz (Fabrika Müdürü)
          </p>
          <p className="text-white">
            <strong className="text-on-surface-variant">Telefon:</strong> +90 (262) 555 1234
          </p>
          <p className="text-white">
            <strong className="text-on-surface-variant">E-Posta:</strong> a.yilmaz@dilovasialuminyum.com.tr
          </p>
          <div className="mt-2 p-3 bg-accent-mint/5 border border-accent-mint/10 rounded-xl text-[11px] text-accent-mint">
            * QR kodlu sevkiyat takip barkodu ve teslim belgesi otomatik olarak e-posta adresinize gönderilmiştir.
          </div>
        </div>
        <button onClick={onClose} className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer">
          Anladım, Kapat
        </button>
      </div>
    </div>
  );
}
