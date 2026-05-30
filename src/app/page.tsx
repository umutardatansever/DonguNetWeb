"use client";

import React, { useState } from "react";
import { OutputItem, InputItem, MatchCandidate, ChatMessage, OSBVerification } from "@/types";

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

// Import Modals
import AddOutputModal from "@/components/Modals/AddOutputModal";
import AddInputModal from "@/components/Modals/AddInputModal";
import DppModal from "@/components/Modals/DppModal";
import SuccessModal from "@/components/Modals/SuccessModal";

export default function Home() {
  // --- CORE ROUTING STATE ---
  const [currentPage, setCurrentPage] = useState<
    "landing" | "dashboard" | "materials" | "matchmaker" | "reports" | "chatbot" | "osb"
  >("landing");
  const [userRole, setUserRole] = useState<"user" | "osb" | "none">("none");
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
      details: { material: 75, quality: 70, env: 78, logistics: 60, economic: 75 },
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

  const [osbVerificationList, setOsbVerificationList] = useState<OSBVerification[]>([
    { id: "v-1", name: "Kocaeli Cam Sanayi", sector: "Cam Geri Kazanım", status: "pending" },
    { id: "v-2", name: "Marmara Kağıt A.Ş.", sector: "Selüloz İşleme", status: "pending" },
  ]);

  // --- MODALS STATE ---
  const [showOutputModal, setShowOutputModal] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showDppModal, setShowDppModal] = useState(false);
  const [selectedDppOutput, setSelectedDppOutput] = useState<OutputItem | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- LOGIN / LOGOUT MOCKS ---
  const handleLogin = (role: "user" | "osb") => {
    setUserRole(role);
    if (role === "osb") {
      setCurrentPage("osb");
    } else {
      setCurrentPage("dashboard");
    }
  };

  const handleLogout = () => {
    setUserRole("none");
    setCurrentPage("landing");
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

    const newItem: InputItem = {
      id: newId,
      name: classVal, // Wait! Let's check original: name: formInName. Ah! Let's check original. Original page.tsx had: name: formInName, class: formInClass, quantity: formInQty, etc. Here we receive (name, classVal, freq, qty, specs). So we should set name: name, class: classVal, quantity: qty, frequency: freq, specs: specs, date: today.
      class: classVal,
      frequency: freq,
      quantity: qty,
      specs,
      date: today,
    };

    // Wait! Let's double check if "name" is set to "classVal" or "name" in original.
    // Original code: name: formInName. So we must set name: name! Let's fix that.
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
    setMatches(
      matches.map((m) => (m.id === selectedMatchId ? { ...m, status: "accepted" } : m))
    );
    setShowSuccessModal(true);
  };

  const handleVerifyOsbFacility = (id: string) => {
    setOsbVerificationList(
      osbVerificationList.map((v) => (v.id === id ? { ...v, status: "approved" } : v))
    );
    alert("Tesis başarıyla onaylandı ve OSB genel haritasına dahil edildi.");
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
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
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
            <Header userRole={userRole} currentPage={currentPage} setSidebarOpen={setSidebarOpen} />

            {/* View Panels */}
            <main className="flex-grow p-4 md:p-8 bg-slate-950 relative overflow-y-auto">
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
                <ChatbotView chatMessages={chatMessages} setChatMessages={setChatMessages} />
              )}

              {currentPage === "osb" && (
                <OsbView
                  osbVerificationList={osbVerificationList}
                  onVerifyFacility={handleVerifyOsbFacility}
                />
              )}
            </main>
          </div>
        </div>
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
