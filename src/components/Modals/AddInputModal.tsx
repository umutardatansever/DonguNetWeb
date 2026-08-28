"use client";

import React, { useMemo, useState } from "react";
import styles from "./Modal.module.css";
import { mockClassify } from "../../lib/mockClassify";

interface AddInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, classVal: string, freq: string, qty: number, specs: string) => void;
}

export default function AddInputModal({ isOpen, onClose, onSubmit }: AddInputModalProps) {
  const [formInName, setFormInName] = useState("");
  const [formInClass, setFormInClass] = useState("METAL");
  const [formInFreq, setFormInFreq] = useState("");
  const [formInQty, setFormInQty] = useState("");
  const [formInSpecs, setFormInSpecs] = useState("");

  const classifyPreview = useMemo(() => {
    const text = `${formInName} ${formInSpecs}`.trim();
    if (!text) return null;
    return mockClassify(text);
  }, [formInName, formInSpecs]);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInName || !formInFreq || !formInQty || !formInSpecs) return;

    onSubmit(
      formInName,
      formInClass,
      formInFreq,
      parseFloat(formInQty),
      formInSpecs
    );

    // Reset Form
    setFormInName("");
    setFormInClass("METAL");
    setFormInFreq("");
    setFormInQty("");
    setFormInSpecs("");
  };

  return (
    <div className={styles.backdrop}>
      <div className={`${styles.modalContent} glass-panel`}>
        <div className="flex justify-between items-center">
          <h3 className="font-title font-bold text-lg text-white">Yeni Girdi / Hammadde İhtiyacı</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">Hammadde / Girdi Adı</label>
            <input
              value={formInName}
              onChange={(e) => setFormInName(e.target.value)}
              type="text"
              required
              className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
              placeholder="Örn: Katkı Tozu"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Malzeme Sınıfı</label>
              <select
                value={formInClass}
                onChange={(e) => setFormInClass(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
              >
                <option value="METAL">Metal</option>
                <option value="PLASTIC">Plastik</option>
                <option value="ORGANIC">Organik</option>
                <option value="CHEMICAL">Kimyasal</option>
                <option value="TEXTILE">Tekstil</option>
                <option value="GLASS">Cam</option>
                <option value="PAPER">Kağıt</option>
                <option value="OTHER">Diğer</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Tedarik Frekansı</label>
              <input
                value={formInFreq}
                onChange={(e) => setFormInFreq(e.target.value)}
                type="text"
                required
                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
                placeholder="Aylık, Haftalık, Yıllık"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">İhtiyaç Miktarı (kg)</label>
              <input
                value={formInQty}
                onChange={(e) => setFormInQty(e.target.value)}
                type="number"
                required
                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
                placeholder="5000"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Teknik Spekt / Limit</label>
              <input
                value={formInSpecs}
                onChange={(e) => setFormInSpecs(e.target.value)}
                type="text"
                required
                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
                placeholder="Saflık > %90"
              />
            </div>
          </div>

          {classifyPreview && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-accent-mint/5 border border-accent-mint/15 text-xs">
              <span className="material-symbols-outlined text-accent-mint text-[16px]">auto_awesome</span>
              <span className="text-on-surface-variant">
                AI Sınıflandırma Önizlemesi (simüle): <span className="text-accent-mint font-bold">{classifyPreview.label}</span>{" "}
                — %{Math.round(classifyPreview.confidence * 100)} güven
              </span>
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm mt-4 cursor-pointer">
            Girdi Tanımla
          </button>
        </form>
      </div>
    </div>
  );
}
