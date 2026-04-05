import React from 'react';
import { Sun, Moon, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportToCSV } from '../../utils/helpers';

const pageMeta = {
  dashboard: { title: 'Dashboard', subtitle: 'Your financial overview at a glance' },
  transactions: { title: 'Transactions', subtitle: 'Track and manage all your transactions' },
  insights: { title: 'Insights', subtitle: 'Understand your spending patterns' },
};

export default function Topbar() {
  const { state, dispatch } = useApp();
  const meta = pageMeta[state.activeTab];

  return (
    <header className="topbar">
      <div>
        <div className="page-title">{meta.title}</div>
        <div className="page-subtitle">{meta.subtitle}</div>
      </div>
      <div className="topbar-actions">
        {state.role === 'admin' && (
          <button className="icon-btn" onClick={() => exportToCSV(state.transactions)} title="Export CSV">
            <Download size={16} />
          </button>
        )}
        <button className="icon-btn" onClick={() => dispatch({ type: 'TOGGLE_DARK' })} title="Toggle Theme">
          {state.darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
