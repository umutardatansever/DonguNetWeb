"use client";

import React from "react";
import styles from "./Header.module.css";

interface HeaderProps {
  userRole: "user" | "osb" | "none";
  currentPage: "landing" | "dashboard" | "materials" | "matchmaker" | "reports" | "chatbot" | "osb";
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ userRole, currentPage, setSidebarOpen }: HeaderProps) {
  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Kontrol Paneli";
      case "materials":
        return "Malzeme Yönetimi";
      case "matchmaker":
        return "AI Eşleştirme Paneli";
      case "reports":
        return "Raporlama Merkezi";
      case "chatbot":
        return "DöngüNet AI Asistanı";
      case "osb":
        return "OSB Yönetici Paneli";
      default:
        return "";
    }
  };

  return (
    <header className={styles.header}>
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-white mr-1 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
        <h2 className="font-title text-base md:text-xl font-bold text-white truncate">
          {getPageTitle()}
        </h2>
        <span
          className={`px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
            userRole === "osb"
              ? "bg-teal-400/10 text-teal-400 border-teal-400/20"
              : "bg-accent-mint/10 text-accent-mint border-accent-mint/20"
          }`}
        >
          {userRole === "osb" ? "OSB" : "TESİS"}
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-white transition-colors relative cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-mint"></span>
        </button>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-white/5">
          <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse"></span>
          <span className="text-xs font-semibold text-white">Bağlı (Simüle)</span>
        </div>
      </div>
    </header>
  );
}
