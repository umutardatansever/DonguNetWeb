"use client";

import React from "react";
import styles from "./OsbView.module.css";
import { OSBVerification } from "../../types";

interface OsbViewProps {
  osbVerificationList: OSBVerification[];
  onVerifyFacility: (id: string) => void;
}

export default function OsbView({ osbVerificationList, onVerifyFacility }: OsbViewProps) {
  const handlePdfDownload = (name: string) => {
    alert(`${name}.pdf simüle edilmiş şekilde derleniyor ve indirme kuyruğuna alınıyor.`);
  };

  return (
    <div className={styles.container}>
      {/* OSB Stats */}
      <div className={styles.statsGrid}>
        <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
            OSB Simbiyoz Oranı
          </span>
          <span className="text-xl md:text-3xl font-extrabold font-title text-white mt-2 block">68%</span>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-accent-mint h-full rounded-full" style={{ width: "68%" }}></div>
          </div>
        </div>
        <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
            Aktif Tesis
          </span>
          <span className="text-xl md:text-3xl font-extrabold font-title text-white mt-2 block">14 Tesis</span>
        </div>
        <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
            Toplam CO2
          </span>
          <span className="text-xl md:text-3xl font-extrabold font-title text-teal-400 mt-2 block">2.1 Ton</span>
        </div>
        <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
            Karbon Tasarrufu
          </span>
          <span className="text-xl md:text-3xl font-extrabold font-title text-accent-mint mt-2 block">€4,800</span>
        </div>
      </div>

      {/* OSB Map & Approvals */}
      <div className={styles.layoutGrid}>
        {/* OSB regional SVG Map */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-title font-bold text-white text-base">Bölgesel Tesis ve Akış Dağılımı</h3>
            <button
              onClick={() => handlePdfDownload("Osb Bolgesel Analiz Raporu")}
              className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">analytics</span>
              Bölgesel Rapor Üret
            </button>
          </div>
          <div className={styles.mapWrapper}>
            <svg viewBox="0 0 600 320" className="w-full h-full text-slate-800" fill="currentColor">
              <defs>
                <pattern id="osb-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth={1} />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#osb-grid)" />
              <polygon
                points="50,40 550,20 580,240 120,290"
                fill="none"
                stroke="rgba(16, 185, 129, 0.2)"
                strokeWidth={2}
                strokeDasharray="8 4"
              />
              <text x="70" y="55" fill="rgba(16, 185, 129, 0.4)" fontSize="10" fontWeight="bold">
                GEBZE ORGANIZE SANAYI BOLGESI SINIRI
              </text>
              <path d="M 120 120 Q 250 80 380 140" fill="none" stroke="#10b981" strokeWidth={2} strokeOpacity={0.6} />
              <path d="M 380 140 Q 300 220 220 200" fill="none" stroke="#0d9488" strokeWidth={1.5} strokeOpacity={0.4} />
              <circle r="4" fill="#34d399">
                <animateMotion dur="6s" repeatCount="indefinite" path="M 120 120 Q 250 80 380 140" />
              </circle>
              <circle cx={120} cy={120} r={8} fill="#10b981" />
              <text x="135" y="123" fill="#94a3b8" fontSize="9" fontWeight="bold">
                Gebze Metal A.Ş.
              </text>
              <circle cx={380} cy={140} r={8} fill="#059669" />
              <text x="395" y="143" fill="#94a3b8" fontSize="9" fontWeight="bold">
                Dilovası Doküm
              </text>
              <circle cx={220} cy={200} r={8} fill="#0d9488" />
              <text x="235" y="203" fill="#94a3b8" fontSize="9" fontWeight="bold">
                Kocaeli Cam
              </text>
              <circle cx={450} cy={220} r={6} fill="#334155" />
              <text
                x={465}
                y={223}
                fill={osbVerificationList[1].status === "approved" ? "#94a3b8" : "#64748b"}
                fontSize="9"
                fontWeight={osbVerificationList[1].status === "approved" ? "bold" : "normal"}
              >
                Marmara Kağıt
              </text>
              {osbVerificationList[1].status === "approved" && <circle cx={450} cy={220} r={6} fill="#10b981" />}
            </svg>
          </div>
        </div>

        {/* Verification list */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="font-title font-bold text-white text-base">Tesis Doğrulama Talepleri</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-on-surface-variant uppercase border-b border-white/5 pb-2">
                  <th className="pb-2">Tesis Adı</th>
                  <th className="pb-2">Sektör</th>
                  <th className="pb-2 text-right">Durum / Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-white">
                {osbVerificationList.map((req) => (
                  <tr key={req.id}>
                    <td className="py-3 font-semibold text-white">{req.name}</td>
                    <td className="py-3 text-on-surface-variant">{req.sector}</td>
                    <td className="py-3 text-right">
                      {req.status === "pending" ? (
                        <button
                          onClick={() => onVerifyFacility(req.id)}
                          className="px-3 py-1 rounded bg-accent-mint/10 border border-accent-mint/20 text-accent-mint hover:bg-accent-mint/20 text-[10px] font-bold cursor-pointer"
                        >
                          Onayla
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-800 border border-white/5 rounded text-on-surface-variant text-[9px] font-semibold">
                          Doğrulandı
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
