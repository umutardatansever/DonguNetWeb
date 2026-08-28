"use client";

import React, { useState } from "react";
import {
  OutputItem,
  InputItem,
  MatchCandidate,
  ChatMessage,
  OSBVerification,
  AppNotification,
  PlatformUser,
  ReviewQueueItem,
  WeightsConfig,
} from "@/types";

// Import Views
import LandingView from "@/components/LandingView/LandingView";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import DashboardView from "@/components/DashboardView/DashboardView";
import MaterialsView from "@/components/MaterialsView/MaterialsView";
import MatchmakerView from "@/components/MatchmakerView/MatchmakerView";
import ReportsView from "@/components/ReportsView/ReportsView";
import ChatbotView from "@/components/ChatbotView/ChatbotView";
import OsbView from "@/components/OsbView/OsbView";
import AdminView from "@/components/AdminView/AdminView";
import ChatWidget from "@/components/ChatWidget/ChatWidget";

// Import Modals
import AddOutputModal from "@/components/Modals/AddOutputModal";
import AddInputModal from "@/components/Modals/AddInputModal";
import DppModal from "@/components/Modals/DppModal";
import SuccessModal from "@/components/Modals/SuccessModal";

type UserRole = "user" | "osb" | "admin" | "none";
type Page = "landing" | "dashboard" | "materials" | "matchmaker" | "reports" | "chatbot" | "osb" | "admin";

