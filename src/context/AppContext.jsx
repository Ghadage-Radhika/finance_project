import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { generateTransactions } from '../data/mockData';

const AppContext = createContext();

const initialState = {
  transactions: [],
  role: 'admin',
  filters: { type: 'all', category: 'all', search: '' },
  sortBy: 'date',
  sortOrder: 'desc',
  darkMode: true,
  activeTab: 'dashboard',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TRANSACTIONS': return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t),
      };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'SET_ROLE': return { ...state, role: action.payload };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder };
    case 'TOGGLE_DARK': return { ...state, darkMode: !state.darkMode };
    case 'SET_TAB': return { ...state, activeTab: action.payload };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = localStorage.getItem('financeState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...init, transactions: parsed.transactions || generateTransactions(), darkMode: parsed.darkMode ?? true };
      } catch { }
    }
    return { ...init, transactions: generateTransactions() };
  });

  useEffect(() => {
    localStorage.setItem('financeState', JSON.stringify({ transactions: state.transactions, darkMode: state.darkMode }));
  }, [state.transactions, state.darkMode]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
