"use client";

import React, { useState } from "react";
import styles from "./AdminView.module.css";
import { PlatformUser, ReviewQueueItem, WeightsConfig } from "../../types";

interface AdminViewProps {
  users: PlatformUser[];
  onRemoveUser: (id: string) => void;
  reviewQueue: ReviewQueueItem[];
  onApproveReview: (id: string) => void;
  onRejectReview: (id: string) => void;
  weights: WeightsConfig;
  onSaveWeights: (weights: WeightsConfig) => void;
}

const ROLE_LABEL: Record<PlatformUser["role"], string> = {
  user: "Tesis Kullanıcısı",
  admin: "Sistem Admini",
  osb_manager: "OSB Yöneticisi",
};

export default function AdminView({
  users,
  onRemoveUser,
  reviewQueue,
  onApproveReview,
  onRejectReview,
  weights,
  onSaveWeights,
}: AdminViewProps) {
  const [draftWeights, setDraftWeights] = useState<WeightsConfig>(weights);
  const [tab, setTab] = useState<"users" | "review" | "weights">("users");

  const total = Object.values(draftWeights).reduce((sum, v) => sum + v, 0);
  const isValidTotal = Math.round(total) === 100;

  const handleWeightChange = (key: keyof WeightsConfig, value: number) => {
    setDraftWeights((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!isValidTotal) return;
    onSaveWeights(draftWeights);
    alert("AHP ağırlıkları güncellendi ve yeni versiyon aktif edildi.");
  };

  const pendingReview = reviewQueue.filter((r) => r.status === "pending");

  return (
    <div className={styles.container}>
      <div className="flex gap-2 p-1 rounded-xl bg-slate-900 border border-white/5 self-start overflow-x-auto">
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            tab === "users" ? "text-white bg-slate-700" : "text-on-surface-variant hover:text-white"
          }`}
        >
          Kullanıcı Yönetimi
        </button>
        <button
          onClick={() => setTab("review")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            tab === "review" ? "text-white bg-slate-700" : "text-on-surface-variant hover:text-white"
          }`}
        >
          Onay Kuyruğu (HITL) {pendingReview.length > 0 && `(${pendingReview.length})`}
        </button>
        <button
          onClick={() => setTab("weights")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            tab === "weights" ? "text-white bg-slate-700" : "text-on-surface-variant hover:text-white"
          }`}
        >
          AHP Ağırlık Kalibrasyonu
        </button>
      </div>

      {tab === "users" && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={styles.tableHeader}>
                  <th className={styles.tableCell}>Ad</th>
                  <th className={styles.tableCell}>E-posta</th>
                  <th className={styles.tableCell}>Tesis</th>
                  <th className={styles.tableCell}>Rol</th>
                  <th className={`${styles.tableCell} text-right`}>İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-white">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className={`${styles.tableCell} font-semibold`}>{u.name}</td>
                    <td className={`${styles.tableCell} text-on-surface-variant`}>{u.email}</td>
                    <td className={`${styles.tableCell} text-on-surface-variant`}>{u.facility}</td>
                    <td className={styles.tableCell}>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-teal-400 border border-teal-500/10">
                        {ROLE_LABEL[u.role]}
                      </span>
                    </td>
                    <td className={`${styles.tableCell} text-right`}>
                      <button
                        onClick={() => onRemoveUser(u.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                      >
                        Kaldır
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "review" && (
        <div className="flex flex-col gap-3">
          {reviewQueue.length === 0 && (
            <div className="glass-panel p-6 rounded-2xl text-center text-xs text-on-surface-variant">
              Onay kuyruğunda öğe yok.
            </div>
          )}
          {reviewQueue.map((item) => (
            <div key={item.id} className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-title font-bold text-white text-sm">{item.matchName}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                      item.status === "pending"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : item.status === "approved"
                        ? "bg-accent-mint/10 text-accent-mint border-accent-mint/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {item.status === "pending" ? "Bekliyor" : item.status === "approved" ? "Onaylandı" : "Reddedildi"}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Güven skoru: <span className="text-white font-semibold">{(item.confidence * 100).toFixed(0)}%</span> — {item.reason}
                </p>
              </div>
              {item.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => onApproveReview(item.id)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-accent-mint/10 border border-accent-mint/20 text-accent-mint hover:bg-accent-mint/20 cursor-pointer"
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => onRejectReview(item.id)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                  >
                    Reddet
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "weights" && (
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
          <div>
            <h3 className="font-title font-bold text-white text-base">5 Faktörlü Skor Ağırlıkları</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Toplam tam olarak %100 olmalıdır. Değişiklik yeni bir weights_config versiyonu olarak aktif edilir.
            </p>
          </div>

          {(Object.keys(draftWeights) as (keyof WeightsConfig)[]).map((key) => (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-white capitalize">
                  {key === "material" && "Malzeme"}
                  {key === "quality" && "Kalite"}
                  {key === "environmental" && "Çevresel"}
                  {key === "logistics" && "Lojistik"}
                  {key === "economic" && "Ekonomik"}
                </span>
                <span className="text-accent-mint font-bold">{draftWeights[key]}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={draftWeights[key]}
                onChange={(e) => handleWeightChange(key, Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          ))}

          <div className="flex justify-between items-center border-t border-white/5 pt-4">
            <span className={`text-sm font-bold ${isValidTotal ? "text-accent-mint" : "text-rose-400"}`}>
              Toplam: {total}% {!isValidTotal && "(100% olmalı)"}
            </span>
            <button
              onClick={handleSave}
              disabled={!isValidTotal}
              className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Ağırlıkları Kaydet ve Aktif Et
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
