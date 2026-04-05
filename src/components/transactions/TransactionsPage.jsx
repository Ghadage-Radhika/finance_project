import React, { useState, useMemo } from 'react';
import { Search, Plus, ChevronUp, ChevronDown, Edit2, Trash2, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getFilteredTransactions, formatCurrency, formatDate, exportToCSV, exportToJSON } from '../../utils/helpers';
import { CATEGORIES } from '../../data/mockData';
import TransactionModal from './TransactionModal';

const PAGE_SIZE = 10;

export default function TransactionsPage() {
  const { state, dispatch } = useApp();
  const [modal, setModal] = useState(null); // null | 'add' | transaction object
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => getFilteredTransactions(state.transactions, state.filters, state.sortBy, state.sortOrder),
    [state.transactions, state.filters, state.sortBy, state.sortOrder]
  );

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const isAdmin = state.role === 'admin';

  const handleSort = (col) => {
    dispatch({
      type: 'SET_SORT',
      payload: { sortBy: col, sortOrder: state.sortBy === col && state.sortOrder === 'asc' ? 'desc' : 'asc' }
    });
    setPage(1);
  };

  const SortIcon = ({ col }) => {
    if (state.sortBy !== col) return null;
    return state.sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  const categories = [...new Set(state.transactions.map(t => t.category))].sort();

  return (
    <div>
      <div className="card">
        <div className="filters-row">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              placeholder="Search transactions..."
              value={state.filters.search}
              onChange={e => { dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } }); setPage(1); }}
            />
          </div>

          <select className="select-filter" value={state.filters.type}
            onChange={e => { dispatch({ type: 'SET_FILTER', payload: { type: e.target.value } }); setPage(1); }}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select className="select-filter" value={state.filters.category}
            onChange={e => { dispatch({ type: 'SET_FILTER', payload: { category: e.target.value } }); setPage(1); }}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>

          {isAdmin && (
            <>
              <button className="btn btn-secondary" onClick={() => exportToCSV(filtered)} title="Export CSV">
                <Download size={14} /> CSV
              </button>
              <button className="btn btn-primary" onClick={() => setModal('add')}>
                <Plus size={15} /> Add
              </button>
            </>
          )}
        </div>

        {paginated.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No transactions found</div>
            <div className="empty-desc">Try adjusting your filters</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tx-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('date')}>Date <SortIcon col="date" /></th>
                  <th>Description</th>
                  <th onClick={() => handleSort('category')}>Category <SortIcon col="category" /></th>
                  <th>Type</th>
                  <th onClick={() => handleSort('amount')} style={{ textAlign: 'right' }}>Amount <SortIcon col="amount" /></th>
                  {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map(tx => (
                  <tr key={tx.id}>
                    <td><span className="tx-date">{formatDate(tx.date)}</span></td>
                    <td><span className="tx-desc">{tx.description}</span></td>
                    <td>
                      <span className="category-badge">
                        {CATEGORIES[tx.category]?.icon} {tx.category}
                      </span>
                    </td>
                    <td><span className={`type-badge ${tx.type}`}>{tx.type}</span></td>
                    <td>
                      <div className={`tx-amount ${tx.type}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                      </div>
                    </td>
                    {isAdmin && (
                      <td>
                        <div className="action-btns">
                          <button className="icon-action edit" onClick={() => setModal(tx)} title="Edit">
                            <Edit2 size={13} />
                          </button>
                          <button className="icon-action delete" onClick={() => handleDelete(tx.id)} title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <span className="pagination-info">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="pagination-btns">
              <button className="btn btn-ghost" style={{ padding: '6px 12px' }} disabled={page === 1}
                onClick={() => setPage(p => p - 1)}>Prev</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i}
                  className={`btn ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '6px 12px', minWidth: 36 }}
                  onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
              <button className="btn btn-ghost" style={{ padding: '6px 12px' }} disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <TransactionModal
          transaction={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
