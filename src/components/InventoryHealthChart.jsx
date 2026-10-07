import React, { useState } from 'react';

export default function InventoryHealthChart({ products = [] }) {
  const [timeframe, setTimeframe] = useState('Monthly'); // Daily, Weekly, Monthly

  // Dynamic trend points based on selected timeframe
  const getChartData = () => {
    const totalCount = products.length || 8;
    if (timeframe === 'Daily') {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        items: [
          Math.max(2, totalCount - 3),
          Math.max(3, totalCount - 1),
          totalCount,
          totalCount + 2,
          totalCount + 1,
          totalCount + 4,
          totalCount + 3
        ],
        alerts: [1, 2, 1, 3, 2, 1, 2]
      };
    } else if (timeframe === 'Weekly') {
      return {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
        items: [10, 18, 25, 38, Math.max(20, totalCount * 4)],
        alerts: [3, 6, 4, 8, 5]
      };
    } else {
      // Monthly (matching the reference image Jan, Feb, Mar, Apr, May)
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        items: [12, 31, 22, 38, 30],
        alerts: [10, 15, 28, 29, 44]
      };
    }
  };

  const data = getChartData();
  const maxVal = 50;
  const width = 360;
  const height = 160;
  const paddingX = 35;
  const paddingY = 20;

  // Compute SVG smooth curve path
  const getCoordinates = (points) => {
    return points.map((val, idx) => {
      const x = paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - (val / maxVal) * (height - paddingY * 2);
      return { x, y, val };
    });
  };

  const makeSmoothPath = (coords) => {
    if (coords.length === 0) return '';
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const itemCoords = getCoordinates(data.items);
  const alertCoords = getCoordinates(data.alerts);

  const itemPath = makeSmoothPath(itemCoords);
  const alertPath = makeSmoothPath(alertCoords);

  return (
    <div className="health-chart-card glass-card">
      <div className="chart-header flex justify-between items-center mb-2">
        <h3 className="card-title">Inventory Health</h3>
        <div className="chart-pills">
          {['Daily', 'Weekly', 'Monthly'].map((tf) => (
            <button
              key={tf}
              className={`pill-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-svg-container relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Subtle horizontal grid lines */}
          {[0, 10, 20, 30, 40, 50].map((val) => {
            const y = height - paddingY - (val / maxVal) * (height - paddingY * 2);
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX + 10}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeDasharray="2 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="Inter"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Y Axis Title */}
          <text
            x={10}
            y={height / 2}
            textAnchor="middle"
            fill="#64748b"
            fontSize="8"
            transform={`rotate(-90 10 ${height / 2})`}
          >
            Items Count
          </text>

          {/* Curves */}
          {/* Neon Purple Curve (Items Velocity) */}
          <path
            d={itemPath}
            fill="none"
            stroke="#818cf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(129, 140, 248, 0.45))' }}
          />

          {/* Neon Green Curve (Safe Health) */}
          <path
            d={alertPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.45))' }}
          />

          {/* Data Points */}
          {itemCoords.map((pt, i) => (
            <circle
              key={`item-${i}`}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill="#c7d2fe"
              stroke="#4338ca"
              strokeWidth="2"
              className="chart-dot"
            >
              <title>{`Total Items: ${pt.val}`}</title>
            </circle>
          ))}

          {alertCoords.map((pt, i) => (
            <circle
              key={`alert-${i}`}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill="#6ee7b7"
              stroke="#047857"
              strokeWidth="2"
              className="chart-dot"
            >
              <title>{`Safe Rate: ${pt.val}`}</title>
            </circle>
          ))}

          {/* X Axis Labels */}
          {data.labels.map((lbl, i) => {
            const x = paddingX + (i / (data.labels.length - 1)) * (width - paddingX * 2);
            return (
              <text
                key={lbl}
                x={x}
                y={height - 4}
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
                fontFamily="Inter"
              >
                {lbl}
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block shadow-sm"></span>
            <span>Stock Flow</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-sm"></span>
            <span>Freshness Index</span>
          </div>
        </div>
      </div>
    </div>
  );
}
