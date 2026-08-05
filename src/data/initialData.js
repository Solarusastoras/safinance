// src/data/initialData.js
export const INITIAL_CATEGORIES = [
  { id: 'cat-housing',     name: 'Logement & Charges',     icon: 'home',         color: '#3b82f6', type: 'expense' },
  { id: 'cat-food',        name: 'Alimentation & Courses', icon: 'shopping-bag', color: '#f59e0b', type: 'expense' },
  { id: 'cat-transport',   name: 'Transports & Auto',      icon: 'car',          color: '#10b981', type: 'expense' },
  { id: 'cat-leisure',     name: 'Loisirs & Sorties',      icon: 'film',         color: '#ec4899', type: 'expense' },
  { id: 'cat-subs',        name: 'Abonnements & Médias',   icon: 'tv',           color: '#8b5cf6', type: 'expense' },
  { id: 'cat-health',      name: 'Santé & Bien-être',      icon: 'heart-pulse',  color: '#06b6d4', type: 'expense' },
  { id: 'cat-tech',        name: 'Shopping & High-Tech',   icon: 'laptop',       color: '#f97316', type: 'expense' },
  { id: 'cat-salary',      name: 'Salaire & Revenus',      icon: 'wallet',       color: '#10b981', type: 'income'  },
  { id: 'cat-freelance',   name: 'Freelance & Bonus',      icon: 'briefcase',    color: '#6366f1', type: 'income'  },
  { id: 'cat-investments', name: 'Investissements',        icon: 'trending-up',  color: '#14b8a6', type: 'income'  },
];

export const INITIAL_TRANSACTIONS = [
  { id: 'tx-1', title: 'Salaire Mensuel',         amount: 3200.00, type: 'income',  category: 'cat-salary',    account: 'acc-main', date: '2026-08-01', note: 'Virement TechCorp' },
  { id: 'tx-2', title: 'Loyer Appartement',        amount: 890.00,  type: 'expense', category: 'cat-housing',   account: 'acc-main', date: '2026-08-02', note: 'Prélèvement automatique' },
  { id: 'tx-3', title: 'Courses Carrefour',         amount: 142.60,  type: 'expense', category: 'cat-food',      account: 'acc-main', date: '2026-08-03', note: 'Ravitaillement semaine' },
  { id: 'tx-4', title: 'Projet Freelance Web',      amount: 650.00,  type: 'income',  category: 'cat-freelance', account: 'acc-main', date: '2026-08-04', note: 'Acompte landing page' },
  { id: 'tx-5', title: 'Abonnement Netflix 4K',    amount: 19.99,   type: 'expense', category: 'cat-subs',      account: 'acc-main', date: '2026-08-04', note: 'Forfait mensuel' },
  { id: 'tx-6', title: "Plein d'essence Total",    amount: 72.50,   type: 'expense', category: 'cat-transport', account: 'acc-main', date: '2026-08-04', note: 'Sans Plomb 98' },
  { id: 'tx-7', title: 'Restaurant avec amis',     amount: 85.00,   type: 'expense', category: 'cat-leisure',   account: 'acc-main', date: '2026-08-05', note: 'Dîner trattoria' },
  { id: 'tx-8', title: 'Abonnement Basic-Fit',     amount: 29.90,   type: 'expense', category: 'cat-subs',      account: 'acc-main', date: '2026-08-05', note: 'Mensuel' },
];

export const INITIAL_BUDGETS = [
  { id: 'bgt-1', categoryId: 'cat-food',      target: 450.00 },
  { id: 'bgt-2', categoryId: 'cat-housing',   target: 950.00 },
  { id: 'bgt-3', categoryId: 'cat-transport', target: 200.00 },
  { id: 'bgt-4', categoryId: 'cat-leisure',   target: 250.00 },
  { id: 'bgt-5', categoryId: 'cat-subs',      target: 100.00 },
  { id: 'bgt-6', categoryId: 'cat-tech',      target: 150.00 },
];

export const INITIAL_SAVINGS_GOALS = [
  { id: 'goal-1', title: 'Fonds de Sécurité',  currentAmount: 6500, targetAmount: 10000, deadline: '2026-12-31', color: '#10b981', icon: 'shield-check' },
  { id: 'goal-2', title: 'Voyage au Japon',     currentAmount: 2400, targetAmount: 4000,  deadline: '2027-04-15', color: '#ec4899', icon: 'plane' },
  { id: 'goal-3', title: 'Nouveau MacBook Pro', currentAmount: 1200, targetAmount: 2500,  deadline: '2026-11-20', color: '#6366f1', icon: 'laptop' },
];

export const INITIAL_SUBSCRIPTIONS = [
  { id: 'sub-1', name: 'Netflix Premium',       amount: 19.99, cycle: 'monthly', billingDay: 4,  category: 'cat-subs',   icon: 'tv'       },
  { id: 'sub-2', name: 'Spotify Family',         amount: 17.99, cycle: 'monthly', billingDay: 12, category: 'cat-subs',   icon: 'music'    },
  { id: 'sub-3', name: 'Basic-Fit Privilège',    amount: 29.90, cycle: 'monthly', billingDay: 5,  category: 'cat-health', icon: 'activity' },
  { id: 'sub-4', name: 'Fibre Bouygues Telecom', amount: 32.99, cycle: 'monthly', billingDay: 15, category: 'cat-housing',icon: 'wifi'     },
  { id: 'sub-5', name: 'iCloud 2TB',             amount: 9.99,  cycle: 'monthly', billingDay: 28, category: 'cat-tech',   icon: 'cloud'    },
];
