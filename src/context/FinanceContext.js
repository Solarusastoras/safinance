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
  const [lastSaved, setLastSaved]     = useState(() => localStorage.getItem('sf_last_saved') || new Date().toISOString());

  const [transactions, setTransactions] = useState(() => {
    const s = localStorage.getItem('sf_transactions');
    return s ? JSON.parse(s) : INITIAL_TRANSACTIONS;
  });
  const [categories, setCategories] = useState(() => {
    const s = localStorage.getItem('sf_categories');
    return s ? JSON.parse(s) : INITIAL_CATEGORIES;
  });
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

  // Auto-sync localStorage & update lastSaved timestamp
  useEffect(() => {
    localStorage.setItem('sf_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sf_currency', currency);
  }, [currency]);

  useEffect(() => {
    const now = new Date().toISOString();
    localStorage.setItem('sf_transactions', JSON.stringify(transactions));
    localStorage.setItem('sf_categories', JSON.stringify(categories));
    localStorage.setItem('sf_budgets', JSON.stringify(budgets));
    localStorage.setItem('sf_savings', JSON.stringify(savingsGoals));
    localStorage.setItem('sf_subs', JSON.stringify(subscriptions));
    localStorage.setItem('sf_last_saved', now);
    setLastSaved(now);
  }, [transactions, categories, budgets, savingsGoals, subscriptions]);

  const formatCurrency = (amount) => {
    const symbols = { EUR: '€', USD: '$', GBP: '£', CHF: 'CHF ' };
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + ' ' + (symbols[currency] || '€');
  };

  const metrics = useMemo(() => {
    const active = transactions.filter(t => !t.isDeleted);
    const totalIncome  = active.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = active.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const balance      = totalIncome - totalExpense;
    const savingsRate  = totalIncome > 0 ? Math.max(0, (balance / totalIncome) * 100) : 0;
    const totalSavings = savingsGoals.reduce((s, g) => s + Number(g.currentAmount), 0);
    return { totalIncome, totalExpense, balance, savingsRate, totalSavings };
  }, [transactions, savingsGoals]);

  // Actions
  const addTransaction = (tx) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const newTx = {
      ...tx,
      id: 'tx-' + Date.now(),
      isModified: false,
      isDeleted: false,
      createdAt: formattedDate,
      history: [
        {
          action: 'created',
          date: formattedDate,
          note: 'Transaction créée',
          details: `${tx.type === 'income' ? 'Revenu' : 'Dépense'} de ${tx.amount} €`
        }
      ]
    };
    setTransactions(p => [newTx, ...p]);
  };

  const updateTransaction = (id, u) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    setTransactions(p => p.map(t => {
      if (t.id !== id) return t;

      const changes = [];
      if (u.title !== undefined && u.title !== t.title) changes.push(`Titre: "${t.title}" ➔ "${u.title}"`);
      if (u.amount !== undefined && Number(u.amount) !== Number(t.amount)) changes.push(`Montant: ${t.amount} € ➔ ${u.amount} €`);
      if (u.type !== undefined && u.type !== t.type) changes.push(`Type: ${t.type === 'income' ? 'Revenu' : 'Dépense'} ➔ ${u.type === 'income' ? 'Revenu' : 'Dépense'}`);
      if (u.category !== undefined && u.category !== t.category) changes.push(`Catégorie modifiée`);
      if (u.date !== undefined && u.date !== t.date) changes.push(`Date: ${t.date} ➔ ${u.date}`);
      if (u.note !== undefined && u.note !== t.note) changes.push(`Note modifiée`);

      const detailsText = changes.length > 0 ? changes.join(' | ') : 'Modifications enregistrées';
      const currentHistory = Array.isArray(t.history) ? t.history : [];

      return {
        ...t,
        ...u,
        isModified: true,
        updatedAt: formattedDate,
        history: [
          ...currentHistory,
          {
            action: 'modified',
            date: formattedDate,
            note: 'Transaction modifiée',
            details: detailsText
          }
        ]
      };
    }));
  };

  const deleteTransaction = (id) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    setTransactions(p => p.map(t => {
      if (t.id !== id) return t;
      const currentHistory = Array.isArray(t.history) ? t.history : [];
      return {
        ...t,
        isDeleted: true,
        deletedAt: formattedDate,
        history: [
          ...currentHistory,
          {
            action: 'deleted',
            date: formattedDate,
            note: 'Déplacée vers la corbeille'
          }
        ]
      };
    }));
  };

  const restoreTransaction = (id) => {
    const formattedDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    setTransactions(p => p.map(t => {
      if (t.id !== id) return t;
      const currentHistory = Array.isArray(t.history) ? t.history : [];
      return {
        ...t,
        isDeleted: false,
        restoredAt: formattedDate,
        history: [
          ...currentHistory,
          {
            action: 'restored',
            date: formattedDate,
            note: 'Transaction restaurée'
          }
        ]
      };
    }));
  };

  const permanentDeleteTransaction = (id) => {
    setTransactions(p => p.filter(t => t.id !== id));
  };

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
  const updateSubscription = (id, u) => setSubscriptions(p => p.map(s => s.id === id ? { ...s, ...u } : s));
  const deleteSubscription = (id) => setSubscriptions(p => p.filter(s => s.id !== id));

  // Export JSON Backup
  const exportDataJSON = () => {
    const backupData = {
      version: '1.0',
      appName: 'SAFinance',
      exportDate: new Date().toISOString(),
      settings: { theme, currency },
      transactions,
      categories,
      budgets,
      savingsGoals,
      subscriptions,
    };
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `safinance-sauvegarde-${today}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export CSV Transactions
  const exportDataCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert('Aucune transaction disponible à exporter.');
      return;
    }
    const catMap = categories.reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {});
    const headers = ['ID', 'Titre', 'Montant (€)', 'Type', 'Catégorie', 'Compte', 'Date', 'Note', 'Corbeille', 'Date Création'];
    const rows = transactions.map(t => [
      `"${t.id || ''}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.amount,
      `"${t.type === 'income' ? 'Revenu' : 'Dépense'}"`,
      `"${catMap[t.category] || t.category || ''}"`,
      `"${t.account || ''}"`,
      `"${t.date || ''}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`,
      t.isDeleted ? 'Oui' : 'Non',
      `"${t.createdAt || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `safinance-transactions-${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const importDataJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Le fichier sélectionné ne contient pas de JSON valide.');
      }

      let restoredItemsCount = 0;
      if (parsed.transactions && Array.isArray(parsed.transactions)) {
        setTransactions(parsed.transactions);
        restoredItemsCount += parsed.transactions.length;
      }
      if (parsed.categories && Array.isArray(parsed.categories)) {
        setCategories(parsed.categories);
      }
      if (parsed.budgets && Array.isArray(parsed.budgets)) {
        setBudgets(parsed.budgets);
      }
      if (parsed.savingsGoals && Array.isArray(parsed.savingsGoals)) {
        setSavingsGoals(parsed.savingsGoals);
      }
      if (parsed.subscriptions && Array.isArray(parsed.subscriptions)) {
        setSubscriptions(parsed.subscriptions);
      }
      if (parsed.settings?.theme) setTheme(parsed.settings.theme);
      if (parsed.settings?.currency) setCurrency(parsed.settings.currency);

      const now = new Date().toISOString();
      setLastSaved(now);
      localStorage.setItem('sf_last_saved', now);

      return { success: true, count: restoredItemsCount };
    } catch (err) {
      console.error('Erreur import:', err);
      return { success: false, error: err.message };
    }
  };

  const resetData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données aux valeurs par défaut ?Cette action écrasera vos transactions actuelles.')) {
      setTransactions(INITIAL_TRANSACTIONS);
      setCategories(INITIAL_CATEGORIES);
      setBudgets(INITIAL_BUDGETS);
      setSavingsGoals(INITIAL_SAVINGS_GOALS);
      setSubscriptions(INITIAL_SUBSCRIPTIONS);
      localStorage.removeItem('sf_transactions');
      localStorage.removeItem('sf_categories');
      localStorage.removeItem('sf_budgets');
      localStorage.removeItem('sf_savings');
      localStorage.removeItem('sf_subs');
      const now = new Date().toISOString();
      setLastSaved(now);
    }
  };

  return (
    <FinanceContext.Provider value={{
      theme, setTheme, currency, setCurrency,
      activeTab, setActiveTab, searchQuery, setSearchQuery,
      isModalOpen, setIsModalOpen, modalType, setModalType,
      editingItem, setEditingItem, lastSaved,
      transactions, addTransaction, updateTransaction, deleteTransaction, restoreTransaction, permanentDeleteTransaction,
      categories, setCategories, budgets, updateBudget,
      savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, depositToGoal,
      subscriptions, addSubscription, updateSubscription, deleteSubscription,
      exportDataJSON, exportDataCSV, importDataJSON,
      metrics, formatCurrency, resetData,
    }}>

      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);