const nowStamp = () =>
  new Date().toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function Home() {
  // --- CORE ROUTING STATE ---
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [userRole, setUserRole] = useState<UserRole>("none");
  const [currentMaterialTab, setCurrentMaterialTab] = useState<"outputs" | "inputs">("outputs");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- MOCK DATABASE STATE ---
  const [outputs, setOutputs] = useState<OutputItem[]>([
    {
      id: "out-1",
      name: "Alüminyum Alaşımlı Toz",
      class: "METAL",
      quantity: 1200,
      stock: 1200,
      composition: "Fe %71, Al %16",
      date: "2026-05-24",
      dppId: "DPP-US-0091-23",
    },
    {
      id: "out-2",
      name: "Atık PET Çapak",
      class: "PLASTIC",
      quantity: 3000,
      stock: 3000,
      composition: "PET %100",
      date: "2026-05-24",
      dppId: "DPP-US-1021-99",
    },
  ]);

  const [inputs, setInputs] = useState<InputItem[]>([
    {
      id: "in-1",
      name: "Krom Tozu H-4",
      class: "METAL",
      quantity: 2500,
      frequency: "Aylık",
      specs: "Saflık > %92",
      date: "2026-05-24",
    },
  ]);

  const [matches, setMatches] = useState<MatchCandidate[]>([
    {
      id: "m-1",
      name: "Dilovası Alüminyum Döküm (Fabrika B)",
      score: 86,
      distance: 14.2,
      co2: 590,
      savings: 1200,
      status: "pending",
      date: "2026-05-24",
      confidence: 0.91,
      details: { material: 90, quality: 85, env: 88, logistics: 80, economic: 85 },
    },
    {
      id: "m-2",
      name: "Kartal Geri Dönüşüm A.Ş.",
      score: 72,
      distance: 35.1,
      co2: 310,
      savings: 800,
      status: "pending",
      date: "2026-05-20",
      confidence: 0.68,
      details: { material: 75, quality: 70, env: 78, logistics: 60, economic: 75 },
    },
    {
      id: "m-3",
      name: "Marmara Cam Geri Kazanım",
      score: 81,
      distance: 21.4,
      co2: 410,
      savings: 950,
      status: "completed",
      date: "2026-04-11",
      confidence: 0.87,
      details: { material: 84, quality: 80, env: 82, logistics: 74, economic: 79 },
    },
  ]);

  const [selectedMatchId, setSelectedMatchId] = useState<string>("m-1");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Merhaba! DöngüNet AI Sürdürülebilirlik Asistanıyım. Sınırda Karbon Düzenleme Mekanizması (SKDM - CBAM), Dijital Ürün Pasaportları (DPP) veya atık kodları hakkındaki sorularınızı cevaplayabilirim.",
    },
  ]);
  const [chatIsTyping, setChatIsTyping] = useState(false);

  const [osbVerificationList, setOsbVerificationList] = useState<OSBVerification[]>([
    { id: "v-1", name: "Kocaeli Cam Sanayi", sector: "Cam Geri Kazanım", status: "pending" },
    { id: "v-2", name: "Marmara Kağıt A.Ş.", sector: "Selüloz İşleme", status: "pending" },
  ]);

  // --- NOTIFICATIONS STATE ---
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "n-1",
      type: "review_required",
      title: "Onay bekleyen eşleşme",
      body: "Kartal Geri Dönüşüm A.Ş. eşleşmesi güven skoru düşük olduğu için uzman onayına gönderildi.",
      read: false,
      createdAt: nowStamp(),
    },
  ]);

  // --- ADMIN STATE ---
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>([
    { id: "u-1", name: "Umut Arda Tansever", email: "umut@gebzemetal.com", role: "user", facility: "Gebze Metal A.Ş." },
    { id: "u-2", name: "Sehel Kayaoğlu", email: "sehel@dongunet.com", role: "admin", facility: "DöngüNet HQ" },
    { id: "u-3", name: "Esra Badur", email: "esra@gebzeosb.gov.tr", role: "osb_manager", facility: "Gebze OSB Müdürlüğü" },
  ]);

  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>([
    {
      id: "rq-1",
      matchName: "Kartal Geri Dönüşüm A.Ş.",
      confidence: 0.68,
      reason: "Güven skoru HITL eşiği olan %80'in altında",
      status: "pending",
    },
  ]);

  const [weights, setWeights] = useState<WeightsConfig>({
    material: 30,
    quality: 20,
    environmental: 20,
    logistics: 15,
    economic: 15,
  });

  // --- MODALS STATE ---
  const [showOutputModal, setShowOutputModal] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showDppModal, setShowDppModal] = useState(false);
  const [selectedDppOutput, setSelectedDppOutput] = useState<OutputItem | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- LOGIN / LOGOUT MOCKS ---
  const handleLogin = (role: "user" | "osb" | "admin") => {
    setUserRole(role);
    if (role === "osb") {
      setCurrentPage("osb");
    } else if (role === "admin") {
      setCurrentPage("admin");
    } else {
      setCurrentPage("dashboard");
    }
  };

  const handleLogout = () => {
    setUserRole("none");
    setCurrentPage("landing");
  };

  // --- NOTIFICATION HANDLERS ---
  const pushNotification = (notification: Omit<AppNotification, "id" | "read" | "createdAt">) => {
    setNotifications((prev) => [
      { ...notification, id: `n-${prev.length + 1}-${Date.now()}`, read: false, createdAt: nowStamp() },
      ...prev,
    ]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // --- FORM HANDLERS ---
  const handleAddOutputSubmit = (
    name: string,
    classVal: string,
    comp: string,
    qty: number,
    stock: number
  ) => {
    const newId = `out-${outputs.length + 1}`;
    const newDppId = `DPP-US-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
      10 + Math.random() * 90
    )}`;
    const today = new Date().toISOString().split("T")[0];

    const newItem: OutputItem = {
      id: newId,
      name,
      class: classVal,
      composition: comp,
      quantity: qty,
      stock,
      date: today,
      dppId: newDppId,
    };

    setOutputs([...outputs, newItem]);
    setShowOutputModal(false);
  };

  const handleAddInputSubmit = (
    name: string,
    classVal: string,
    freq: string,
    qty: number,
    specs: string
  ) => {
    const newId = `in-${inputs.length + 1}`;
    const today = new Date().toISOString().split("T")[0];

    const itemToAdd: InputItem = {
      id: newId,
      name: name,
      class: classVal,
      frequency: freq,
      quantity: qty,
      specs: specs,
      date: today,
    };

    setInputs([...inputs, itemToAdd]);
    setShowInputModal(false);
  };

  // --- MATCHMAKER ACTIONS ---
  const handleAcceptMatch = () => {
    const match = matches.find((m) => m.id === selectedMatchId);
    setMatches(
      matches.map((m) => (m.id === selectedMatchId ? { ...m, status: "accepted" } : m))
    );
    setShowSuccessModal(true);
    if (match) {
      pushNotification({
        type: "match_accepted",
        title: "Eşleşme kabul edildi",
        body: `${match.name} ile olan eşleştirme kabul edildi, iletişim bilgileri paylaşıldı.`,
      });
    }
  };

  const handleVerifyOsbFacility = (id: string) => {
    const facility = osbVerificationList.find((v) => v.id === id);
    setOsbVerificationList(
      osbVerificationList.map((v) => (v.id === id ? { ...v, status: "approved" } : v))
    );
    if (facility) {
      pushNotification({
        type: "facility_verified",
        title: "Tesis doğrulandı",
        body: `${facility.name} tesisi başarıyla doğrulandı ve OSB genel haritasına dahil edildi.`,
      });
    }
  };

  // --- ADMIN ACTIONS ---
  const handleRemoveUser = (id: string) => {
    setPlatformUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleApproveReview = (id: string) => {
    setReviewQueue((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
    const item = reviewQueue.find((r) => r.id === id);
    if (item) {
      pushNotification({
        type: "match_accepted",
        title: "Uzman onayı tamamlandı",
        body: `${item.matchName} eşleşmesi uzman incelemesinden onaylandı.`,
      });
    }
  };

  const handleRejectReview = (id: string) => {
    setReviewQueue((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
  };

  const handleSaveWeights = (newWeights: WeightsConfig) => {
    setWeights(newWeights);
  };

  // --- CHATBOT ACTIONS (paylaşılan: tam sayfa + köşe widget) ---
  const handleChatSend = (userMsg: string) => {
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatIsTyping(true);

    setTimeout(() => {
      setChatIsTyping(false);
      const lower = userMsg.toLowerCase();
      let reply =
        "DöngüNet AI asistanı olarak sorunuzu tam olarak anlayamadım. Ancak sürdürülebilirlik, SKDM (sınırda karbon vergisi), Dijital Ürün Pasaportları (DPP) veya endüstriyel simbiyoz süreçlerimiz hakkında sorular sorabilirsiniz.";

      if (lower.includes("skdm") || lower.includes("cbam") || lower.includes("karbon")) {
        reply =
          "<strong>Sınırda Karbon Düzenleme Mekanizması (SKDM - CBAM) Hakkında:</strong> AB Yeşil Mutabakatı kapsamında, birlik dışından ithal edilen çimento, demir-çelik, alüminyum, gübre, hidrojen ve elektrik gibi ürünlerin gömülü karbon emisyonlarına göre gümrükte vergilendirilmesidir. DöngüNet üzerinde yaptığınız atık eşleştirmeleri, birincil (virgin) metal kullanımı yerine ikincil alaşım kullanımı sağladığı için gömülü karbon miktarınızı önemli ölçüde azaltır ve yasal uyumluluk raporu (CBAM Raporu) olarak çıktı alınabilir.";
      } else if (lower.includes("pasaport") || lower.includes("dpp") || lower.includes("espr")) {
        reply =
          "<strong>Dijital Ürün Pasaportu (DPP) Nedir?</strong> AB'nin Ecodesign for Sustainable Products Regulation (ESPR) yönetmeliğine göre ürünlerin malzeme kimliği, saflığı, menşei, karbon ayak izi ve geri dönüştürülebilirlik durumunu dijital olarak barındıran yapıdır. DöngüNet'te oluşturduğumuz pasaportlar, atığınızın değerini kanıtlar ve izlenebilirlik sağlayan benzersiz bir QR Kod ile üretilir.";
      } else if (
        lower.includes("simbiyoz") ||
        lower.includes("eşleştirme") ||
        lower.includes("nasıl") ||
        lower.includes("skor")
      ) {
        reply =
          "<strong>DöngüNet AI Eşleştirme Sistemi:</strong> Tesislerimizin sisteme girdiği çıktılar ile diğer tesislerin girdileri arasında anlamsal S-BERT analizi yapılır (benzerlik limiti $\\ge 0.60$). Eşleşen adaylar; <strong>Malzeme Uyumu (%30)</strong>, <strong>Kalite Uyumu (%20)</strong>, <strong>Çevresel Kazanç (%20)</strong>, <strong>Lojistik (%15)</strong> ve <strong>Ekonomik Fayda (%15)</strong> olmak üzere 5 farklı ağırlık üzerinden AHP (Analitik Hiyerarşi Süreci) algoritmasıyla puanlanarak listelenir.";
      }

      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    }, 1500);
  };

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  return (
    <div className="flex-grow w-full flex flex-col relative select-none">
      {/* ================= 1. PUBLIC LANDING VIEW ================= */}
      {currentPage === "landing" && <LandingView onLogin={handleLogin} />}

      {/* ================= 2. AUTHENTICATED SYSTEM CONTAINER ================= */}
      {currentPage !== "landing" && (
        <div className="w-full min-h-screen flex relative overflow-x-hidden">
          {/* Mobile Sidebar Backdrop Overlay */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            />
          )}

          {/* Left Sidebar Navigation */}
          <Sidebar
            userRole={userRole}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onLogout={handleLogout}
          />

          {/* Right Main Content */}
          <div className="flex-grow pl-0 lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
            {/* Header */}
            <Header
              userRole={userRole}
              currentPage={currentPage}
              setSidebarOpen={setSidebarOpen}
              notifications={notifications}
              onMarkRead={handleMarkNotificationRead}
              onMarkAllRead={handleMarkAllNotificationsRead}
            />

            {/* View Panels */}
            <main className="flex-grow p-4 md:p-8 bg-background relative overflow-y-auto">
              {currentPage === "dashboard" && (
                <DashboardView
                  outputsCount={outputs.length}
                  inputsCount={inputs.length}
                  outputs={outputs}
                />
              )}

              {currentPage === "materials" && (
                <MaterialsView
                  outputs={outputs}
                  inputs={inputs}
                  currentTab={currentMaterialTab}
                  setCurrentTab={setCurrentMaterialTab}
                  onShowOutputModal={() => setShowOutputModal(true)}
                  onShowInputModal={() => setShowInputModal(true)}
                  onShowDppModal={(out) => {
                    setSelectedDppOutput(out);
                    setShowDppModal(true);
                  }}
                />
              )}

              {currentPage === "matchmaker" && (
                <MatchmakerView
                  matches={matches}
                  setMatches={setMatches}
                  selectedMatchId={selectedMatchId}
                  setSelectedMatchId={setSelectedMatchId}
                  onAcceptMatch={handleAcceptMatch}
                />
              )}

              {currentPage === "reports" && <ReportsView />}

              {currentPage === "chatbot" && (
                <ChatbotView chatMessages={chatMessages} onSend={handleChatSend} isTyping={chatIsTyping} />
              )}

              {currentPage === "osb" && (
                <OsbView
                  osbVerificationList={osbVerificationList}
                  onVerifyFacility={handleVerifyOsbFacility}
                />
              )}

              {currentPage === "admin" && (
                <AdminView
                  users={platformUsers}
                  onRemoveUser={handleRemoveUser}
                  reviewQueue={reviewQueue}
                  onApproveReview={handleApproveReview}
                  onRejectReview={handleRejectReview}
                  weights={weights}
                  onSaveWeights={handleSaveWeights}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* ================= FLOATING CHAT WIDGET ================= */}
      {currentPage !== "landing" && currentPage !== "chatbot" && (
        <ChatWidget chatMessages={chatMessages} onSend={handleChatSend} isTyping={chatIsTyping} />
      )}

      {/* ================= MODAL WINDOWS ================= */}
      <AddOutputModal
        isOpen={showOutputModal}
        onClose={() => setShowOutputModal(false)}
        onSubmit={handleAddOutputSubmit}
      />

      <AddInputModal
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        onSubmit={handleAddInputSubmit}
      />

      <DppModal
        isOpen={showDppModal}
        onClose={() => setShowDppModal(false)}
        output={selectedDppOutput}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        selectedMatch={selectedMatch}
      />
    </div>
  );
}
