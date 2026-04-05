import React from 'react';
import { useApp } from '../../context/AppContext';
import { getSummary, formatCurrency } from '../../utils/helpers';

export default function SummaryCards() {
  const { state } = useApp();
  const { income, expenses, balance } = getSummary(state.transactions);

  const cards = [
    { key: 'balance', label: 'Net Balance', value: balance, icon: '💰', change: '+12.4% vs last month' },
    { key: 'income', label: 'Total Income', value: income, icon: '📈', change: '+8.2% vs last month' },
    { key: 'expenses', label: 'Total Expenses', value: expenses, icon: '📉', change: '+3.1% vs last month' },
  ];

  return (
    <div className="summary-grid">
      {cards.map(({ key, label, value, icon, change }) => (
        <div key={key} className={`summary-card ${key} animate-in`}>
          <div className="summary-icon">{icon}</div>
          <div className="summary-label">{label}</div>
          <div className="summary-amount">{formatCurrency(value)}</div>
          <div className="summary-change">{change}</div>
        </div>
      ))}
    </div>
  );
}
