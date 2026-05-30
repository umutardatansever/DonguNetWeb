"use client";

import React from "react";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  userRole: "user" | "osb" | "none";
  currentPage: "landing" | "dashboard" | "materials" | "matchmaker" | "reports" | "chatbot" | "osb";
  setCurrentPage: (page: "landing" | "dashboard" | "materials" | "matchmaker" | "reports" | "chatbot" | "osb") => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

export default function Sidebar({
  userRole,
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
}: SidebarProps) {
  const handleNavClick = (page: "dashboard" | "materials" | "matchmaker" | "reports" | "chatbot" | "osb") => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  return (
    <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
      <div>
        {/* Sidebar Logo / Close Button */}
        <div className={styles.logoArea}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-accent-mint text-3xl filled">recycling</span>
            <span className="font-title text-xl font-bold tracking-tight text-white">
              Döngü<span className="text-accent-mint">Net</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg bg-slate-800 border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className={styles.navContainer}>
          {userRole === "user" && (
            <>
              <button
                onClick={() => handleNavClick("dashboard")}
                className={`${styles.link} ${currentPage === "dashboard" ? styles.linkActive : styles.linkInactive}`}
              >
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                Kontrol Paneli
              </button>
              <button
                onClick={() => handleNavClick("materials")}
                className={`${styles.link} ${currentPage === "materials" ? styles.linkActive : styles.linkInactive}`}
              >
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                Malzeme Yönetimi
              </button>
              <button
                onClick={() => handleNavClick("matchmaker")}
                className={`${styles.link} ${currentPage === "matchmaker" ? styles.linkActive : styles.linkInactive}`}
              >
                <span className="material-symbols-outlined text-[20px]">hub</span>
                AI Eşleştirme Paneli
              </button>
              <button
                onClick={() => handleNavClick("reports")}
                className={`${styles.link} ${currentPage === "reports" ? styles.linkActive : styles.linkInactive}`}
              >
                <span className="material-symbols-outlined text-[20px]">description</span>
                Raporlama Merkezi
              </button>
              <button
                onClick={() => handleNavClick("chatbot")}
                className={`${styles.link} ${currentPage === "chatbot" ? styles.linkActive : styles.linkInactive}`}
              >
                <span className="material-symbols-outlined text-[20px]">forum</span>
                DöngüNet AI Asistanı
              </button>
            </>
          )}
          {userRole === "osb" && (
            <button
              onClick={() => handleNavClick("osb")}
              className={`${styles.link} ${currentPage === "osb" ? styles.linkActive : styles.linkInactive}`}
            >
              <span className="material-symbols-outlined text-[20px]">domain</span>
              OSB Yönetici Paneli
            </button>
          )}
        </nav>
      </div>

      {/* Profile and Logout */}
      <div className={styles.profileArea}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-accent-mint/10 border border-accent-mint/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-accent-mint">factory</span>
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">
              {userRole === "osb" ? "Gebze OSB Müdürlüğü" : "Gebze Metal A.Ş."}
            </h4>
            <p className="text-[10px] text-on-surface-variant">
              {userRole === "osb" ? "Bölge Yöneticisi" : "Tesis Temsilcisi"}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
