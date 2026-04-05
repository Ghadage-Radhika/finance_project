import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CATEGORIES } from '../../data/mockData';

export default function RecentTransactions() {
  const { state, dispatch } = useApp();
  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Recent Transactions</span>
        <button
          className="btn btn-ghost"
          style={{ fontSize: 12, padding: '6px 12px' }}
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'transactions' })}
        >
          View All
        </button>
      </div>
      {recent.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">No transactions yet</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {recent.map(tx => (
            <div key={tx.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 0',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0
              }}>
                {CATEGORIES[tx.category]?.icon || '💳'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tx.description}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {tx.category} · {formatDate(tx.date)}
                </div>
              </div>
              <div style={{
                fontFamily: 'DM Mono, monospace', fontSize: 14, fontWeight: 500,
                color: tx.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)',
                flexShrink: 0
              }}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
