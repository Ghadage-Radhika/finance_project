import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const empty = { description: '', amount: '', category: 'Food', type: 'expense', date: new Date().toISOString().split('T')[0] };

export default function TransactionModal({ transaction, onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (transaction) {
      setForm({ ...transaction, amount: Math.abs(transaction.amount) });
    }
  }, [transaction]);

  const handleSubmit = () => {
    if (!form.description || !form.amount) return;
    const amount = form.type === 'expense' ? -Math.abs(+form.amount) : Math.abs(+form.amount);
    if (transaction) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { ...form, amount, id: transaction.id } });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: { ...form, amount, id: Date.now() } });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div className="modal-title">{transaction ? 'Edit Transaction' : 'Add Transaction'}</div>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" placeholder="e.g. Monthly Salary" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input className="form-input" type="number" placeholder="0" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {Object.keys(CATEGORIES).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {transaction ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}
