import React, { useState, useId } from 'react';
import { generateAutomaticPriceHistory, PriceHistoryPoint } from '../utils/priceHistory';

interface PriceHistoryChartProps {
  productId: string;
  price?: number;
  originalPrice?: number;
  customHistory?: Array<{ date: string; price: number }>;
  className?: string;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  productId,
  price,
  originalPrice,
  customHistory,
  className = '',
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<30 | 60>(30);
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    price: number;
    label: string;
  } | null>(null);

  const gradientId = useId();

  // If no price is defined, we do not render the chart
  if (!price && !originalPrice) {
    return null;
  }

  const effectivePrice = price || originalPrice || 100;

  // Generate or map points
  let points: PriceHistoryPoint[];
  if (customHistory && customHistory.length >= 2) {
    points = customHistory.map((item) => ({
      date: item.date,
      label: new Date(item.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      }).replace('.', ''),
      price: item.price,
    }));
  } else {
    points = generateAutomaticPriceHistory(
      productId,
      effectivePrice,
      originalPrice,
      selectedPeriod
    );
  }

  // Dimensions for SVG viewBox
  const width = 360;
  const height = 150;
  const paddingX = 14;
  const paddingTop = 20;
  const paddingBottom = 24;

  const minPrice = Math.min(...points.map((p) => p.price)) * 0.96;
  const maxPrice = Math.max(...points.map((p) => p.price)) * 1.04;
  const priceRange = maxPrice - minPrice || 1;

  // Map data points to SVG coordinates
  const svgPoints = points.map((p, index) => {
    const x = paddingX + (index / (points.length - 1)) * (width - paddingX * 2);
    // Y inverted in SVG: higher price = lower y (higher visually)
    const y =
      paddingTop +
      (1 - (p.price - minPrice) / priceRange) *
        (height - paddingTop - paddingBottom);
    return { x, y, price: p.price, label: p.label };
  });

  // Calculate smooth cubic Bezier curve path
  const createSmoothPath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

      // Catmull-Rom to Cubic Bezier conversion
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    return path;
  };

  const linePath = createSmoothPath(svgPoints);
  const lastPoint = svgPoints[svgPoints.length - 1];
  const firstPoint = svgPoints[0];

  // Closed path for subtle gradient fill
  const areaPath = `${linePath} L ${lastPoint.x.toFixed(1)} ${height - 6} L ${firstPoint.x.toFixed(1)} ${height - 6} Z`;

  // Grid line Y coordinates (3 horizontal lines)
  const gridY1 = paddingTop + (height - paddingTop - paddingBottom) * 0.15;
  const gridY2 = paddingTop + (height - paddingTop - paddingBottom) * 0.55;
  const gridY3 = paddingTop + (height - paddingTop - paddingBottom) * 0.95;

  const formatBRL = (val: number) =>
    `R$ ${val.toFixed(2).replace('.', ',')}`;

  return (
    <div
      className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm transition-all ${className}`}
    >
      {/* Header matching user image */}
      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Histórico de preço
        </h3>

        {/* Period toggle pill */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] sm:text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setSelectedPeriod(30)}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              selectedPeriod === 30
                ? 'bg-white text-orange-600 shadow-xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            30 dias
          </button>
          <button
            type="button"
            onClick={() => setSelectedPeriod(60)}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              selectedPeriod === 60
                ? 'bg-white text-orange-600 shadow-xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            60 dias
          </button>
        </div>
      </div>

      {/* Chart SVG */}
      <div
        className="relative w-full select-none"
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
        >
          <defs>
            <linearGradient id={`grad-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#f97316" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          <line
            x1={paddingX}
            y1={gridY1}
            x2={width - paddingX}
            y2={gridY1}
            stroke="#f1f5f9"
            strokeWidth="1.2"
          />
          <line
            x1={paddingX}
            y1={gridY2}
            x2={width - paddingX}
            y2={gridY2}
            stroke="#f1f5f9"
            strokeWidth="1.2"
          />
          <line
            x1={paddingX}
            y1={gridY3}
            x2={width - paddingX}
            y2={gridY3}
            stroke="#f1f5f9"
            strokeWidth="1.2"
          />

          {/* Area gradient under the line */}
          <path d={areaPath} fill={`url(#grad-${gradientId})`} />

          {/* Smooth line */}
          <path
            d={linePath}
            fill="none"
            stroke="#ea580c"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Current / Last Point Dot matching the orange dot in the user image */}
          {lastPoint && (
            <g>
              {/* Subtle outer pulse circle */}
              <circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r="7"
                fill="#ea580c"
                opacity="0.2"
              />
              {/* Solid dot */}
              <circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r="4.5"
                fill="#ea580c"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Hover indicator guideline & dot */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={paddingTop}
                x2={hoveredPoint.x}
                y2={height - paddingBottom}
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="5"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Transparent interactive trigger zones along points */}
          {svgPoints.map((pt, idx) => (
            <rect
              key={idx}
              x={pt.x - 12}
              y={0}
              width={24}
              height={height}
              fill="transparent"
              onMouseEnter={() => setHoveredPoint(pt)}
              onTouchStart={() => setHoveredPoint(pt)}
            />
          ))}
        </svg>

        {/* Hover Tooltip overlay */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg shadow-lg -translate-x-1/2 -translate-y-full mb-2 whitespace-nowrap transition-transform duration-75 z-20"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-slate-300 font-normal">{hoveredPoint.label}:</span>
              <span className="text-emerald-300 font-bold">
                {formatBRL(hoveredPoint.price)}
              </span>
            </div>
            {/* Tooltip caret */}
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
          </div>
        )}
      </div>

      {/* Footer matching exact layout from the image:
          Left: "Últimos 30 dias"
          Right: "R$ 179,91" in bright blue
      */}
      <div className="mt-1 pt-2 flex items-center justify-between border-t border-slate-100">
        <span className="text-xs sm:text-sm text-slate-500 font-medium">
          Últimos {selectedPeriod} dias
        </span>
        <span className="text-sm sm:text-base font-bold text-blue-600">
          {formatBRL(effectivePrice)}
        </span>
      </div>
    </div>
  );
};
