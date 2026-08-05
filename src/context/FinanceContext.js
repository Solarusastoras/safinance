// src/context/FinanceContext.js
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_SUBSCRIPTIONS,
} from '../data/initialData';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [theme, setTheme]       = useState(() => localStorage.getItem('sf_theme')    || 'metallic');
  const [currency, setCurrency] = useState(() => localStorage.getItem('sf_currency') || 'EUR');
  const [activeTab, setActiveTab]   = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType]     = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [transactions, setTransactions] = useState(() => {
    const s = localStorage.getItem('sf_transactions');
    return s ? JSON.parse(s) : INITIAL_TRANSACTIONS;
  });
  const [categories] = useState(INITIAL_CATEGORIES);
  const [budgets, setBudgets] = useState(() => {
    const s = localStorage.getItem('sf_budgets');
    return s ? JSON.parse(s) : INITIAL_BUDGETS;
  });
  const [savingsGoals, setSavingsGoals] = useState(() => {
    const s = localStorage.getItem('sf_savings');
    return s ? JSON.parse(s) : INITIAL_SAVINGS_GOALS;
  });
  const [subscriptions, setSubscriptions] = useState(() => {
    const s = localStorage.getItem('sf_subs');
    return s ? JSON.parse(s) : INITIAL_SUBSCRIPTIONS;
  });

  // Sync localStorage
  useEffect(() => { localStorage.setItem('sf_theme', theme); document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('sf_currency', currency); }, [currency]);
  useEffect(() => { localStorage.setItem('sf_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('sf_budgets', JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem('sf_savings', JSON.stringify(savingsGoals)); }, [savingsGoals]);
  useEffect(() => { localStorage.setItem('sf_subs', JSON.stringify(subscriptions)); }, [subscriptions]);

  const formatCurrency = (amount) => {
    const symbols = { EUR: '€', USD: '$', GBP: '£', CHF: 'CHF ' };
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + ' ' + (symbols[currency] || '€');
  };

  const metrics = useMemo(() => {
    const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const balance      = totalIncome - totalExpense;
    const savingsRate  = totalIncome > 0 ? Math.max(0, (balance / totalIncome) * 100) : 0;
    const totalSavings = savingsGoals.reduce((s, g) => s + Number(g.currentAmount), 0);
    return { totalIncome, totalExpense, balance, savingsRate, totalSavings };
  }, [transactions, savingsGoals]);

  // Actions
  const addTransaction    = (tx)  => setTransactions(p => [{ ...tx, id: 'tx-' + Date.now() }, ...p]);
  const updateTransaction = (id, u) => setTransactions(p => p.map(t => t.id === id ? { ...t, ...u } : t));
  const deleteTransaction = (id)  => setTransactions(p => p.filter(t => t.id !== id));

  const updateBudget = (categoryId, target) => {
    setBudgets(p => {
      const ex = p.find(b => b.categoryId === categoryId);
      if (ex) return p.map(b => b.categoryId === categoryId ? { ...b, target: Number(target) } : b);
      return [...p, { id: 'bgt-' + Date.now(), categoryId, target: Number(target) }];
    });
  };

  const addSavingsGoal    = (g)  => setSavingsGoals(p => [{ ...g, id: 'goal-' + Date.now() }, ...p]);
  const updateSavingsGoal = (id, u) => setSavingsGoals(p => p.map(g => g.id === id ? { ...g, ...u } : g));
  const deleteSavingsGoal = (id)  => setSavingsGoals(p => p.filter(g => g.id !== id));

  const depositToGoal = (id, amount) => {
    setSavingsGoals(p => p.map(g => g.id === id ? { ...g, currentAmount: Number(g.currentAmount) + Number(amount) } : g));
    const goal = savingsGoals.find(g => g.id === id);
    if (goal) addTransaction({ title: `Épargne: ${goal.title}`, amount: Number(amount), type: 'expense', category: 'cat-investments', account: 'acc-main', date: new Date().toISOString().split('T')[0], note: `Virement vers ${goal.title}` });
  };

  const addSubscription    = (s) => setSubscriptions(p => [{ ...s, id: 'sub-' + Date.now() }, ...p]);
  const deleteSubscription = (id) => setSubscriptions(p => p.filter(s => s.id !== id));

  const resetData = () => {
    if (window.confirm('Réinitialiser toutes les données ?')) {
      setTransactions(INITIAL_TRANSACTIONS);
      setBudgets(INITIAL_BUDGETS);
      setSavingsGoals(INITIAL_SAVINGS_GOALS);
      setSubscriptions(INITIAL_SUBSCRIPTIONS);
    }
  };

  return (
    <FinanceContext.Provider value={{
      theme, setTheme, currency, setCurrency,
      activeTab, setActiveTab, searchQuery, setSearchQuery,
      isModalOpen, setIsModalOpen, modalType, setModalType,
      editingItem, setEditingItem,
      transactions, addTransaction, updateTransaction, deleteTransaction,
      categories, budgets, updateBudget,
      savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, depositToGoal,
      subscriptions, addSubscription, deleteSubscription,
      metrics, formatCurrency, resetData,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
