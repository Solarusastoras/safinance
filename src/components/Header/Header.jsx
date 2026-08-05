// src/components/Header/Header.jsx
import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import Icon from '../Icon/Icon';
import styles from './Header.module.scss';

const TAB_TITLES = {
  dashboard:     'Aperçu Général',
  transactions:  'Historique des Transactions',
  budgets:       'Suivi des Budgets',
  savings:       'Mes Tirelires & Projets',
  subscriptions: 'Charges Fixes & Abonnements',
  analytics:     'Rapports & Statistiques',
  settings:      'Préférences & Configuration',
};

export default function Header() {
  const { theme, setTheme, searchQuery, setSearchQuery, activeTab,
          setModalType, setIsModalOpen, setEditingItem } = useFinance();

  const cycleTheme = () => {
    const next = { metallic: 'dark', dark: 'light', light: 'forest', forest: 'sunset', sunset: 'galaxy', galaxy: 'metallic' };
    setTheme(next[theme] || 'metallic');
  };

  const getThemeIcon = (t) => {
    switch (t) {
      case 'light': return 'sun';
      case 'dark': return 'moon';
      case 'forest': return 'cloud';
      case 'sunset': return 'trending-up';
      case 'galaxy': return 'pie-chart';
      default: return 'activity';
    }
  };

  const handleNew = () => {
    setEditingItem(null);
    const typeMap = { budgets: 'budget', savings: 'savings', subscriptions: 'subscription' };
    setModalType(typeMap[activeTab] || 'transaction');
    setIsModalOpen(true);
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{TAB_TITLES[activeTab]}</h1>
        <span className={styles.subtitle}>Bienvenue sur votre gestionnaire financier</span>
      </div>

      <div className={styles.actions}>
        <label className={styles.searchBox}>
          <Icon name="search" size={16} />
          <input
            type="text"
            placeholder="Rechercher…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </label>

        <button className={styles.iconBtn} onClick={cycleTheme} title={`Thème: ${theme}`}>
          <Icon name={getThemeIcon(theme)} size={18} />
        </button>

        <button className={styles.btnPrimary} onClick={handleNew}>
          <Icon name="plus" size={18} />
          <span>Nouveau</span>
        </button>
      </div>
    </header>
  );
}
