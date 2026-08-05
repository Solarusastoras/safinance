// src/components/Footer/Footer.jsx
import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import styles from './Footer.module.scss';

export default function Footer() {
  const { metrics, formatCurrency } = useFinance();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.summary}>
          <span className={styles.label}>Solde</span>
          <span className={styles.value}>{formatCurrency(metrics.balance)}</span>
        </div>
        <div className={styles.summary}>
          <span className={styles.label}>Revenus</span>
          <span className={styles.valueIncome}>{formatCurrency(metrics.totalIncome)}</span>
        </div>
        <div className={styles.summary}>
          <span className={styles.label}>Dépenses</span>
          <span className={styles.valueExpense}>{formatCurrency(metrics.totalExpense)}</span>
        </div>
        <span className={styles.copy}>© {year} SAFinance — Tous droits réservés</span>
      </div>
    </footer>
  );
}
