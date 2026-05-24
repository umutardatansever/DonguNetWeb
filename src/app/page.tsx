"use client";

import React, { useState, useEffect, useRef } from "react";

// --- TYPES ---
interface OutputItem {
  id: string;
  name: string;
  class: string;
  quantity: number;
  stock: number;
  composition: string;
  date: string;
  dppId: string;
}

interface InputItem {
  id: string;
  name: string;
  class: string;
  quantity: number;
  frequency: string;
  specs: string;
  date: string;
}

interface MatchCandidate {
  id: string;
  name: string;
  score: number;
  distance: number;
  co2: number;
  savings: number;
  status: "pending" | "accepted" | "rejected";
  details: {
    material: number;
    quality: number;
    env: number;
    logistics: number;
    economic: number;
  };
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface OSBVerification {
  id: string;
  name: string;
  sector: string;
  status: "pending" | "approved";
}

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
    { id: "out-1", name: "Alüminyum Alaşımlı Toz", class: "METAL", quantity: 1200, stock: 1200, composition: "Fe %71, Al %16", date: "2026-05-24", dppId: "DPP-US-0091-23" },
    { id: "out-2", name: "Atık PET Çapak", class: "PLASTIC", quantity: 3000, stock: 3000, composition: "PET %100", date: "2026-05-24", dppId: "DPP-US-1021-99" }
  ]);

  const [inputs, setInputs] = useState<InputItem[]>([
    { id: "in-1", name: "Krom Tozu H-4", class: "METAL", quantity: 2500, frequency: "Aylık", specs: "Saflık > %92", date: "2026-05-24" }
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
      details: { material: 90, quality: 85, env: 88, logistics: 80, economic: 85 } 
    },
    { 
      id: "m-2", 
      name: "Kartal Geri Dönüşüm A.Ş.", 
      score: 72, 
      distance: 35.1, 
      co2: 310, 
      savings: 800, 
      status: "pending", 
      details: { material: 75, quality: 70, env: 78, logistics: 60, economic: 75 } 
    }
  ]);

  const [selectedMatchId, setSelectedMatchId] = useState<string>("m-1");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Merhaba! DöngüNet AI Sürdürülebilirlik Asistanıyım. Sınırda Karbon Düzenleme Mekanizması (SKDM - CBAM), Dijital Ürün Pasaportları (DPP) veya atık kodları hakkındaki sorularınızı cevaplayabilirim." }
  ]);

  const [osbVerificationList, setOsbVerificationList] = useState<OSBVerification[]>([
    { id: "v-1", name: "Kocaeli Cam Sanayi", sector: "Cam Geri Kazanım", status: "pending" },
    { id: "v-2", name: "Marmara Kağıt A.Ş.", sector: "Selüloz İşleme", status: "pending" }
  ]);

  // --- MODALS STATE ---
  const [showOutputModal, setShowOutputModal] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showDppModal, setShowDppModal] = useState(false);
  const [selectedDppOutput, setSelectedDppOutput] = useState<OutputItem | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- FORM STATES ---
  const [formOutName, setFormOutName] = useState("");
  const [formOutClass, setFormOutClass] = useState("METAL");
  const [formOutComp, setFormOutComp] = useState("");
  const [formOutQty, setFormOutQty] = useState("");
  const [formOutStock, setFormOutStock] = useState("");

  const [formInName, setFormInName] = useState("");
  const [formInClass, setFormInClass] = useState("METAL");
  const [formInFreq, setFormInFreq] = useState("");
  const [formInQty, setFormInQty] = useState("");
  const [formInSpecs, setFormInSpecs] = useState("");

  const [chatInput, setChatInput] = useState("");
  const [chatIsTyping, setChatIsTyping] = useState(false);

  const [rejectPanelOpen, setRejectPanelOpen] = useState(false);
  const [rejectReasonText, setRejectReasonText] = useState("");

  // --- REFS ---
  const sensorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const forecastCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);



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

  // --- DRAWING IoT SENSOR LINE CHART ---
  function drawDashboardSensorChart() {
    const canvas = sensorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const w = rect.width;
    const h = rect.height;
    const padding = 25;

    const data = [200, 350, 290, 520, 680, 890, 1180];
    const maxVal = 1300;
    const points = data.map((val, index) => {
      const x = padding + (index / (data.length - 1)) * (w - 2 * padding);
      const y = h - padding - (val / maxVal) * (h - 2 * padding);
      return { x, y };
    });

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const gridY = padding + (i / 4) * (h - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(padding, gridY);
      ctx.lineTo(w - padding, gridY);
      ctx.stroke();
    }

    // Fill Gradient below curve
    const gradient = ctx.createLinearGradient(0, padding, 0, h - padding);
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)");
    gradient.addColorStop(1, "rgba(16, 185, 129, 0)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, h - padding);
    for (let i = 0; i < points.length - 1; i++) {
      const cpX = (points[i].x + points[i + 1].x) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, cpX, (points[i].y + points[i + 1].y) / 2);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[points.length - 1].x, h - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const cpX = (points[i].x + points[i + 1].x) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, cpX, (points[i].y + points[i + 1].y) / 2);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Dots and labels
    ctx.fillStyle = "#ffffff";
    ctx.font = "9px Inter, sans-serif";
    ctx.textAlign = "center";
    points.forEach((pt, i) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.fillText(data[i] + "kg", pt.x, pt.y - 10);
    });
  };

  // --- DRAWING FORECAST CHART ---
  function drawDashboardForecastChart() {
    const canvas = forecastCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const w = rect.width;
    const h = rect.height;
    const padding = 25;

    const histData = [1200, 1150, 1250, 1180, 1200];
    const forecastData = [1200, 1260, 1340];
    const maxVal = 1500;
    const minVal = 1000;

    const mapValueToY = (val: number) => {
      return h - padding - ((val - minVal) / (maxVal - minVal)) * (h - 2 * padding);
    };

    ctx.clearRect(0, 0, w, h);

    // Grids
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    for (let i = 0; i < 5; i++) {
      const gridY = padding + (i / 4) * (h - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(padding, gridY);
      ctx.lineTo(w - padding, gridY);
      ctx.stroke();
    }

    // Historical Curve
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0d9488";

    let lastX = padding;
    let lastY = mapValueToY(histData[0]);
    ctx.moveTo(lastX, lastY);

    for (let i = 1; i < histData.length; i++) {
      const x = padding + (i / 6) * (w - 2 * padding);
      const y = mapValueToY(histData[i]);
      ctx.lineTo(x, y);
      lastX = x;
      lastY = y;
    }
    ctx.stroke();

    // Forecast Curve
    ctx.beginPath();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = "#a855f7";
    ctx.moveTo(lastX, lastY);

    const fcPoints = [{ x: lastX, y: lastY }];
    for (let i = 1; i < forecastData.length; i++) {
      const x = padding + ((histData.length - 1 + i) / 6) * (w - 2 * padding);
      const y = mapValueToY(forecastData[i]);
      ctx.lineTo(x, y);
      fcPoints.push({ x, y });
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Shaded bounds
    ctx.beginPath();
    ctx.fillStyle = "rgba(168, 85, 247, 0.08)";
    ctx.moveTo(fcPoints[0].x, fcPoints[0].y);
    ctx.lineTo(fcPoints[1].x, fcPoints[1].y - 15);
    ctx.lineTo(fcPoints[2].x, fcPoints[2].y - 30);
    ctx.lineTo(fcPoints[2].x, fcPoints[2].y + 30);
    ctx.lineTo(fcPoints[1].x, fcPoints[1].y + 15);
    ctx.closePath();
    ctx.fill();

    // Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Geçmiş", padding + 10, h - 10);
    ctx.textAlign = "right";
    ctx.fillStyle = "#a855f7";
    ctx.fillText("AI Tahmini", w - padding - 10, h - 10);
  };

  // --- DRAWING RADAR CHART ---
  function drawRadarChart(details: MatchCandidate["details"]) {
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2.6;

    const labels = ["Malzeme", "Kalite", "Çevre", "Lojistik", "Ekonomi"];
    const values = [details.material, details.quality, details.env, details.logistics, details.economic];
    const numAxes = labels.length;

    ctx.clearRect(0, 0, width, height);

    // Draw polygons
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let level = 1; level <= 5; level++) {
      const curRadius = radius * (level / 5);
      ctx.beginPath();
      for (let i = 0; i < numAxes; i++) {
        const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
        const x = centerX + curRadius * Math.cos(angle);
        const y = centerY + curRadius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Axes and Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 9px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const xAxis = centerX + radius * Math.cos(angle);
      const yAxis = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(xAxis, yAxis);
      ctx.stroke();

      const labelDist = radius + 15;
      const lx = centerX + labelDist * Math.cos(angle);
      const ly = centerY + labelDist * Math.sin(angle);
      ctx.fillText(labels[i], lx, ly);
    }

    // Score Polygon
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const valRatio = values[i] / 100;
      const x = centerX + radius * valRatio * Math.cos(angle);
      const y = centerY + radius * valRatio * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Data dots
    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const valRatio = values[i] / 100;
      const x = centerX + radius * valRatio * Math.cos(angle);
      const y = centerY + radius * valRatio * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  };
  // --- EFFECTS FOR CANVAS DRAWINGS ---
  useEffect(() => {
    if (currentPage === "dashboard") {
      drawDashboardSensorChart();
      drawDashboardForecastChart();
    }
  }, [currentPage, outputs]);

  useEffect(() => {
    if (currentPage === "matchmaker") {
      const match = matches.find(m => m.id === selectedMatchId);
      if (match) {
        drawRadarChart(match.details);
      }
    }
  }, [currentPage, selectedMatchId, matches]);

  useEffect(() => {
    // Scroll chat to bottom
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatIsTyping]);

  // --- INTERACTIVE SVG ROUTE MAP MOCK ---
  const renderRouteSvgMap = (match: MatchCandidate) => {
    const isMatch1 = match.id === "m-1";
    const startX = 80;
    const startY = 130;
    const destX = isMatch1 ? 380 : 420;
    const destY = isMatch1 ? 70 : 160;
    const midX = (startX + destX) / 2;
    const midY = Math.min(startY, destY) - 50;
    const pathD = `M ${startX} ${startY} Q ${midX} ${midY} ${destX} ${destY}`;

    return (
      <svg viewBox="0 0 500 200" className="w-full h-full text-slate-800" fill="currentColor">
        <defs>
          <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
        <path d="M 0 160 Q 180 180 250 140 T 500 170 L 500 200 L 0 200 Z" fill="rgba(13, 148, 136, 0.05)" />
        <path d={pathD} fill="none" stroke="#059669" strokeWidth={2} strokeDasharray="6 4" />
        <circle r={5} fill="#10b981">
          <animateMotion dur="4s" repeatCount="indefinite" path={pathD} />
        </circle>
        <circle cx={startX} cy={startY} r={6} fill="#059669" />
        <circle cx={startX} cy={startY} r={15} fill="none" stroke="#059669" strokeWidth={1.5}>
          <animate attributeName="r" values="6;16;6" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <text x={startX - 15} y={startY - 22} fill="#94a3b8" fontSize="9" fontWeight="bold">Gebze Metal (A)</text>
        <circle cx={destX} cy={destY} r={6} fill="#0d9488" />
        <circle cx={destX} cy={destY} r={15} fill="none" stroke="#0d9488" strokeWidth={1.5}>
          <animate attributeName="r" values="6;16;6" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <text x={destX - 35} y={destY - 22} fill="#94a3b8" fontSize="9" fontWeight="bold">{match.name.split(" (")[0]}</text>
      </svg>
    );
  };

  // --- SVG QR CODE GENERATION ---
  const drawMockSvgQrCode = () => {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
        <rect x="5" y="5" width="25" height="25" />
        <rect x="10" y="10" width="15" height="15" fill="white" />
        <rect x="15" y="15" width="5" height="5" />

        <rect x="70" y="5" width="25" height="25" />
        <rect x="75" y="10" width="15" height="15" fill="white" />
        <rect x="80" y="15" width="5" height="5" />

        <rect x="5" y="70" width="25" height="25" />
        <rect x="10" y="75" width="15" height="15" fill="white" />
        <rect x="15" y="80" width="5" height="5" />

        <rect x="75" y="75" width="10" height="10" />
        <rect x="78" y="78" width="4" height="4" fill="white" />

        <rect x="35" y="12" width="4" height="4" />
        <rect x="42" y="25" width="4" height="4" />
        <rect x="55" y="50" width="4" height="4" />
        <rect x="62" y="70" width="4" height="4" />
        <rect x="38" y="82" width="4" height="4" />
        <rect x="45" y="44" width="4" height="4" />
        <rect x="52" y="15" width="4" height="4" />
        <rect x="58" y="32" width="4" height="4" />
        <rect x="66" y="88" width="4" height="4" />
        <rect x="12" y="48" width="4" height="4" />
        <rect x="25" y="55" width="4" height="4" />
        <rect x="30" y="38" width="4" height="4" />
        <rect x="22" y="42" width="4" height="4" />
        <rect x="48" y="68" width="4" height="4" />
        <rect x="72" y="45" width="4" height="4" />
        <rect x="88" y="38" width="4" height="4" />
        <rect x="84" y="52" width="4" height="4" />
        <rect x="92" y="65" width="4" height="4" />
      </svg>
    );
  };

  // --- FORM HANDLERS ---
  const handleAddOutputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formOutName || !formOutComp || !formOutQty || !formOutStock) return;

    const newId = `out-${outputs.length + 1}`;
    const newDppId = `DPP-US-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`;
    const today = new Date().toISOString().split("T")[0];

    const newItem: OutputItem = {
      id: newId,
      name: formOutName,
      class: formOutClass,
      composition: formOutComp,
      quantity: parseFloat(formOutQty),
      stock: parseFloat(formOutStock),
      date: today,
      dppId: newDppId
    };

    setOutputs([...outputs, newItem]);
    setShowOutputModal(false);

    // Reset Form
    setFormOutName("");
    setFormOutClass("METAL");
    setFormOutComp("");
    setFormOutQty("");
    setFormOutStock("");
  };

  const handleAddInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInName || !formInFreq || !formInQty || !formInSpecs) return;

    const newId = `in-${inputs.length + 1}`;
    const today = new Date().toISOString().split("T")[0];

    const newItem: InputItem = {
      id: newId,
      name: formInName,
      class: formInClass,
      frequency: formInFreq,
      quantity: parseFloat(formInQty),
      specs: formInSpecs,
      date: today
    };

    setInputs([...inputs, newItem]);
    setShowInputModal(false);

    // Reset Form
    setFormInName("");
    setFormInClass("METAL");
    setFormInFreq("");
    setFormInQty("");
    setFormInSpecs("");
  };

  // --- MATCHMAKER ACTIONS ---
  const handleAcceptMatch = () => {
    setMatches(
      matches.map(m => (m.id === selectedMatchId ? { ...m, status: "accepted" } : m))
    );
    setShowSuccessModal(true);
  };

  const handleConfirmRejectMatch = () => {
    setMatches(
      matches.map(m => (m.id === selectedMatchId ? { ...m, status: "rejected" } : m))
    );
    setRejectPanelOpen(false);
    setRejectReasonText("");
  };

  // --- CHATBOT SUBMISSION ---
  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setChatIsTyping(true);

    setTimeout(() => {
      setChatIsTyping(false);
      const lower = userMsg.toLowerCase();
      let reply = "DöngüNet AI asistanı olarak sorunuzu tam olarak anlayamadım. Ancak sürdürülebilirlik, SKDM (sınırda karbon vergisi), Dijital Ürün Pasaportları (DPP) veya endüstriyel simbiyoz süreçlerimiz hakkında sorular sorabilirsiniz.";

      if (lower.includes("skdm") || lower.includes("cbam") || lower.includes("karbon")) {
        reply = "<strong>Sınırda Karbon Düzenleme Mekanizması (SKDM - CBAM) Hakkında:</strong> AB Yeşil Mutabakatı kapsamında, birlik dışından ithal edilen çimento, demir-çelik, alüminyum, gübre, hidrojen ve elektrik gibi ürünlerin gömülü karbon emisyonlarına göre gümrükte vergilendirilmesidir. DöngüNet üzerinde yaptığınız atık eşleştirmeleri, birincil (virgin) metal kullanımı yerine ikincil alaşım kullanımı sağladığı için gömülü karbon miktarınızı önemli ölçüde azaltır ve yasal uyumluluk raporu (CBAM Raporu) olarak çıktı alınabilir.";
      } else if (lower.includes("pasaport") || lower.includes("dpp") || lower.includes("espr")) {
        reply = "<strong>Dijital Ürün Pasaportu (DPP) Nedir?</strong> AB'nin Ecodesign for Sustainable Products Regulation (ESPR) yönetmeliğine göre ürünlerin malzeme kimliği, saflığı, menşei, karbon ayak izi ve geri dönüştürülebilirlik durumunu dijital olarak barındıran yapıdır. DöngüNet'te oluşturduğumuz pasaportlar, atığınızın değerini kanıtlar ve izlenebilirlik sağlayan benzersiz bir QR Kod ile üretilir.";
      } else if (lower.includes("simbiyoz") || lower.includes("eşleştirme") || lower.includes("nasıl") || lower.includes("skor")) {
        reply = "<strong>DöngüNet AI Eşleştirme Sistemi:</strong> Tesislerimizin sisteme girdiği çıktılar ile diğer tesislerin girdileri arasında anlamsal S-BERT analizi yapılır (benzerlik limiti $\ge 0.65$). Eşleşen adaylar; <strong>Malzeme Uyumu (%30)</strong>, <strong>Kalite Uyumu (%20)</strong>, <strong>Çevresel Kazanç (%20)</strong>, <strong>Lojistik (%15)</strong> ve <strong>Ekonomik Fayda (%15)</strong> olmak üzere 5 farklı ağırlık üzerinden AHP (Analitik Hiyerarşi Süreci) algoritmasıyla puanlanarak listelenir.";
      }

      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    }, 1500);
  };

  // --- REPORT DOWNLOAD SIMULATOR ---
  const handlePdfDownload = (name: string) => {
    alert(`${name}.pdf simüle edilmiş şekilde derleniyor ve indirme kuyruğuna alınıyor.`);
  };

  const handleVerifyOsbFacility = (id: string) => {
    setOsbVerificationList(
      osbVerificationList.map(v => (v.id === id ? { ...v, status: "approved" } : v))
    );
    alert("Tesis başarıyla onaylandı ve OSB genel haritasına dahil edildi.");
  };

  const selectedMatch = matches.find(m => m.id === selectedMatchId) || matches[0];

  return (
    <div className="flex-grow w-full flex flex-col relative select-none">
      
      {/* ================= 1. PUBLIC LANDING VIEW ================= */}
      {currentPage === "landing" && (
        <div className="w-full flex flex-col">
          {/* Top Navigation */}
          <header className="fixed top-0 left-0 w-full h-20 bg-slate-950/60 backdrop-blur-md border-b border-white/5 z-50 flex justify-between items-center px-8">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-accent-mint text-3xl filled">recycling</span>
              <span className="font-title text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Döngü<span className="text-accent-mint">Net</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a className="text-on-surface-variant hover:text-accent-mint transition-colors duration-200 text-sm font-medium hidden md:block" href="#capabilities">Yetenekler</a>
              <button onClick={() => handleLogin("user")} className="btn-secondary px-6 py-2.5 rounded-full text-sm font-medium">Giriş Yap</button>
            </div>
          </header>

          <main className="flex-grow pt-20">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-8 py-16">
              <div className="absolute inset-0 bg-hero-glow z-0"></div>

              {/* Ticker */}
              <div className="relative -mt-4 mb-8 lg:absolute lg:top-8 lg:left-0 lg:mt-0 lg:mb-0 w-full overflow-hidden bg-slate-800/40 backdrop-blur-sm border-y border-white/5 py-3 z-20 ticker-container">
                <div className="ticker-content flex gap-8 sm:gap-16 text-accent-mint text-[10px] sm:text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
                  <span className="flex items-center shrink-0"><span className="material-symbols-outlined align-middle mr-2 text-[16px] sm:text-[18px]">recycling</span> 1,240 Ton Atık Geri Kazandırıldı</span>
                  <span className="text-slate-700 shrink-0">•</span>
                  <span className="flex items-center shrink-0"><span className="material-symbols-outlined align-middle mr-2 text-[16px] sm:text-[18px]">co2</span> 450 Ton CO2 Azaltımı Sağlandı</span>
                  <span className="text-slate-700 shrink-0">•</span>
                  <span className="flex items-center shrink-0"><span className="material-symbols-outlined align-middle mr-2 text-[16px] sm:text-[18px]">payments</span> €150,000 SKDM Karbon Vergisi Tasarrufu</span>
                  <span className="text-slate-700 shrink-0">•</span>
                  {/* Duplicate for loop */}
                  <span className="flex items-center shrink-0"><span className="material-symbols-outlined align-middle mr-2 text-[16px] sm:text-[18px]">recycling</span> 1,240 Ton Atık Geri Kazandırıldı</span>
                  <span className="text-slate-700 shrink-0">•</span>
                  <span className="flex items-center shrink-0"><span className="material-symbols-outlined align-middle mr-2 text-[16px] sm:text-[18px]">co2</span> 450 Ton CO2 Azaltımı Sağlandı</span>
                </div>
              </div>

              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 w-full items-center mt-12">
                <div className="lg:col-span-7 flex flex-col items-start gap-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-white/5 text-accent-mint text-xs font-semibold uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse"></span>
                    Yapay Zeka Destekli Kaynak Optimizasyonu
                  </div>
                  <h1 className="font-title text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                    DöngüNet: Akıllı<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-mint to-teal-400">Endüstriyel Simbiyoz</span> Platformu
                  </h1>
                  <p className="text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                    Endüstriyel atık ve yan ürünlerinizi katma değerli kaynaklara dönüştürün. Tesisleri eşleştirin, lojistiği optimize edin ve AB yeşil mutabakat (ESPR/SKDM) uyumluluğunu otomatikleştirin.
                  </p>
                  <button onClick={() => handleLogin("user")} className="btn-primary px-8 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2">
                    Tesis Olarak Başla
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-4 w-full max-w-md mx-auto lg:mx-0 mt-8 lg:mt-0">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 pl-1">Hızlı Erişim Rol Seçimi</p>
                  <div onClick={() => handleLogin("user")} className="glass-panel p-6 rounded-2xl flex items-center justify-between group cursor-pointer transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:border-accent-mint/30 transition-colors">
                        <span className="material-symbols-outlined text-accent-mint text-2xl">factory</span>
                      </div>
                      <div>
                        <h3 className="font-title text-lg font-bold text-white group-hover:text-accent-mint transition-colors">Tesis / Fabrika Paneli</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">Atık listeleme, girdi arama ve eşleştirme</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-accent-mint transform group-hover:translate-x-1.5 transition-all">chevron_right</span>
                  </div>

                  <div onClick={() => handleLogin("osb")} className="glass-panel p-6 rounded-2xl flex items-center justify-between group cursor-pointer transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:border-teal-400/30 transition-colors">
                        <span className="material-symbols-outlined text-teal-400 text-2xl">domain</span>
                      </div>
                      <div>
                        <h3 className="font-title text-lg font-bold text-white group-hover:text-teal-400 transition-colors">OSB Yönetim Paneli</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">Bölgesel döngüsellik ve toplu analiz takibi</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-teal-400 transform group-hover:translate-x-1.5 transition-all">chevron_right</span>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      )}

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
          <aside className={`w-64 bg-slate-900 border-r border-white/5 flex flex-col justify-between fixed h-full z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
            <div>
              {/* Sidebar Logo / Close Button */}
              <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent-mint text-3xl filled">recycling</span>
                  <span className="font-title text-xl font-bold tracking-tight text-white">
                    Döngü<span className="text-accent-mint">Net</span>
                  </span>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)} 
                  className="lg:hidden w-8 h-8 rounded-lg bg-slate-800 border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-white"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              
              {/* Navigation Links */}
              <nav className="p-4 flex flex-col gap-1">
                {userRole === "user" && (
                  <>
                    <button onClick={() => { setCurrentPage("dashboard"); setSidebarOpen(false); }} className={`sidebar-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${currentPage === "dashboard" ? "active" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}>
                      <span className="material-symbols-outlined text-[20px]">dashboard</span>
                      Kontrol Paneli
                    </button>
                    <button onClick={() => { setCurrentPage("materials"); setSidebarOpen(false); }} className={`sidebar-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${currentPage === "materials" ? "active" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}>
                      <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                      Malzeme Yönetimi
                    </button>
                    <button onClick={() => { setCurrentPage("matchmaker"); setSidebarOpen(false); }} className={`sidebar-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${currentPage === "matchmaker" ? "active" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}>
                      <span className="material-symbols-outlined text-[20px]">hub</span>
                      AI Eşleştirme Paneli
                    </button>
                    <button onClick={() => { setCurrentPage("reports"); setSidebarOpen(false); }} className={`sidebar-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${currentPage === "reports" ? "active" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}>
                      <span className="material-symbols-outlined text-[20px]">description</span>
                      Raporlama Merkezi
                    </button>
                    <button onClick={() => { setCurrentPage("chatbot"); setSidebarOpen(false); }} className={`sidebar-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${currentPage === "chatbot" ? "active" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}>
                      <span className="material-symbols-outlined text-[20px]">forum</span>
                      DöngüNet AI Asistanı
                    </button>
                  </>
                )}
                {userRole === "osb" && (
                  <button onClick={() => { setCurrentPage("osb"); setSidebarOpen(false); }} className={`sidebar-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${currentPage === "osb" ? "active" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}>
                    <span className="material-symbols-outlined text-[20px]">domain</span>
                    OSB Yönetici Paneli
                  </button>
                )}
              </nav>
            </div>

            {/* Profile and Logout */}
            <div className="p-4 border-t border-white/5 flex flex-col gap-4">
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
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all">
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Çıkış Yap
              </button>
            </div>
          </aside>

          {/* Right Main Content */}
          <div className="flex-grow pl-0 lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
            {/* Header */}
            <header className="h-20 border-b border-white/5 bg-slate-900/60 backdrop-blur flex justify-between items-center px-4 md:px-8 sticky top-0 z-20">
              <div className="flex items-center gap-2 md:gap-4 min-w-0">
                <button 
                  onClick={() => setSidebarOpen(true)} 
                  className="lg:hidden w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-white mr-1 shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">menu</span>
                </button>
                <h2 className="font-title text-base md:text-xl font-bold text-white truncate">
                  {currentPage === "dashboard" && "Kontrol Paneli"}
                  {currentPage === "materials" && "Malzeme Yönetimi"}
                  {currentPage === "matchmaker" && "AI Eşleştirme Paneli"}
                  {currentPage === "reports" && "Raporlama Merkezi"}
                  {currentPage === "chatbot" && "DöngüNet AI Asistanı"}
                  {currentPage === "osb" && "OSB Yönetici Paneli"}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                  userRole === "osb" 
                    ? "bg-teal-400/10 text-teal-400 border-teal-400/20" 
                    : "bg-accent-mint/10 text-accent-mint border-accent-mint/20"
                }`}>
                  {userRole === "osb" ? "OSB" : "TESİS"}
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <button className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-white transition-colors relative">
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-mint"></span>
                </button>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse"></span>
                  <span className="text-xs font-semibold text-white">Bağlı (Simüle)</span>
                </div>
              </div>
            </header>

            {/* View Panels */}
            <main className="flex-grow p-4 md:p-8 bg-slate-950 relative overflow-y-auto">

              {/* 2.1 DASHBOARD VIEW */}
              {currentPage === "dashboard" && (
                <div className="flex flex-col gap-6">
                  {/* Bento Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Aktif Ürün/Atık</span>
                      <div className="flex items-baseline justify-between mt-4">
                        <span className="text-xl md:text-3xl font-extrabold font-title text-white">{outputs.length}</span>
                        <span className="material-symbols-outlined text-accent-mint text-lg md:text-2xl">arrow_upward</span>
                      </div>
                    </div>
                    <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tanımlı Girdi</span>
                      <div className="flex items-baseline justify-between mt-4">
                        <span className="text-xl md:text-3xl font-extrabold font-title text-white">{inputs.length}</span>
                        <span className="material-symbols-outlined text-slate-500 text-lg md:text-2xl">horizontal_rule</span>
                      </div>
                    </div>
                    <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider">AI Eşleşmesi</span>
                      <div className="flex items-baseline justify-between mt-4">
                        <span className="text-xl md:text-3xl font-extrabold font-title text-accent-mint">2</span>
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-accent-mint/10 text-accent-mint text-[10px] font-bold">AI Aktif</span>
                      </div>
                    </div>
                    <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Önlenen CO2</span>
                      <div className="flex items-baseline justify-between mt-4">
                        <span className="text-xl md:text-3xl font-extrabold font-title text-teal-400">900 kg</span>
                        <span className="material-symbols-outlined text-teal-400 text-lg md:text-2xl">eco</span>
                      </div>
                    </div>
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-title font-bold text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-accent-mint">sensors</span>
                          IoT Canlı Atık Akış Takibi (Aylık Birikim)
                        </h3>
                        <span className="text-[10px] font-semibold text-on-surface-variant">GÜNCEL SENSÖR VERİSİ</span>
                      </div>
                      <div className="relative w-full h-64 bg-slate-900/30 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                        <canvas ref={sensorCanvasRef} className="w-full h-full px-2 py-4"></canvas>
                      </div>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-title font-bold text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-teal-400">online_prediction</span>
                          Prophet AI Gelecek Dönem Atık Birikim Öngörüsü
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold">ÖNGÖRÜ</span>
                      </div>
                      <div className="relative w-full h-64 bg-slate-900/30 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                        <canvas ref={forecastCanvasRef} className="w-full h-full px-2 py-4"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2.2 MATERIALS MANAGEMENT VIEW */}
              {currentPage === "materials" && (
                <div className="flex flex-col gap-6">
                  {/* Tabs */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
                    <div className="flex gap-2 p-1 rounded-xl bg-slate-900 border border-white/5 self-start">
                      <button onClick={() => setCurrentMaterialTab("outputs")} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${currentMaterialTab === "outputs" ? "text-white bg-slate-700" : "text-on-surface-variant hover:text-white"}`}>
                        Üretilen Çıktılar / Atıklar
                      </button>
                      <button onClick={() => setCurrentMaterialTab("inputs")} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${currentMaterialTab === "inputs" ? "text-white bg-slate-700" : "text-on-surface-variant hover:text-white"}`}>
                        Girdi İhtiyaçları
                      </button>
                    </div>
                    <div>
                      {currentMaterialTab === "outputs" ? (
                        <button onClick={() => setShowOutputModal(true)} className="btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">add</span>
                          Yeni Çıktı Kaydet
                        </button>
                      ) : (
                        <button onClick={() => setShowInputModal(true)} className="btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">add</span>
                          Girdi İhtiyacı Tanımla
                        </button>
                      )}
                    </div>
                  </div>

                  {/* List Container */}
                  <div className="glass-panel rounded-2xl overflow-hidden">
                    {currentMaterialTab === "outputs" ? (
                      <div>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-900 border-b border-white/5 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                                <th className="p-5">Malzeme Adı</th>
                                <th className="p-5">Sınıf</th>
                                <th className="p-5">Kimyasal Bileşim</th>
                                <th className="p-5">Miktar (kg)</th>
                                <th className="p-5">Stok (kg)</th>
                                <th className="p-5">Kayıt Tarihi</th>
                                <th className="p-5 text-right">İşlemler</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm text-white">
                              {outputs.map(out => (
                                <tr key={out.id}>
                                  <td className="p-5 font-semibold text-white">{out.name}</td>
                                  <td className="p-5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-teal-400 border border-teal-500/10">{out.class}</span>
                                  </td>
                                  <td className="p-5 text-on-surface-variant">{out.composition}</td>
                                  <td className="p-5 font-mono text-white">{out.quantity.toLocaleString()}</td>
                                  <td className="p-5 font-mono text-white">{out.stock.toLocaleString()}</td>
                                  <td className="p-5 text-on-surface-variant">{out.date}</td>
                                  <td className="p-5 text-right">
                                    <button onClick={() => { setSelectedDppOutput(out); setShowDppModal(true); }} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-accent-mint/10 border border-accent-mint/20 text-accent-mint hover:bg-accent-mint/20 transition-all flex items-center gap-1 ml-auto">
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
                        <div className="md:hidden flex flex-col divide-y divide-white/5">
                          {outputs.map(out => (
                            <div key={out.id} className="p-4 flex flex-col gap-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-title font-bold text-white text-sm">{out.name}</h4>
                                  <span className="text-[10px] text-on-surface-variant block mt-1">Kayıt: {out.date}</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-teal-400 border border-teal-500/10 shrink-0">{out.class}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs border-y border-white/[0.03] py-2">
                                <div>
                                  <span className="text-on-surface-variant text-[9px] block">Miktar</span>
                                  <span className="text-white font-mono font-medium">{out.quantity.toLocaleString()} kg</span>
                                </div>
                                <div>
                                  <span className="text-on-surface-variant text-[9px] block">Stok</span>
                                  <span className="text-white font-mono font-medium">{out.stock.toLocaleString()} kg</span>
                                </div>
                                <div>
                                  <span className="text-on-surface-variant text-[9px] block">Bileşim</span>
                                  <span className="text-white truncate block max-w-[80px]" title={out.composition}>{out.composition}</span>
                                </div>
                              </div>
                              <button onClick={() => { setSelectedDppOutput(out); setShowDppModal(true); }} className="w-full py-2.5 rounded-xl text-xs font-semibold bg-accent-mint/10 border border-accent-mint/20 text-accent-mint hover:bg-accent-mint/20 transition-all flex items-center justify-center gap-1.5">
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
                              <tr className="bg-slate-900 border-b border-white/5 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                                <th className="p-5">Girdi / Hammadde</th>
                                <th className="p-5">Sınıf</th>
                                <th className="p-5">Teknik Özellik / Limit</th>
                                <th className="p-5">Miktar (kg)</th>
                                <th className="p-5">Frekans</th>
                                <th className="p-5">Kayıt Tarihi</th>
                                <th className="p-5 text-right">İşlemler</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm text-white">
                              {inputs.map(input => (
                                <tr key={input.id}>
                                  <td className="p-5 font-semibold text-white">{input.name}</td>
                                  <td className="p-5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-blue-400 border border-blue-500/10">{input.class}</span>
                                  </td>
                                  <td className="p-5 text-on-surface-variant">{input.specs}</td>
                                  <td className="p-5 font-mono text-white">{input.quantity.toLocaleString()}</td>
                                  <td className="p-5 text-on-surface-variant">{input.frequency}</td>
                                  <td className="p-5 text-on-surface-variant">{input.date}</td>
                                  <td className="p-5 text-right text-on-surface-variant text-xs font-medium">Eşleştirme Bekliyor</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden flex flex-col divide-y divide-white/5">
                          {inputs.map(input => (
                            <div key={input.id} className="p-4 flex flex-col gap-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-title font-bold text-white text-sm">{input.name}</h4>
                                  <span className="text-[10px] text-on-surface-variant block mt-1">Kayıt: {input.date}</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-blue-400 border border-blue-500/10 shrink-0">{input.class}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs border-y border-white/[0.03] py-2">
                                <div>
                                  <span className="text-on-surface-variant text-[9px] block">İhtiyaç</span>
                                  <span className="text-white font-mono font-medium">{input.quantity.toLocaleString()} kg</span>
                                </div>
                                <div>
                                  <span className="text-on-surface-variant text-[9px] block">Frekans</span>
                                  <span className="text-white font-medium">{input.frequency}</span>
                                </div>
                                <div className="col-span-1">
                                  <span className="text-on-surface-variant text-[9px] block">Özellik</span>
                                  <span className="text-white truncate block max-w-[80px]" title={input.specs}>{input.specs}</span>
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
              )}

              {/* 2.3 AI MATCHMAKER VIEW */}
              {currentPage === "matchmaker" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Candidates */}
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="glass-panel p-5 rounded-2xl">
                      <h3 className="font-title font-bold text-white text-base">Eşleştirme Adayları</h3>
                      <p className="text-xs text-on-surface-variant mt-1">Seçili Alüminyum Alaşımlı Toz için pgvector ile eşleşen tesisler listelenmektedir (Kosinüs Benzerliği {'>='}  0.65)</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {matches.map(m => (
                        <div 
                          key={m.id}
                          onClick={() => {
                            setSelectedMatchId(m.id);
                            if (typeof window !== "undefined" && window.innerWidth < 1024) {
                              setTimeout(() => {
                                document.getElementById("matchmaker-detail")?.scrollIntoView({ behavior: "smooth" });
                              }, 100);
                            }
                          }}
                          className={`glass-panel p-5 rounded-2xl flex flex-col gap-3 cursor-pointer transition-all duration-300 ${
                            selectedMatchId === m.id ? "border-accent-mint/60 bg-accent-mint/[0.04]" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-title font-bold text-white text-sm">{m.name}</h4>
                              <span className="text-[10px] text-on-surface-variant block mt-1">Lojistik Mesafe: {m.distance} km</span>
                            </div>
                            <span className="text-base font-extrabold font-title text-accent-mint">{m.score}% Uyum</span>
                          </div>
                          <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[10px]">
                            <span className="text-teal-400 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">eco</span>
                              {m.co2} kg CO2 Tasarrufu
                            </span>
                            <span className={`px-2 py-0.5 rounded border font-bold tracking-wider uppercase text-[8px] ${
                              m.status === "accepted" 
                                ? "bg-accent-mint/10 text-accent-mint border-accent-mint/20" 
                                : m.status === "rejected" 
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}>
                              {m.status === "accepted" ? "Kabul Edildi" : m.status === "rejected" ? "Reddedildi" : "Onay Bekliyor"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Selected Detail */}
                  <div id="matchmaker-detail" className="lg:col-span-7 flex flex-col gap-6 scroll-mt-24">
                    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
                      <div className="flex justify-between items-start border-b border-white/5 pb-4">
                        <div>
                          <h3 className="font-title font-bold text-lg text-white">{selectedMatch.name}</h3>
                          <p className="text-xs text-on-surface-variant mt-0.5">Eşleşen Girdi İhtiyacı: Alüminyum Tozu</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-black font-title text-accent-mint">{selectedMatch.score} / 100</span>
                          <span className="text-[10px] font-bold text-on-surface-variant">DÖNGÜNET MATCH SCORE</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-3">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">5 Faktörlü Uyum Kırılımı</h4>
                          <div className="relative w-full h-48 bg-slate-900/30 rounded-xl overflow-hidden border border-white/5">
                            <canvas ref={radarCanvasRef} className="w-full h-full p-2"></canvas>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Lojistik Rota Simülasyonu</h4>
                          <div className="relative w-full h-48 bg-slate-900/30 rounded-xl overflow-hidden border border-white/5">
                            {renderRouteSvgMap(selectedMatch)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Lojistik Mesafe</span>
                          <span className="text-lg font-bold text-white mt-1 block">{selectedMatch.distance} km</span>
                        </div>
                        <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/10">
                          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">CO2 Azaltımı (Net)</span>
                          <span className="text-lg font-bold text-teal-400 mt-1 block">{selectedMatch.co2} kg CO2</span>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                          <span className="text-[10px] text-accent-mint font-bold uppercase tracking-wider block">CBAM Karbon Tasarrufu</span>
                          <span className="text-lg font-bold text-accent-mint mt-1 block">€{selectedMatch.savings.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-4 border-t border-white/5 pt-6">
                        <button onClick={handleAcceptMatch} className="flex-grow btn-primary py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined">handshake</span>
                          Eşleşmeyi Kabul Et ve Onayla
                        </button>
                        <button onClick={() => setRejectPanelOpen(true)} className="px-6 py-3.5 rounded-xl font-bold text-sm text-rose-400 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 transition-colors">
                          Reddet
                        </button>
                      </div>

                      {/* Inline Rejection Panel */}
                      {rejectPanelOpen && (
                        <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
                          <label className="text-xs font-bold text-white uppercase tracking-wider">Red Gerekçesi Belirtiniz</label>
                          <textarea 
                            value={rejectReasonText}
                            onChange={(e) => setRejectReasonText(e.target.value)}
                            rows={2} 
                            className="w-full bg-slate-900 border border-white/10 rounded-xl text-sm p-3 text-white focus:border-rose-500 focus:ring-rose-500" 
                            placeholder="Örn: Nakliye fiyatlandırması çok yüksek veya malzeme kalitesi spektlerimizi karşılamıyor..."
                          />
                          <div className="flex gap-3 justify-end">
                            <button onClick={() => setRejectPanelOpen(false)} className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-white">İptal</button>
                            <button onClick={handleConfirmRejectMatch} className="px-4 py-2 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20">Reddetmeyi Onayla</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2.4 REPORTS HUB VIEW */}
              {currentPage === "reports" && (
                <div className="flex flex-col gap-6">
                  <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="font-title font-bold text-white text-base">Raporlama ve Uyumluluk</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Eşleşmeleriniz sonucu sağlanan emisyon azaltımlarını içeren yasal belgeler ve AB uyumluluk dosyaları.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-6 relative overflow-hidden">
                      <div className="flex flex-col gap-3">
                        <span className="material-symbols-outlined text-teal-400 text-3xl">co2</span>
                        <h4 className="font-title font-bold text-lg text-white">Çevresel Etki Raporu</h4>
                        <p className="text-xs text-on-surface-variant">ISO 14040 Life Cycle Assessment (LCA) uyumlu, net karbon azaltımlarını beyan eden detaylı emisyon raporu.</p>
                      </div>
                      <button onClick={() => handlePdfDownload("Cevresel Etki Raporu")} className="btn-secondary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        PDF İndir
                      </button>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-6 relative overflow-hidden">
                      <div className="flex flex-col gap-3">
                        <span className="material-symbols-outlined text-orange-400 text-3xl">gavel</span>
                        <h4 className="font-title font-bold text-lg text-white">SKDM (CBAM) Uyum Beyanı</h4>
                        <p className="text-xs text-on-surface-variant">Sınırda Karbon Düzenleme Mekanizması kurallarına uygun, ithalat/ihracat vergi muafiyeti bildirim belgesi.</p>
                      </div>
                      <button onClick={() => handlePdfDownload("SKDM Uyum Beyani")} className="btn-secondary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        PDF İndir
                      </button>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-6 relative overflow-hidden">
                      <div className="flex flex-col gap-3">
                        <span className="material-symbols-outlined text-accent-mint text-3xl">qr_code</span>
                        <h4 className="font-title font-bold text-lg text-white">Dijital Pasaport Raporu</h4>
                        <p className="text-xs text-on-surface-variant">AB ESPR yönetmeliklerine uygun, malzemenin kimyasal, fiziksel ve izlenebilirlik pasaport özeti.</p>
                      </div>
                      <button onClick={() => handlePdfDownload("Dijital Pasaport Raporu")} className="btn-secondary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        PDF İndir
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2.5 AI ASSISTANT VIEW */}
              {currentPage === "chatbot" && (
                <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[450px] glass-panel rounded-2xl overflow-hidden">
                  <div className="bg-slate-900/60 p-4 border-b border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-mint/10 flex items-center justify-center border border-accent-mint/20">
                      <span className="material-symbols-outlined text-accent-mint">smart_toy</span>
                    </div>
                    <div>
                      <h3 className="font-title font-bold text-white text-sm">DöngüNet AI Sürdürülebilirlik Asistanı</h3>
                      <p className="text-[10px] text-teal-400 font-medium">Claude API ile Mevzuat Danışmanlığı (Simüle)</p>
                    </div>
                  </div>

                  <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex gap-3 max-w-[80%] ${msg.role === "assistant" ? "self-start" : "self-end flex-row-reverse"}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${msg.role === "assistant" ? "bg-accent-mint/10 text-accent-mint border-accent-mint/20" : "bg-slate-700 text-white border-white/5"}`}>
                          <span className="material-symbols-outlined text-[16px]">{msg.role === "assistant" ? "smart_toy" : "person"}</span>
                        </div>
                        <div 
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${msg.role === "assistant" ? "bg-surface/60 text-white rounded-tl-none border border-white/5" : "bg-accent-mint text-white rounded-tr-none"}`}
                          dangerouslySetInnerHTML={{ __html: msg.content }}
                        />
                      </div>
                    ))}

                    {chatIsTyping && (
                      <div className="flex gap-3 max-w-[80%] self-start">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-accent-mint/10 text-accent-mint border border-accent-mint/20">
                          <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                        </div>
                        <div className="p-3.5 rounded-2xl text-xs bg-surface/60 text-on-surface-variant rounded-tl-none border border-white/5 flex items-center gap-1.5 font-medium">
                          Asistan cevap hazırlıyor
                          <span className="inline-flex gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-bounce" style={{ animationDelay: "0s" }}></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={chatMessagesEndRef} />
                  </div>

                  <div className="p-4 border-t border-white/5 bg-slate-900/40 flex gap-3">
                    <input 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleChatSend(); }}
                      type="text" 
                      className="flex-grow bg-slate-900 border border-white/10 rounded-xl text-sm px-4 py-3 text-white focus:outline-none focus:border-accent-mint focus:ring-1 focus:ring-accent-mint" 
                      placeholder="SKDM mevzuatı, atık kodları veya simbiyoz kazançları hakkında soru sorun..."
                    />
                    <button onClick={handleChatSend} className="btn-primary w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2.6 OSB MANAGEMENT PANEL */}
              {currentPage === "osb" && (
                <div className="flex flex-col gap-6">
                  {/* OSB Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">OSB Simbiyoz Oranı</span>
                      <span className="text-xl md:text-3xl font-extrabold font-title text-white mt-2 block">68%</span>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-accent-mint h-full rounded-full" style={{ width: "68%" }}></div>
                      </div>
                    </div>
                    <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">Aktif Tesis</span>
                      <span className="text-xl md:text-3xl font-extrabold font-title text-white mt-2 block">14 Tesis</span>
                    </div>
                    <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">Toplam CO2</span>
                      <span className="text-xl md:text-3xl font-extrabold font-title text-teal-400 mt-2 block">2.1 Ton</span>
                    </div>
                    <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
                      <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">Karbon Tasarrufu</span>
                      <span className="text-xl md:text-3xl font-extrabold font-title text-accent-mint mt-2 block">€4,800</span>
                    </div>
                  </div>

                  {/* OSB Map & Approvals */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* OSB regional SVG Map */}
                    <div className="lg:col-span-7 glass-panel p-6 rounded-2xl flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-title font-bold text-white text-base">Bölgesel Tesis ve Akış Dağılımı</h3>
                        <button onClick={() => handlePdfDownload("Osb Bolgesel Analiz Raporu")} className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">analytics</span>
                          Bölgesel Rapor Üret
                        </button>
                      </div>
                      <div className="w-full h-80 bg-slate-900/30 rounded-xl border border-white/5 overflow-hidden">
                        <svg viewBox="0 0 600 320" className="w-full h-full text-slate-800" fill="currentColor">
                          <defs>
                            <pattern id="osb-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth={1} />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#osb-grid)" />
                          <polygon points="50,40 550,20 580,240 120,290" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth={2} strokeDasharray="8 4" />
                          <text x="70" y="55" fill="rgba(16, 185, 129, 0.4)" fontSize="10" fontWeight="bold">GEBZE ORGANIZE SANAYI BOLGESI SINIRI</text>
                          <path d="M 120 120 Q 250 80 380 140" fill="none" stroke="#10b981" strokeWidth={2} strokeOpacity={0.6} />
                          <path d="M 380 140 Q 300 220 220 200" fill="none" stroke="#0d9488" strokeWidth={1.5} strokeOpacity={0.4} />
                          <circle r="4" fill="#34d399">
                            <animateMotion dur="6s" repeatCount="indefinite" path="M 120 120 Q 250 80 380 140" />
                          </circle>
                          <circle cx={120} cy={120} r={8} fill="#10b981" />
                          <text x="135" y="123" fill="#94a3b8" fontSize="9" fontWeight="bold">Gebze Metal A.Ş.</text>
                          <circle cx={380} cy={140} r={8} fill="#059669" />
                          <text x="395" y="143" fill="#94a3b8" fontSize="9" fontWeight="bold">Dilovası Doküm</text>
                          <circle cx={220} cy={200} r={8} fill="#0d9488" />
                          <text x="235" y="203" fill="#94a3b8" fontSize="9" fontWeight="bold">Kocaeli Cam</text>
                          <circle cx={450} cy={220} r={6} fill="#334155" />
                          <text x={465} y={223} fill={osbVerificationList[1].status === "approved" ? "#94a3b8" : "#64748b"} fontSize="9" fontWeight={osbVerificationList[1].status === "approved" ? "bold" : "normal"}>Marmara Kağıt</text>
                          {osbVerificationList[1].status === "approved" && <circle cx={450} cy={220} r={6} fill="#10b981" />}
                        </svg>
                      </div>
                    </div>

                    {/* Verification list */}
                    <div className="lg:col-span-5 glass-panel p-6 rounded-2xl flex flex-col gap-4">
                      <h3 className="font-title font-bold text-white text-base">Tesis Doğrulama Talepleri</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[10px] font-bold text-on-surface-variant uppercase border-b border-white/5 pb-2">
                              <th className="pb-2">Tesis Adı</th>
                              <th className="pb-2">Sektör</th>
                              <th className="pb-2 text-right">Durum / Aksiyon</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-xs text-white">
                            {osbVerificationList.map(req => (
                              <tr key={req.id}>
                                <td className="py-3 font-semibold text-white">{req.name}</td>
                                <td className="py-3 text-on-surface-variant">{req.sector}</td>
                                <td className="py-3 text-right">
                                  {req.status === "pending" ? (
                                    <button onClick={() => handleVerifyOsbFacility(req.id)} className="px-3 py-1 rounded bg-accent-mint/10 border border-accent-mint/20 text-accent-mint hover:bg-accent-mint/20 text-[10px] font-bold">
                                      Onayla
                                    </button>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-slate-800 border border-white/5 rounded text-on-surface-variant text-[9px] font-semibold">Doğrulandı</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>
      )}

      {/* ================= MODAL WINDOWS ================= */}

      {/* MODAL 1: ADD OUTPUT */}
      {showOutputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg mx-4 md:mx-0 p-6 md:p-8 rounded-2xl flex flex-col gap-6 shadow-2xl relative">
            <div className="flex justify-between items-center">
              <h3 className="font-title font-bold text-lg text-white">Yeni Çıktı / Atık Girişi</h3>
              <button onClick={() => setShowOutputModal(false)} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddOutputSubmit} className="flex flex-col gap-4">
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
              <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm mt-4">Atık Kaydet ve Vektörleştir</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD INPUT */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg mx-4 md:mx-0 p-6 md:p-8 rounded-2xl flex flex-col gap-6 shadow-2xl relative">
            <div className="flex justify-between items-center">
              <h3 className="font-title font-bold text-lg text-white">Yeni Girdi / Hammadde İhtiyacı</h3>
              <button onClick={() => setShowInputModal(false)} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddInputSubmit} className="flex flex-col gap-4">
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
              <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm mt-4">Girdi Tanımla</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DPP PASSPORT VIEW */}
      {showDppModal && selectedDppOutput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl mx-4 md:mx-0 p-6 md:p-8 rounded-2xl flex flex-col gap-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-mint">qr_code_2</span>
                <h3 className="font-title font-bold text-lg text-white">Dijital Ürün Pasaportu (DPP)</h3>
              </div>
              <button onClick={() => setShowDppModal(false)} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 flex flex-col gap-4">
                <div>
                  <h4 className="font-title text-base font-bold text-white">{selectedDppOutput.name}</h4>
                  <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded font-bold uppercase border border-teal-500/20">AB ESPR 2026 Uyumlu</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-white/5">
                    <span className="text-[10px] text-on-surface-variant uppercase block">Pasaport ID</span>
                    <span className="font-mono text-white mt-1 block">{selectedDppOutput.dppId}</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-white/5">
                    <span className="text-[10px] text-on-surface-variant uppercase block">Bileşim</span>
                    <span className="text-white mt-1 block">{selectedDppOutput.composition}</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-white/5">
                    <span className="text-[10px] text-on-surface-variant uppercase block">Menşe</span>
                    <span className="text-white mt-1 block">Dilovası OSB, Türkiye</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-white/5">
                    <span className="text-[10px] text-on-surface-variant uppercase block">Karbon Yoğunluğu</span>
                    <span className="text-teal-400 mt-1 block">0.32 kg CO2 / kg</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-white rounded-2xl aspect-square w-full max-w-[180px] mx-auto">
                <div className="w-full h-full text-slate-950">
                  {drawMockSvgQrCode()}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 border-t border-white/5 pt-6">
              <button onClick={() => handlePdfDownload("Dijital Urun Pasaportu")} className="btn-primary flex-grow py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                Pasaport Raporunu İndir (PDF)
              </button>
              <button onClick={() => setShowDppModal(false)} className="btn-secondary px-6 py-3 rounded-xl text-xs font-bold">Kapat</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: MATCH CONFIRMED / SUCCESS */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg mx-4 md:mx-0 p-6 md:p-8 rounded-2xl flex flex-col items-center text-center gap-6 shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-accent-mint/10 border-2 border-accent-mint flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-accent-mint text-4xl">handshake</span>
            </div>
            <div>
              <h3 className="font-title font-bold text-xl text-white">Eşleştirme Başarıyla Onaylandı!</h3>
              <p className="text-sm text-on-surface-variant mt-2">Endüstriyel döngüsel simbiyoz akışı taraflarca kabul edildi. İletişim bilgileri açılmıştır.</p>
            </div>
            <div className="w-full bg-slate-900/60 p-5 rounded-2xl text-left flex flex-col gap-3 text-xs border border-white/5">
              <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-teal-400 text-sm">contact_phone</span>
                Karşı Tesis İletişim Detayları
              </h4>
              <p className="text-white"><strong className="text-on-surface-variant">Firma Adı:</strong> <span>{selectedMatch.name}</span></p>
              <p className="text-white"><strong className="text-on-surface-variant">Temsilci:</strong> Ahmet Yılmaz (Fabrika Müdürü)</p>
              <p className="text-white"><strong className="text-on-surface-variant">Telefon:</strong> +90 (262) 555 1234</p>
              <p className="text-white"><strong className="text-on-surface-variant">E-Posta:</strong> a.yilmaz@dilovasialuminyum.com.tr</p>
              <div className="mt-2 p-3 bg-accent-mint/5 border border-accent-mint/10 rounded-xl text-[11px] text-accent-mint">
                * QR kodlu sevkiyat takip barkodu ve teslim belgesi otomatik olarak e-posta adresinize gönderilmiştir.
              </div>
            </div>
            <button onClick={() => setShowSuccessModal(false)} className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm">Anladım, Kapat</button>
          </div>
        </div>
      )}

    </div>
  );
}
