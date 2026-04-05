import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { getCategoryBreakdown, getSummary, formatCurrency } from '../../utils/helpers';
import { CATEGORIES, monthlyTrendData } from '../../data/mockData';

const COLORS = ['#00e5a0', '#ff4d6d', '#4d9fff', '#b06aff', '#f59e0b', '#f97316', '#10b981', '#ec4899'];

export default function InsightsPage() {
  const { state } = useApp();
  const breakdown = getCategoryBreakdown(state.transactions);
  const { income, expenses, balance } = getSummary(state.transactions);
  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;
  const topCategory = breakdown[0];
  const total = breakdown.reduce((s, d) => s + d.value, 0);
  const avgExpense = expenses > 0
    ? (expenses / state.transactions.filter(t => t.type === 'expense').length).toFixed(0)
    : 0;

  const prevMonth = monthlyTrendData[monthlyTrendData.length - 2];
  const currMonth = monthlyTrendData[monthlyTrendData.length - 1];
  const expenseChange = prevMonth
    ? (((currMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100).toFixed(1)
    : 0;

  const ProgressBar = ({ pct, color }) => (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
    </div>
  );

  const chartStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: 12,
    fontFamily: "'Times New Roman', Times, Georgia, serif",
    color: 'var(--text-primary)',
  };

  return (
    <div>
      {/* Insight KPI Cards */}
      <div className="insights-grid" style={{ marginBottom: 24 }}>

        {/* Top Spending Category */}
        <div className="insight-card">
          <div className="insight-title">Top Spending Category</div>
          {topCategory ? (
            <>
              <div style={{ fontSize: 26, marginBottom: 8 }}>
                {CATEGORIES[topCategory.name]?.icon} {topCategory.name}
              </div>
              <div className="insight-value" style={{ color: CATEGORIES[topCategory.name]?.color || 'var(--accent-red)' }}>
                {formatCurrency(topCategory.value)}
              </div>
              <div className="insight-desc">
                {((topCategory.value / total) * 100).toFixed(1)}% of total spending
              </div>
              <ProgressBar pct={(topCategory.value / total) * 100} color={CATEGORIES[topCategory.name]?.color || 'var(--accent-red)'} />
            </>
          ) : <div className="insight-desc">No expense data available.</div>}
        </div>

        {/* Savings Rate */}
        <div className="insight-card">
          <div className="insight-title">Savings Rate</div>
          <div className="insight-value" style={{ color: +savingsRate >= 20 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {savingsRate}%
          </div>
          <div className="insight-desc">
            {+savingsRate >= 20
              ? '🎉 Great! Above the recommended 20%'
              : '⚠️ Below the recommended 20% savings rate'}
          </div>
          <ProgressBar pct={+savingsRate} color={+savingsRate >= 20 ? 'var(--accent-green)' : 'var(--accent-red)'} />
        </div>

        {/* MoM Comparison */}
        <div className="insight-card">
          <div className="insight-title">Month-over-Month Expenses</div>
          <div className="insight-value" style={{ color: +expenseChange > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
            {+expenseChange > 0 ? '+' : ''}{expenseChange}%
          </div>
          <div className="insight-desc">
            vs last month · {+expenseChange > 0 ? 'Spending increased' : 'Spending decreased'} by{' '}
            {formatCurrency(Math.abs(currMonth.expenses - prevMonth.expenses))}
          </div>
        </div>

        {/* Avg Transaction */}
        <div className="insight-card">
          <div className="insight-title">Avg Transaction Value</div>
          <div className="insight-value" style={{ color: 'var(--accent-blue)' }}>
            {formatCurrency(avgExpense)}
          </div>
          <div className="insight-desc">
            Across {state.transactions.filter(t => t.type === 'expense').length} expense transactions
          </div>
        </div>
      </div>

      {/* Category Bar Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title">Spending by Category</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={breakdown} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: "'Times New Roman', Times, Georgia, serif" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={false} tickLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={v => formatCurrency(v)}
              contentStyle={chartStyle}
            />
            <Bar dataKey="value" name="Spending" radius={[6, 6, 0, 0]}>
              {breakdown.map((entry, i) => (
                <Cell key={i} fill={CATEGORIES[entry.name]?.color || COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Income vs Expenses */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Monthly Income vs Expenses</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: "'Times New Roman', Times, Georgia, serif" }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={false} tickLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip formatter={v => formatCurrency(v)} contentStyle={chartStyle} />
            <Legend wrapperStyle={{ fontSize: 13, fontFamily: "'Times New Roman', Times, Georgia, serif" }} />
            <Bar dataKey="income"   name="Income"   fill="var(--accent-green)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="var(--accent-red)"   radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
