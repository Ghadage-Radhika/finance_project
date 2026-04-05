import React from 'react';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Shield, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">💹</div>
        <div className="logo-text">Fin<span>Track</span></div>
      </div>

      <div className="nav-section-label">Navigation</div>

      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`nav-item ${state.activeTab === id ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_TAB', payload: id })}
        >
          <Icon className="nav-icon" />
          {label}
        </button>
      ))}

      <div className="sidebar-footer">
        <div className="role-badge">
          {state.role === 'admin' ? <Shield size={10} /> : <Eye size={10} />}
          {state.role}
        </div>
        <select
          className="role-selector"
          value={state.role}
          onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
        >
          <option value="admin">Admin — Full Access</option>
          <option value="viewer">Viewer — Read Only</option>
        </select>
      </div>
    </nav>
  );
}
