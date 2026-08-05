// src/components/Sidebar/Sidebar.jsx
import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import Icon from '../Icon/Icon';
import styles from './Sidebar.module.scss';

const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Tableau de bord',      icon: 'home'       },
  { id: 'transactions',  label: 'Transactions',          icon: 'wallet'     },
  { id: 'budgets',       label: 'Budgets Mensuels',      icon: 'pie-chart'  },
  { id: 'savings',       label: "Objectifs d'Épargne",   icon: 'piggy-bank' },
  { id: 'subscriptions', label: 'Abonnements',           icon: 'tv'         },
  { id: 'analytics',     label: 'Analyses Détaillées',   icon: 'activity'   },
  { id: 'settings',      label: 'Paramètres',            icon: 'settings'   },
];

export default function Sidebar() {
  const { activeTab, setActiveTab } = useFinance();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandIcon}>
          <Icon name="wallet" size={22} />
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandTitle}>SAFinance</span>
          <span className={styles.brandBadge}>PRO</span>
        </div>
      </div>

      <nav>
        <ul className={styles.navList}>
          {NAV_ITEMS.map(item => (
            <li
              key={item.id}
              className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon name={item.icon} size={18} className={styles.navIcon} />
              <span className={styles.navLabel}>{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>

    </aside>
  );
}
