"use client";

import React from "react";
import styles from "./Header.module.css";
import NotificationCenter from "../Notifications/NotificationCenter";
import { AppNotification } from "../../types";

interface HeaderProps {
  userRole: "user" | "osb" | "admin" | "none";
  currentPage: "landing" | "dashboard" | "materials" | "matchmaker" | "reports" | "chatbot" | "osb" | "admin";
  setSidebarOpen: (open: boolean) => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function Header({
  userRole,
  currentPage,
  setSidebarOpen,
  notifications,
  onMarkRead,
  onMarkAllRead,
}: HeaderProps) {
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
      case "admin":
        return "Sistem Admin Paneli";
      default:
        return "";
    }
  };

  return (
    <header className={styles.header}>
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden w-10 h-10 rounded-xl bg-surface-light border border-border-color flex items-center justify-center text-on-surface-variant hover:text-on-surface mr-1 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
        <h2 className="font-title text-base md:text-xl font-bold text-on-surface truncate">
          {getPageTitle()}
        </h2>
        <span
          className={`px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
            userRole === "osb"
              ? "bg-teal-600/10 text-teal-700 border-teal-600/20"
              : userRole === "admin"
              ? "bg-amber-600/10 text-amber-700 border-amber-600/20"
              : "bg-accent-mint/10 text-accent-mint border-accent-mint/20"
          }`}
        >
          {userRole === "osb" ? "OSB" : userRole === "admin" ? "ADMIN" : "TESİS"}
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <NotificationCenter notifications={notifications} onMarkRead={onMarkRead} onMarkAllRead={onMarkAllRead} />
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-light border border-border-color">
          <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse"></span>
          <span className="text-xs font-semibold text-on-surface">Bağlı (Simüle)</span>
        </div>
      </div>
    </header>
  );
}
