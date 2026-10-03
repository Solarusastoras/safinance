// src/views/Analytics/Analytics.jsx
import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useFinance } from '../../context/FinanceContext';
import Icon from '../../components/Icon/Icon';

Chart.register(...registerables);

export default function Analytics() {
  const { metrics, formatCurrency, transactions, categories, savingsGoals, subscriptions } = useFinance();
  const trendChartRef = useRef(null);
  const breakdownChartRef = useRef(null);
  const chartInstances = useRef({ trend: null, breakdown: null });

  const activeTransactions = useMemo(() => transactions.filter(t => !t.isDeleted), [transactions]);

  const categoryBreakdown = useMemo(() => {
    const expensesByCategory = {};
    activeTransactions.filter(t => t.type === 'expense').forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Number(t.amount || 0);
    });

    return Object.entries(expensesByCategory).map(([id, amount]) => {
      const cat = categories.find(c => c.id === id) || { name: 'Autre', color: '#94a3b8', icon: 'wallet' };
      const pct = metrics.totalExpense > 0 ? (amount / metrics.totalExpense) * 100 : 0;
      return { ...cat, amount, pct };
    }).sort((a, b) => b.amount - a.amount);
  }, [activeTransactions, categories, metrics.totalExpense]);

  const monthlySubTotal = useMemo(() => {
    return subscriptions.reduce((acc, s) => acc + Number(s.amount || 0), 0);
  }, [subscriptions]);

  const netSavingsPotential = useMemo(() => {
    const net = metrics.totalIncome - metrics.totalExpense;
    return net > 0 ? net : 0;
  }, [metrics.totalIncome, metrics.totalExpense]);

  const monthlyTrendData = useMemo(() => {
    const monthsMap = {};

    activeTransactions.forEach(t => {
      if (!t.date) return;
      const monthKey = t.date.slice(0, 7); // 'YYYY-MM'
      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        monthsMap[monthKey].income += Number(t.amount || 0);
      } else if (t.type === 'expense') {
        monthsMap[monthKey].expense += Number(t.amount || 0);
      }
    });

    const sortedMonthKeys = Object.keys(monthsMap).sort();

    if (sortedMonthKeys.length === 0) {
      const nowMonth = new Date().toISOString().slice(0, 7);
      sortedMonthKeys.push(nowMonth);
      monthsMap[nowMonth] = { income: metrics.totalIncome, expense: metrics.totalExpense };
    }

    const monthNames = {
      '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr',
      '05': 'Mai', '06': 'Juin', '07': 'Juil', '08': 'Août',
      '09': 'Sept', '10': 'Oct', '11': 'Nov', '12': 'Déc'
    };

    const labels = sortedMonthKeys.map(key => {
      const parts = key.split('-');
      const m = parts[1];
      return monthNames[m] ? `${monthNames[m]} ${parts[0]}` : key;
    });

    const savingsData = sortedMonthKeys.map(k => Math.max(0, monthsMap[k].income - monthsMap[k].expense));
    const expenseData = sortedMonthKeys.map(k => monthsMap[k].expense);

    return { labels, savingsData, expenseData };
  }, [activeTransactions, metrics]);

  useEffect(() => {
    // Trend Line Chart
    if (trendChartRef.current) {
      if (chartInstances.current.trend) {
        chartInstances.current.trend.destroy();
      }
      chartInstances.current.trend = new Chart(trendChartRef.current, {
        type: 'line',
        data: {
          labels: monthlyTrendData.labels,
          datasets: [
            {
              label: 'Épargne Réalisée (€)',
              data: monthlyTrendData.savingsData,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              fill: true,
              tension: 0.35,
              borderWidth: 2.5,
              pointRadius: 4,
              pointBackgroundColor: '#10b981',
            },
            {
              label: 'Charges & Dépenses (€)',
              data: monthlyTrendData.expenseData,
              borderColor: '#f43f5e',
              backgroundColor: 'rgba(244, 63, 94, 0.08)',
              fill: true,
              tension: 0.35,
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: '#f43f5e',
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          plugins: {
            legend: {
              labels: { color: '#93c5fd', font: { family: 'Plus Jakarta Sans', weight: '600' } }
            }
          },
          scales: {
            x: { ticks: { color: '#4e7098' }, grid: { display: false } },
            y: { ticks: { color: '#4e7098' }, grid: { color: 'rgba(255,255,255,0.04)' } },
          },
        },
      });
    }

    // Category Breakdown Radar/Polar Chart
    if (breakdownChartRef.current) {
      if (chartInstances.current.breakdown) {
        chartInstances.current.breakdown.destroy();
      }
      const topCategories = categoryBreakdown.slice(0, 6);
      chartInstances.current.breakdown = new Chart(breakdownChartRef.current, {
        type: 'polarArea',
        data: {
          labels: topCategories.map(c => c.name),
          datasets: [{
            data: topCategories.map(c => c.amount),
            backgroundColor: topCategories.map(c => `${c.color}bb`),
            borderColor: 'transparent',
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          plugins: {
            legend: { position: 'bottom', labels: { color: '#93c5fd', boxWidth: 12, padding: 12 } }
          },
          scales: {
            r: {
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { display: false },
              angleLines: { color: 'rgba(255,255,255,0.06)' }
            }
          }
        },
      });
    }

    const currentCharts = chartInstances.current;
    return () => {
      currentCharts.trend?.destroy();
      currentCharts.breakdown?.destroy();
    };
  }, [monthlyTrendData, categoryBreakdown]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Analytics KPI Top Bar */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Capacité d'Épargne</span>
            <div className="metric-icon" style={{ background: 'var(--accent-success-light)', color: 'var(--accent-success)' }}>
              <Icon name="trending-up" size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-success)' }}>
            {formatCurrency(netSavingsPotential)}
          </div>
          <div className="metric-footer">
            <span>Solde net disponible ce mois</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Abonnements Fixes</span>
            <div className="metric-icon" style={{ background: 'var(--accent-primary-light)', color: 'var(--accent-primary)' }}>
              <Icon name="tv" size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-primary)' }}>
            {formatCurrency(monthlySubTotal)}
          </div>
          <div className="metric-footer">
            <span>{subscriptions.length} prélèvements récurrents</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Objectifs en cours</span>
            <div className="metric-icon" style={{ background: 'var(--accent-info-light)', color: 'var(--accent-info)' }}>
              <Icon name="piggy-bank" size={20} />
            </div>
          </div>
          <div className="metric-value">
            {formatCurrency(metrics.totalSavings)}
          </div>
          <div className="metric-footer">
            <span>{savingsGoals.length} projets d'épargne actifs</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Volume Transactions</span>
            <div className="metric-icon" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
              <Icon name="history" size={20} />
            </div>
          </div>
          <div className="metric-value">
            {activeTransactions.length}
          </div>
          <div className="metric-footer">
            <span>Opérations enregistrées</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Évolution Trésorerie & Dépenses</h3>
              <span className="card-subtitle">Projection sur les 6 derniers mois</span>
            </div>
          </div>
          <div className="chart-container">
            <canvas ref={trendChartRef} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Distribution par Catégorie</h3>
              <span className="card-subtitle">Répartition relative des postes de dépense</span>
            </div>
          </div>
          <div className="chart-container">
            <canvas ref={breakdownChartRef} />
          </div>
        </div>
      </div>

      {/* Spending Breakdown Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Détail des Dépenses par Catégorie</h3>
          <span className="card-subtitle">{categoryBreakdown.length} catégories identifiées</span>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Part du Budget</th>
                <th>Total Dépensé</th>
                <th style={{ textAlign: 'right' }}>Progression</th>
              </tr>
            </thead>
            <tbody>
              {categoryBreakdown.map(cat => (
                <tr key={cat.id || cat.name}>
                  <td>
                    <span className="category-pill" style={{ color: cat.color }}>
                      <Icon name={cat.icon || 'wallet'} size={14} />
                      {cat.name}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    {cat.pct.toFixed(1)}%
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                    {formatCurrency(cat.amount)}
                  </td>
                  <td style={{ minWidth: 140 }}>
                    <div className="progress-bar-bg" style={{ height: 8 }}>
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${Math.min(100, cat.pct)}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
