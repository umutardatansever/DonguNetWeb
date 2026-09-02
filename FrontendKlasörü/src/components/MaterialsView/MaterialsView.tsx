"use client";

import React from "react";
import styles from "./MaterialsView.module.css";
import { OutputItem, InputItem } from "../../types";

interface MaterialsViewProps {
  outputs: OutputItem[];
  inputs: InputItem[];
  currentTab: "outputs" | "inputs";
  setCurrentTab: (tab: "outputs" | "inputs") => void;
  onShowOutputModal: () => void;
  onShowInputModal: () => void;
  onShowDppModal: (output: OutputItem) => void;
}

export default function MaterialsView({
  outputs,
  inputs,
  currentTab,
  setCurrentTab,
  onShowOutputModal,
  onShowInputModal,
  onShowDppModal,
}: MaterialsViewProps) {
  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border-color pb-4">
        <div className="flex gap-2 p-1 rounded-xl bg-surface-light border border-border-color self-start">
          <button
            onClick={() => setCurrentTab("outputs")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === "outputs" ? "text-white bg-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Üretilen Çıktılar / Atıklar
          </button>
          <button
            onClick={() => setCurrentTab("inputs")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === "inputs" ? "text-white bg-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Girdi İhtiyaçları
          </button>
        </div>
        <div>
          {currentTab === "outputs" ? (
            <button
              onClick={onShowOutputModal}
              className="btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Yeni Çıktı Kaydet
            </button>
          ) : (
            <button
              onClick={onShowInputModal}
              className="btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Girdi İhtiyacı Tanımla
            </button>
          )}
        </div>
      </div>

      {/* List Container */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {currentTab === "outputs" ? (
          <div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={styles.tableHeader}>
                    <th className={styles.tableCell}>Malzeme Adı</th>
                    <th className={styles.tableCell}>Sınıf</th>
                    <th className={styles.tableCell}>Kimyasal Bileşim</th>
                    <th className={styles.tableCell}>Miktar (kg)</th>
                    <th className={styles.tableCell}>Stok (kg)</th>
                    <th className={styles.tableCell}>Kayıt Tarihi</th>
                    <th className={`${styles.tableCell} text-right`}>İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color text-sm text-on-surface">
                  {outputs.map((out) => (
                    <tr key={out.id}>
                      <td className={`${styles.tableCell} font-semibold text-on-surface`}>{out.name}</td>
                      <td className={styles.tableCell}>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-600/10 text-teal-700 border border-teal-600/15">
                          {out.class}
                        </span>
                      </td>
                      <td className={`${styles.tableCell} text-on-surface-variant`}>{out.composition}</td>
                      <td className={`${styles.tableCell} font-mono text-on-surface`}>{out.quantity.toLocaleString()}</td>
                      <td className={`${styles.tableCell} font-mono text-on-surface`}>{out.stock.toLocaleString()}</td>
                      <td className={`${styles.tableCell} text-on-surface-variant`}>{out.date}</td>
                      <td className={`${styles.tableCell} text-right`}>
                        <button
                          onClick={() => onShowDppModal(out)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-accent-mint/10 border border-accent-mint/20 text-accent-mint hover:bg-accent-mint/20 transition-all flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                          Pasaport (DPP)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col divide-y divide-border-color">
              {outputs.map((out) => (
                <div key={out.id} className={styles.mobileCard}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-title font-bold text-on-surface text-sm">{out.name}</h4>
                      <span className="text-[10px] text-on-surface-variant block mt-1">Kayıt: {out.date}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-teal-600/10 text-teal-700 border border-teal-600/15 shrink-0">
                      {out.class}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs border-y border-border-color py-2">
                    <div>
                      <span className="text-on-surface-variant text-[9px] block">Miktar</span>
                      <span className="text-on-surface font-mono font-medium">{out.quantity.toLocaleString()} kg</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-[9px] block">Stok</span>
                      <span className="text-on-surface font-mono font-medium">{out.stock.toLocaleString()} kg</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-[9px] block">Bileşim</span>
                      <span className="text-on-surface truncate block max-w-[80px]" title={out.composition}>
                        {out.composition}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onShowDppModal(out)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-accent-mint/10 border border-accent-mint/20 text-accent-mint hover:bg-accent-mint/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                    Pasaport (DPP)
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={styles.tableHeader}>
                    <th className={styles.tableCell}>Girdi / Hammadde</th>
                    <th className={styles.tableCell}>Sınıf</th>
                    <th className={styles.tableCell}>Teknik Özellik / Limit</th>
                    <th className={styles.tableCell}>Miktar (kg)</th>
                    <th className={styles.tableCell}>Frekans</th>
                    <th className={styles.tableCell}>Kayıt Tarihi</th>
                    <th className={`${styles.tableCell} text-right`}>İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color text-sm text-on-surface">
                  {inputs.map((input) => (
                    <tr key={input.id}>
                      <td className={`${styles.tableCell} font-semibold text-on-surface`}>{input.name}</td>
                      <td className={styles.tableCell}>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600/10 text-blue-700 border border-blue-600/15">
                          {input.class}
                        </span>
                      </td>
                      <td className={`${styles.tableCell} text-on-surface-variant`}>{input.specs}</td>
                      <td className={`${styles.tableCell} font-mono text-on-surface`}>{input.quantity.toLocaleString()}</td>
                      <td className={`${styles.tableCell} text-on-surface-variant`}>{input.frequency}</td>
                      <td className={`${styles.tableCell} text-on-surface-variant`}>{input.date}</td>
                      <td className={`${styles.tableCell} text-right text-on-surface-variant text-xs font-medium`}>
                        Eşleştirme Bekliyor
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col divide-y divide-border-color">
              {inputs.map((input) => (
                <div key={input.id} className={styles.mobileCard}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-title font-bold text-on-surface text-sm">{input.name}</h4>
                      <span className="text-[10px] text-on-surface-variant block mt-1">Kayıt: {input.date}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-600/10 text-blue-700 border border-blue-600/15 shrink-0">
                      {input.class}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs border-y border-border-color py-2">
                    <div>
                      <span className="text-on-surface-variant text-[9px] block">İhtiyaç</span>
                      <span className="text-on-surface font-mono font-medium">{input.quantity.toLocaleString()} kg</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-[9px] block">Frekans</span>
                      <span className="text-on-surface font-medium">{input.frequency}</span>
                    </div>
                    <div className="col-span-1">
                      <span className="text-on-surface-variant text-[9px] block">Özellik</span>
                      <span className="text-on-surface truncate block max-w-[80px]" title={input.specs}>
                        {input.specs}
                      </span>
                    </div>
                  </div>
                  <div className="text-center text-on-surface-variant text-[11px] font-medium py-1">
                    ⏳ Eşleştirme Bekliyor
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
