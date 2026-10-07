import React, { useState } from 'react';

export default function ExpiryChart({ stats }) {
  const { total, safe, expiringSoon, expired } = stats;
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (total === 0) {
    return (
      <div className="overview-chart-card glass-card">
        <h3 className="card-title">Expiry Overview</h3>
        <div className="chart-empty-state">
          <p className="text-muted text-sm">No items in inventory</p>
        </div>
      </div>
    );
  }

  const safePct = Math.round((safe / total) * 100);
  const expiringPct = Math.round((expiringSoon / total) * 100);
  // Ensure sum equals 100 or accurate remainder
  const expiredPct = total > 0 ? 100 - safePct - expiringPct : 0;

  const data = [
    { label: 'Valid', count: safe, pct: safePct, color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
    { label: 'Expiring Soon', count: expiringSoon, pct: expiringPct, color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
    { label: 'Critical', count: expired, pct: expiredPct >= 0 ? expiredPct : 0, color: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' }
  ];

  // SVG Donut calculation
  const radius = 54;
  const strokeWidth = 18;
  const center = 75;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = -90; // Start at top 12 o'clock

  const segments = data.map((item, idx) => {
    const fraction = total > 0 ? item.count / total : 0;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const startAngle = cumulativeAngle;
    cumulativeAngle += fraction * 360;

    return {
      ...item,
      idx,
      fraction,
      strokeDasharray,
      startAngle
    };
  });

  return (
    <div className="overview-chart-card glass-card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="card-title">Expiry Overview</h3>
        <span className="text-xs text-muted font-mono">{total} Items</span>
      </div>

      <div className="donut-content-wrapper">
        {/* SVG Donut */}
        <div className="donut-svg-box">
          <svg viewBox="0 0 150 150" className="donut-svg">
            {/* Background ring track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth={strokeWidth}
            />

            {segments.map((seg) => {
              if (seg.count === 0) return null;
              const isHovered = hoveredIndex === seg.idx;

              return (
                <circle
                  key={seg.label}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={0}
                  transform={`rotate(${seg.startAngle} ${center} ${center})`}
                  strokeLinecap="round"
                  className="donut-segment transition-all"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 8px ${seg.glow})` : undefined,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredIndex(seg.idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="donut-center-info">
            {hoveredIndex !== null ? (
              <>
                <span className="donut-center-val" style={{ color: data[hoveredIndex].color }}>
                  {data[hoveredIndex].pct}%
                </span>
                <span className="donut-center-label">{data[hoveredIndex].label}</span>
              </>
            ) : (
              <>
                <span className="donut-center-val text-white">{safePct}%</span>
                <span className="donut-center-label">Safe</span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="donut-legend">
          {data.map((item, idx) => (
            <div
              key={item.label}
              className={`legend-item ${hoveredIndex === idx ? 'legend-item-active' : ''}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.glow}` }}
                />
                <span className="legend-name">{item.label}</span>
              </div>
              <span className="legend-pct" style={{ color: item.color }}>
                {item.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
