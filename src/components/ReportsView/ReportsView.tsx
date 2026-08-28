"use client";

import React from "react";
import styles from "./ReportsView.module.css";

export default function ReportsView() {
  const handlePdfDownload = (name: string) => {
    alert(`${name}.pdf simüle edilmiş şekilde derleniyor ve indirme kuyruğuna alınıyor.`);
  };

  return (
    <div className={styles.container}>
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="font-title font-bold text-on-surface text-base">Raporlama ve Uyumluluk</h3>
        <p className="text-xs text-on-surface-variant mt-1">
          Eşleşmeleriniz sonucu sağlanan emisyon azaltımlarını içeren yasal belgeler ve AB uyumluluk dosyaları.
        </p>
      </div>

      <div className={styles.grid}>
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-3">
            <span className="material-symbols-outlined text-teal-700 text-3xl">co2</span>
            <h4 className="font-title font-bold text-lg text-on-surface">Çevresel Etki Raporu</h4>
            <p className="text-xs text-on-surface-variant">
              ISO 14040 Life Cycle Assessment (LCA) uyumlu, net karbon azaltımlarını beyan eden detaylı emisyon raporu.
            </p>
          </div>
          <button
            onClick={() => handlePdfDownload("Cevresel Etki Raporu")}
            className="btn-secondary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            PDF İndir
          </button>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-3">
            <span className="material-symbols-outlined text-secondary text-3xl">gavel</span>
            <h4 className="font-title font-bold text-lg text-on-surface">SKDM (CBAM) Uyum Beyanı</h4>
            <p className="text-xs text-on-surface-variant">
              Sınırda Karbon Düzenleme Mekanizması kurallarına uygun, ithalat/ihracat vergi muafiyeti bildirim belgesi.
            </p>
          </div>
          <button
            onClick={() => handlePdfDownload("SKDM Uyum Beyani")}
            className="btn-secondary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            PDF İndir
          </button>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-3">
            <span className="material-symbols-outlined text-accent-mint text-3xl">qr_code</span>
            <h4 className="font-title font-bold text-lg text-on-surface">Dijital Pasaport Raporu</h4>
            <p className="text-xs text-on-surface-variant">
              AB ESPR yönetmeliklerine uygun, malzemenin kimyasal, fiziksel ve izlenebilirlik pasaport özeti.
            </p>
          </div>
          <button
            onClick={() => handlePdfDownload("Dijital Pasaport Raporu")}
            className="btn-secondary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            PDF İndir
          </button>
        </div>
      </div>
    </div>
  );
}
