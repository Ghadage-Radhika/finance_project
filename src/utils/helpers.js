export const formatCurrency = (amount) => {
  const abs = Math.abs(amount);
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(abs);
};

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const getFilteredTransactions = (transactions, filters, sortBy, sortOrder) => {
  let result = [...transactions];
  if (filters.type !== 'all') result = result.filter(t => t.type === filters.type);
  if (filters.category !== 'all') result = result.filter(t => t.category === filters.category);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }
  result.sort((a, b) => {
    let valA = a[sortBy], valB = b[sortBy];
    if (sortBy === 'amount') { valA = Math.abs(valA); valB = Math.abs(valB); }
    if (sortBy === 'date') { valA = new Date(valA); valB = new Date(valB); }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  return result;
};

export const getSummary = (transactions) => {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
  return { income, expenses, balance: income - expenses };
};

export const getCategoryBreakdown = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const map = {};
  expenses.forEach(t => {
    map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
  });
  return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
};

export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map(t => [t.date, t.description, t.category, t.type, t.amount]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'transactions.csv'; a.click();
};

export const exportToJSON = (transactions) => {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'transactions.json'; a.click();
};
