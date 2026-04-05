import React from 'react';
import SummaryCards from './SummaryCards';
import BalanceTrend from './BalanceTrend';
import CategoryBreakdown from './CategoryBreakdown';
import RecentTransactions from './RecentTransactions';

export default function DashboardPage() {
  return (
    <div>
      <SummaryCards />
      <div className="charts-grid">
        <BalanceTrend />
        <CategoryBreakdown />
      </div>
      <RecentTransactions />
    </div>
  );
}
