"use client";

import React, { useEffect, useRef } from "react";
import styles from "./DashboardView.module.css";
import { OutputItem } from "../../types";

interface DashboardViewProps {
  outputsCount: number;
  inputsCount: number;
  outputs: OutputItem[];
}

export default function DashboardView({ outputsCount, inputsCount, outputs }: DashboardViewProps) {
  const sensorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const forecastCanvasRef = useRef<HTMLCanvasElement | null>(null);

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
      {/* Bento Stats */}
      <div className={styles.statsGrid}>
        <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Aktif Ürün/Atık
          </span>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-xl md:text-3xl font-extrabold font-title text-white">{outputsCount}</span>
            <span className="material-symbols-outlined text-accent-mint text-lg md:text-2xl">arrow_upward</span>
          </div>
        </div>
        <div className="glass-panel p-4 md:p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Tanımlı Girdi
          </span>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-xl md:text-3xl font-extrabold font-title text-white">{inputsCount}</span>
            <span className="material-symbols-outlined text-slate-500 text-lg md:text-2xl">horizontal_rule</span>
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
            <span className="text-xl md:text-3xl font-extrabold font-title text-teal-400">900 kg</span>
            <span className="material-symbols-outlined text-teal-400 text-lg md:text-2xl">eco</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-title font-bold text-white flex items-center gap-2">
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
            <h3 className="font-title font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-400">online_prediction</span>
              Prophet AI Gelecek Dönem Atık Birikim Öngörüsü
            </h3>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold">ÖNGÖRÜ</span>
          </div>
          <div className={styles.canvasWrapper}>
            <canvas ref={forecastCanvasRef} className={styles.canvas}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
