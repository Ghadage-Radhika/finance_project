import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import DashboardPage from './components/dashboard/DashboardPage';
import TransactionsPage from './components/transactions/TransactionsPage';
import InsightsPage from './components/insights/InsightsPage';
import './index.css';

function AppContent() {
  const { state } = useApp();

  // Apply light-mode class to <body> so CSS vars cascade everywhere
  useEffect(() => {
    if (state.darkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [state.darkMode]);

  return (
    <div className={`app-shell${state.darkMode ? '' : ' light-mode'}`}>
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-body">
          {state.activeTab === 'dashboard'     && <DashboardPage />}
          {state.activeTab === 'transactions'  && <TransactionsPage />}
          {state.activeTab === 'insights'      && <InsightsPage />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
