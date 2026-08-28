"use client";

import React, { useState } from "react";
import styles from "./Modal.module.css";

type AuthMode = "login" | "register" | "forgot" | "verify";

interface AuthModalProps {
  isOpen: boolean;
  role: "user" | "osb" | "admin";
  onClose: () => void;
  onAuthComplete: (role: "user" | "osb" | "admin") => void;
}

export default function AuthModal({ isOpen, role, onClose, onAuthComplete }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const roleLabel = role === "osb" ? "OSB Yönetim Paneli" : role === "admin" ? "Sistem Admin Paneli" : "Tesis Paneli";

  const resetAndClose = () => {
    setMode("login");
    setEmail("");
    setPassword("");
    setFacilityName("");
    setError("");
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("E-posta ve şifre alanları zorunludur.");
      return;
    }
    setError("");
    onAuthComplete(role);
    resetAndClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityName || !email || !password) {
      setError("Tüm alanları doldurunuz.");
      return;
    }
    setError("");
    setMode("verify");
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("E-posta adresinizi giriniz.");
      return;
    }
    setError("");
    alert(`${email} adresine şifre sıfırlama bağlantısı gönderildi (simüle edilmiştir).`);
    setMode("login");
  };

  return (
    <div className={styles.backdrop}>
      <div className={`${styles.modalContent} glass-panel`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-title font-bold text-lg text-white">
              {mode === "login" && "Giriş Yap"}
              {mode === "register" && "Yeni Tesis Kaydı"}
              {mode === "forgot" && "Şifre Sıfırla"}
              {mode === "verify" && "E-posta Doğrulama"}
            </h3>
            <p className="text-[10px] text-on-surface-variant mt-0.5">{roleLabel}</p>
          </div>
          <button onClick={resetAndClose} className="text-on-surface-variant hover:text-white cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">E-posta</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
                placeholder="tesis@ornek.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Şifre</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-xs text-rose-400">{error}</p>}
            <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer">
              Giriş Yap
            </button>
            <div className="flex justify-between text-[11px] text-on-surface-variant">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMode("forgot");
                }}
                className="hover:text-accent-mint cursor-pointer"
              >
                Şifremi Unuttum
              </button>
              {role !== "admin" && (
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMode("register");
                  }}
                  className="hover:text-accent-mint cursor-pointer"
                >
                  Yeni Tesis mi kaydolacaksınız?
                </button>
              )}
            </div>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Tesis Adı</label>
              <input
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                type="text"
                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
                placeholder="Örn: Gebze Metal A.Ş."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">E-posta</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
                placeholder="tesis@ornek.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Şifre</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-xs text-rose-400">{error}</p>}
            <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer">
              Kaydı Tamamla
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                setMode("login");
              }}
              className="text-[11px] text-on-surface-variant hover:text-accent-mint cursor-pointer self-center"
            >
              Zaten hesabınız var mı? Giriş Yapın
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
            <p className="text-xs text-on-surface-variant">
              Kayıtlı e-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">E-posta</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-mint"
                placeholder="tesis@ornek.com"
              />
            </div>
            {error && <p className="text-xs text-rose-400">{error}</p>}
            <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer">
              Sıfırlama Bağlantısı Gönder
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                setMode("login");
              }}
              className="text-[11px] text-on-surface-variant hover:text-accent-mint cursor-pointer self-center"
            >
              Girişe Dön
            </button>
          </form>
        )}

        {mode === "verify" && (
          <div className="flex flex-col gap-4 items-center text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-accent-mint/10 border border-accent-mint/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-accent-mint text-3xl">mark_email_read</span>
            </div>
            <p className="text-sm text-white font-semibold">Doğrulama e-postası gönderildi</p>
            <p className="text-xs text-on-surface-variant">
              <span className="text-accent-mint">{email || "e-posta adresinize"}</span> gönderilen bağlantıya tıklayarak
              hesabınızı doğrulayın (bu adım simüle edilmiştir).
            </p>
            <button
              onClick={() => {
                onAuthComplete(role);
                resetAndClose();
              }}
              className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer"
            >
              E-postamı Doğruladım, Devam Et
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
