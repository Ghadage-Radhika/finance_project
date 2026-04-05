import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';
import { getCategoryBreakdown, formatCurrency } from '../../utils/helpers';
import { CATEGORIES } from '../../data/mockData';

const COLORS = ['#00e5a0', '#ff4d6d', '#4d9fff', '#b06aff', '#f59e0b', '#f97316', '#10b981', '#ec4899'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{d.name}</div>
      <div className="tooltip-value" style={{ color: d.payload.fill }}>{formatCurrency(d.value)}</div>
    </div>
  );
};

export default function CategoryBreakdown() {
  const { state } = useApp();
  const data = getCategoryBreakdown(state.transactions);
  const total = data.reduce((s, d) => s + d.value, 0);
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Spending Breakdown</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={55} outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            onMouseEnter={(_, i) => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={CATEGORIES[entry.name]?.color || COLORS[i % COLORS.length]}
                opacity={activeIndex === null || activeIndex === i ? 1 : 0.4}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 12 }}>
        {data.slice(0, 5).map((d, i) => {
          const color = CATEGORIES[d.name]?.color || COLORS[i % COLORS.length];
          const pct = ((d.value / total) * 100).toFixed(1);
          return (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, flex: 1, color: 'var(--text-secondary)' }}>{d.name}</span>
              <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text-primary)' }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
