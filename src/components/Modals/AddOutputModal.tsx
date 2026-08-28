"use client";

import React, { useMemo, useState } from "react";
import styles from "./Modal.module.css";
import { mockClassify } from "../../lib/mockClassify";

interface AddOutputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, classVal: string, comp: string, qty: number, stock: number) => void;
}

export default function AddOutputModal({ isOpen, onClose, onSubmit }: AddOutputModalProps) {
  const [formOutName, setFormOutName] = useState("");
  const [formOutClass, setFormOutClass] = useState("METAL");
  const [formOutComp, setFormOutComp] = useState("");
  const [formOutQty, setFormOutQty] = useState("");
  const [formOutStock, setFormOutStock] = useState("");

  const classifyPreview = useMemo(() => {
    const text = `${formOutName} ${formOutComp}`.trim();
    if (!text) return null;
    return mockClassify(text);
  }, [formOutName, formOutComp]);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formOutName || !formOutComp || !formOutQty || !formOutStock) return;

    onSubmit(
      formOutName,
      formOutClass,
      formOutComp,
      parseFloat(formOutQty),
      parseFloat(formOutStock)
    );

    // Reset Form
    setFormOutName("");
    setFormOutClass("METAL");
    setFormOutComp("");
    setFormOutQty("");
    setFormOutStock("");
  };

  return (
    <div className={styles.backdrop}>
      <div className={`${styles.modalContent} glass-panel`}>
        <div className="flex justify-between items-center">
          <h3 className="font-title font-bold text-lg text-white">Yeni Çıktı / Atık Girişi</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">Malzeme Adı</label>
            <input
              value={formOutName}
              onChange={(e) => setFormOutName(e.target.value)}
              type="text"
              required
              className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
              placeholder="Örn: Demir Alaşımlı Toz"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Malzeme Sınıfı</label>
              <select
                value={formOutClass}
                onChange={(e) => setFormOutClass(e.target.value)}
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
              <label className="text-xs font-semibold text-on-surface-variant">Saflık / Bileşim Değeri</label>
              <input
                value={formOutComp}
                onChange={(e) => setFormOutComp(e.target.value)}
                type="text"
                required
                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
                placeholder="Örn: Al %95, Fe %2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Toplam Miktar (kg)</label>
              <input
                value={formOutQty}
                onChange={(e) => setFormOutQty(e.target.value)}
                type="number"
                required
                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
                placeholder="1000"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Anlık Stok (kg)</label>
              <input
                value={formOutStock}
                onChange={(e) => setFormOutStock(e.target.value)}
                type="number"
                required
                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
                placeholder="1000"
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
            Atık Kaydet ve Vektörleştir
          </button>
        </form>
      </div>
    </div>
  );
}
