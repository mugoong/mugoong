'use client';

import { useEffect, useRef } from 'react';

/* ─── Line Chart ─────────────────────────────── */
interface LineChartProps {
  type: 'line';
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

/* ─── Bar Chart ──────────────────────────────── */
interface BarChartProps {
  type: 'bar';
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

/* ─── Donut Chart ────────────────────────────── */
interface DonutChartProps {
  type: 'donut';
  data: { label: string; value: number; color: string }[];
  height?: number;
}

type ChartProps = LineChartProps | BarChartProps | DonutChartProps;

export default function Chart(props: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    if (props.type === 'line') {
      drawLineChart(ctx, w, h, props.data, props.color || '#6366f1');
    } else if (props.type === 'bar') {
      drawBarChart(ctx, w, h, props.data, props.color || '#6366f1');
    } else if (props.type === 'donut') {
      drawDonutChart(ctx, w, h, props.data);
    }
  }, [props]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: props.height || 200 }}
    />
  );
}

function drawLineChart(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  data: { label: string; value: number }[],
  color: string
) {
  if (data.length === 0) return;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const maxVal = Math.max(...data.map((d) => d.value)) * 1.1 || 1;
  const points = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1 || 1)) * chartW,
    y: pad.top + chartH - (d.value / maxVal) * chartH,
  }));

  // Grid lines
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
  }

  // Fill gradient
  const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
  grad.addColorStop(0, color + '20');
  grad.addColorStop(1, color + '00');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(points[0].x, h - pad.bottom);
  points.forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, h - pad.bottom);
  ctx.closePath();
  ctx.fill();

  // Line
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.stroke();

  // Dots
  points.forEach((p) => {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Labels
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';
  data.forEach((d, i) => {
    ctx.fillText(d.label, points[i].x, h - pad.bottom + 18);
  });

  // Y-axis labels
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const val = ((maxVal / 4) * (4 - i)).toFixed(0);
    const y = pad.top + (chartH / 4) * i;
    ctx.fillText(val, pad.left - 8, y + 4);
  }
}

function drawBarChart(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  data: { label: string; value: number }[],
  color: string
) {
  if (data.length === 0) return;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.1 || 1;
  const barWidth = Math.min(40, (chartW / data.length) * 0.6);
  const gap = chartW / data.length;

  // Grid
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
  }

  // Bars
  data.forEach((d, i) => {
    const x = pad.left + gap * i + (gap - barWidth) / 2;
    const barH = (d.value / maxVal) * chartH;
    const y = pad.top + chartH - barH;

    const grad = ctx.createLinearGradient(x, y, x, pad.top + chartH);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + '60');
    ctx.fillStyle = grad;

    // Rounded top
    const r = Math.min(6, barWidth / 2);
    ctx.beginPath();
    ctx.moveTo(x, pad.top + chartH);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.lineTo(x + barWidth - r, y);
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
    ctx.lineTo(x + barWidth, pad.top + chartH);
    ctx.closePath();
    ctx.fill();

    // Label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.label, x + barWidth / 2, h - pad.bottom + 18);
  });

  // Y-axis
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const val = ((maxVal / 4) * (4 - i)).toFixed(0);
    const y = pad.top + (chartH / 4) * i;
    ctx.fillText(val, pad.left - 8, y + 4);
  }
}

function drawDonutChart(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  data: { label: string; value: number; color: string }[]
) {
  if (data.length === 0) return;
  const cx = w / 2 - 60;
  const cy = h / 2;
  const radius = Math.min(cx, cy) - 20;
  const lineWidth = radius * 0.35;
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  let startAngle = -Math.PI / 2;
  data.forEach((d) => {
    const sliceAngle = (d.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.arc(cx, cy, radius - lineWidth, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = d.color;
    ctx.fill();
    startAngle += sliceAngle;
  });

  // Center text
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(total.toLocaleString(), cx, cy - 6);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Total', cx, cy + 14);

  // Legend
  const legendX = w / 2 + 20;
  let legendY = 20;
  data.forEach((d) => {
    ctx.fillStyle = d.color;
    ctx.fillRect(legendX, legendY, 10, 10);
    ctx.fillStyle = '#475569';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`${d.label} (${((d.value / total) * 100).toFixed(1)}%)`, legendX + 16, legendY);
    legendY += 22;
  });
}
