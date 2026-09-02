"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./DashboardView.module.css";
import { OutputItem } from "../../types";
import { FacilityMe, FacilityDocumentRow } from "../../lib/api";

interface DashboardViewProps {
  outputsCount: number;
  inputsCount: number;
  outputs: OutputItem[];
  facility: FacilityMe | null;
  facilityDocuments: FacilityDocumentRow[];
  onUploadDocument: (file: File, documentType: "tax_certificate" | "operating_permit") => void;
}

const DOCUMENT_TYPE_LABEL: Record<string, string> = {
  tax_certificate: "Vergi Levhası",
  operating_permit: "Faaliyet İzni",
};

export default function DashboardView({
  outputsCount,
  inputsCount,
  outputs,
  facility,
  facilityDocuments,
  onUploadDocument,
}: DashboardViewProps) {
  const sensorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const forecastCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [uploadType, setUploadType] = useState<"tax_certificate" | "operating_permit">("tax_certificate");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- DRAWING IoT SENSOR LINE CHART ---
  const drawDashboardSensorChart = () => {
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
    ctx.strokeStyle = "rgba(29,36,32,0.06)";
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
    gradient.addColorStop(0, "rgba(30, 95, 70, 0.18)");
    gradient.addColorStop(1, "rgba(30, 95, 70, 0)");

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
    ctx.strokeStyle = "#1e5f46";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Dots and labels
    ctx.fillStyle = "#fffdf8";
    ctx.font = "9px Inter, sans-serif";
    ctx.textAlign = "center";
    points.forEach((pt, i) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#1e5f46";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#666f63";
      ctx.fillText(data[i] + "kg", pt.x, pt.y - 10);
    });
  };

  // --- DRAWING FORECAST CHART ---
  const drawDashboardForecastChart = () => {
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
    ctx.strokeStyle = "rgba(29,36,32,0.06)";
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
    ctx.strokeStyle = "#0f7a6c";

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
    ctx.strokeStyle = "#7e22ce";
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
    ctx.fillStyle = "rgba(126, 34, 206, 0.08)";
    ctx.moveTo(fcPoints[0].x, fcPoints[0].y);
    ctx.lineTo(fcPoints[1].x, fcPoints[1].y - 15);
    ctx.lineTo(fcPoints[2].x, fcPoints[2].y - 30);
    ctx.lineTo(fcPoints[2].x, fcPoints[2].y + 30);
    ctx.lineTo(fcPoints[1].x, fcPoints[1].y + 15);
    ctx.closePath();
    ctx.fill();

    // Labels
    ctx.fillStyle = "#666f63";
    ctx.font = "9px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Geçmiş", padding + 10, h - 10);
    ctx.textAlign = "right";
    ctx.fillStyle = "#7e22ce";
    ctx.fillText("AI Tahmini", w - padding - 10, h - 10);
  };

  useEffect(() => {
    drawDashboardSensorChart();
    drawDashboardForecastChart();

    // Add window resize listener to redraw charts for responsiveness
    const handleResize = () => {
      drawDashboardSensorChart();
      drawDashboardForecastChart();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [outputs]);

  return (
    <div className={styles.container}>
      {/* Tesis doğrulama durumu (docs/04 Facilities) -- verified=false ise materials POST
          403 FACILITY_NOT_VERIFIED alır, bu yüzden burada belge yükleme akışı sağlanıyor. */}
      {facility && !facility.verified && (
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-700">pending_actions</span>
            <h3 className="font-title font-bold text-on-surface text-sm">Tesisiniz henüz doğrulanmadı</h3>
          </div>
          <p className="text-xs text-on-surface-variant">
            Doğrulanana kadar çıktı/girdi kaydı oluşturamazsınız. Vergi levhası veya faaliyet izni belgesi yükleyin,
            admin incelemesi sonrası tesisiniz aktifleşir.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value as typeof uploadType)}
              className="bg-surface border border-border-color rounded-xl px-3 py-2 text-xs text-on-surface"
            >
              <option value="tax_certificate">Vergi Levhası</option>
              <option value="operating_permit">Faaliyet İzni</option>
            </select>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadDocument(file, uploadType);
                e.target.value = "";
              }}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              Belge Yükle (PDF/JPG, max 10 MB)
            </button>
          </div>
          {facilityDocuments.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-1">
              {facilityDocuments.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-[11px] bg-surface-light/60 rounded-lg px-3 py-2">
                  <span className="text-on-surface-variant">{DOCUMENT_TYPE_LABEL[d.documentType] ?? d.documentType}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold uppercase ${
                      d.status === "APPROVED"
                        ? "text-accent-mint"
                        : d.status === "REJECTED"
                        ? "text-rose-600"
                        : "text-amber-700"
                    }`}
                  >
                    {d.status === "APPROVED" ? "Onaylandı" : d.status === "REJECTED" ? "Reddedildi" : "İnceleniyor"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bento Stats */}
      <div className={styles.statsGrid}>
        <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Aktif Ürün/Atık
          </span>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-xl md:text-3xl font-extrabold font-title text-on-surface">{outputsCount}</span>
            <span className="material-symbols-outlined text-accent-mint text-lg md:text-2xl">arrow_upward</span>
          </div>
        </div>
        <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Tanımlı Girdi
          </span>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-xl md:text-3xl font-extrabold font-title text-on-surface">{inputsCount}</span>
            <span className="material-symbols-outlined text-on-surface-variant text-lg md:text-2xl">horizontal_rule</span>
          </div>
        </div>
        <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            AI Eşleşmesi
          </span>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-xl md:text-3xl font-extrabold font-title text-accent-mint">2</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-accent-mint/10 text-accent-mint text-[10px] font-bold">
              AI Aktif
            </span>
          </div>
        </div>
        <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Önlenen CO2
          </span>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-xl md:text-3xl font-extrabold font-title text-teal-700">900 kg</span>
            <span className="material-symbols-outlined text-teal-700 text-lg md:text-2xl">eco</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-title font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-mint">sensors</span>
              IoT Canlı Atık Akış Takibi (Aylık Birikim)
            </h3>
            <span className="text-[10px] font-semibold text-on-surface-variant">GÜNCEL SENSÖR VERİSİ</span>
          </div>
          <div className={styles.canvasWrapper}>
            <canvas ref={sensorCanvasRef} className={styles.canvas}></canvas>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-title font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-700">online_prediction</span>
              Prophet AI Gelecek Dönem Atık Birikim Öngörüsü
            </h3>
            <span className="px-2 py-0.5 rounded bg-purple-600/10 text-purple-700 text-[10px] font-bold">ÖNGÖRÜ</span>
          </div>
          <div className={styles.canvasWrapper}>
            <canvas ref={forecastCanvasRef} className={styles.canvas}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
