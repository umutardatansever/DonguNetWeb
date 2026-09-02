"use client";

import React, { useState } from "react";
import styles from "./AdminView.module.css";
import { PlatformUser, ReviewQueueItem, WeightsConfig } from "../../types";
import { ApiKeyRow } from "../../lib/api";

interface AdminViewProps {
  users: PlatformUser[];
  onRemoveUser: (id: string) => void;
  reviewQueue: ReviewQueueItem[];
  onApproveReview: (id: string) => void;
  onRejectReview: (id: string) => void;
  weights: WeightsConfig;
  onSaveWeights: (weights: WeightsConfig) => void;
  apiKeys: ApiKeyRow[];
  onCreateApiKey: (name: string, userId: string) => Promise<string | null>;
  onRevokeApiKey: (id: string) => void;
}

const ROLE_LABEL: Record<string, string> = {
  USER: "Tesis Kullanıcısı",
  FACILITY_ADMIN: "Tesis Yöneticisi",
  EXPERT: "Uzman",
  ADMIN: "Sistem Admini",
  OSB_MANAGER: "OSB Yöneticisi",
};

export default function AdminView({
  users,
  onRemoveUser,
  reviewQueue,
  onApproveReview,
  onRejectReview,
  weights,
  onSaveWeights,
  apiKeys,
  onCreateApiKey,
  onRevokeApiKey,
}: AdminViewProps) {
  const [draftWeights, setDraftWeights] = useState<WeightsConfig>(weights);
  const [tab, setTab] = useState<"users" | "review" | "weights" | "apikeys">("users");
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyUserId, setNewKeyUserId] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

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

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim() || !newKeyUserId) return;
    const rawKey = await onCreateApiKey(newKeyName.trim(), newKeyUserId);
    if (rawKey) {
      setRevealedKey(rawKey);
      setNewKeyName("");
      setNewKeyUserId("");
    }
  };

  return (
    <div className={styles.container}>
      <div className="flex gap-2 p-1 rounded-xl bg-surface-light border border-border-color self-start overflow-x-auto">
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            tab === "users" ? "text-white bg-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Kullanıcı Yönetimi
        </button>
        <button
          onClick={() => setTab("review")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            tab === "review" ? "text-white bg-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Onay Kuyruğu (HITL) {pendingReview.length > 0 && `(${pendingReview.length})`}
        </button>
        <button
          onClick={() => setTab("weights")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            tab === "weights" ? "text-white bg-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          AHP Ağırlık Kalibrasyonu
        </button>
        <button
          onClick={() => setTab("apikeys")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            tab === "apikeys" ? "text-white bg-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          API Anahtarları (IoT)
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
              <tbody className="divide-y divide-border-color text-sm text-on-surface">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className={`${styles.tableCell} font-semibold`}>{u.name}</td>
                    <td className={`${styles.tableCell} text-on-surface-variant`}>{u.email}</td>
                    <td className={`${styles.tableCell} text-on-surface-variant`}>{u.facility}</td>
                    <td className={styles.tableCell}>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-600/10 text-teal-700 border border-teal-600/15">
                        {ROLE_LABEL[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className={`${styles.tableCell} text-right`}>
                      <button
                        onClick={() => onRemoveUser(u.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-500/20 transition-all cursor-pointer"
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
                  <h4 className="font-title font-bold text-on-surface text-sm">{item.matchName}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                      item.status === "pending"
                        ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                        : item.status === "approved"
                        ? "bg-accent-mint/10 text-accent-mint border-accent-mint/20"
                        : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    }`}
                  >
                    {item.status === "pending" ? "Bekliyor" : item.status === "approved" ? "Onaylandı" : "Reddedildi"}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Güven skoru: <span className="text-on-surface font-semibold">{(item.confidence * 100).toFixed(0)}%</span> — {item.reason}
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
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-500/20 cursor-pointer"
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
            <h3 className="font-title font-bold text-on-surface text-base">5 Faktörlü Skor Ağırlıkları</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Toplam tam olarak %100 olmalıdır. Değişiklik yeni bir weights_config versiyonu olarak aktif edilir.
            </p>
          </div>

          {(Object.keys(draftWeights) as (keyof WeightsConfig)[]).map((key) => (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-on-surface capitalize">
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

          <div className="flex justify-between items-center border-t border-border-color pt-4">
            <span className={`text-sm font-bold ${isValidTotal ? "text-accent-mint" : "text-rose-600"}`}>
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

      {tab === "apikeys" && (
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="font-title font-bold text-on-surface text-base">Yeni Anahtar Üret</h3>
            <p className="text-xs text-on-surface-variant">
              IoT sensörlerinin <code>POST /v1/iot/sensor-data</code>&apos;ya kimlik doğrulaması için kullandığı{" "}
              <code>X-Api-Key</code>. Anahtarın ham değeri yalnızca üretildiği anda bir kez gösterilir.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                type="text"
                placeholder="Anahtar adı (örn: Gebze Metal Sensör-1)"
                className="sm:col-span-2 bg-surface border border-border-color rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-accent-mint"
              />
              <select
                value={newKeyUserId}
                onChange={(e) => setNewKeyUserId(e.target.value)}
                className="bg-surface border border-border-color rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-accent-mint"
              >
                <option value="">Kullanıcı seç</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleCreateApiKey}
              disabled={!newKeyName.trim() || !newKeyUserId}
              className="btn-primary self-start px-6 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Anahtar Üret
            </button>
            {revealedKey && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-amber-700 uppercase">
                  Bu anahtarı şimdi kaydedin — bir daha gösterilmeyecek
                </span>
                <code className="text-xs break-all text-on-surface">{revealedKey}</code>
                <button
                  onClick={() => setRevealedKey(null)}
                  className="self-start text-[11px] font-semibold text-accent-mint hover:underline cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            )}
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={styles.tableHeader}>
                    <th className={styles.tableCell}>Ad</th>
                    <th className={styles.tableCell}>Son Kullanım</th>
                    <th className={styles.tableCell}>Durum</th>
                    <th className={`${styles.tableCell} text-right`}>İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color text-sm text-on-surface">
                  {apiKeys.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-on-surface-variant text-xs">
                        Henüz üretilmiş anahtar yok.
                      </td>
                    </tr>
                  )}
                  {apiKeys.map((k) => (
                    <tr key={k.id}>
                      <td className={`${styles.tableCell} font-semibold`}>{k.name}</td>
                      <td className={`${styles.tableCell} text-on-surface-variant`}>{k.lastUsed ?? "Hiç kullanılmadı"}</td>
                      <td className={styles.tableCell}>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            k.revokedAt
                              ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                              : "bg-accent-mint/10 text-accent-mint border-accent-mint/20"
                          }`}
                        >
                          {k.revokedAt ? "İptal edildi" : "Aktif"}
                        </span>
                      </td>
                      <td className={`${styles.tableCell} text-right`}>
                        {!k.revokedAt && (
                          <button
                            onClick={() => onRevokeApiKey(k.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-500/20 transition-all cursor-pointer"
                          >
                            İptal Et
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
