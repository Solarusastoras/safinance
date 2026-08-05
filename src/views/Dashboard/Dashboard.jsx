// src/views/Dashboard/Dashboard.jsx
import React, { useEffect, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import { useFinance } from '../../context/FinanceContext';
import Icon from '../../components/Icon/Icon';

Chart.register(...registerables);

export default function Dashboard() {
  const { metrics, formatCurrency, transactions, categories, budgets, setActiveTab } = useFinance();

  const categoryExpenses = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(map).map(([id, amount]) => {
      const cat = categories.find(c => c.id === id) || { name: 'Autre', color: '#94a3b8' };
      return { ...cat, amount };
    }).sort((a, b) => b.amount - a.amount);
  }, [transactions, categories]);

  useEffect(() => {
    const barEl = document.getElementById('cashFlowChart');
    if (!barEl) return;
    if (window._cashFlow) window._cashFlow.destroy();
    window._cashFlow = new Chart(barEl, {
      type: 'bar',
      data: {
        labels: ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août'],
        datasets: [
          { label: 'Revenus (€)', data: [2800,3100,2900,3400,3200,3350,3100,metrics.totalIncome], backgroundColor: '#10b981', borderRadius: 6 },
          { label: 'Dépenses (€)', data: [1900,2100,1850,2300,1950,2200,2050,metrics.totalExpense], backgroundColor: '#f43f5e', borderRadius: 6 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#93c5fd', font: { family: 'Plus Jakarta Sans', weight: '600' } } } },
        scales: {
          x: { ticks: { color: '#4e7098' }, grid: { display: false } },
          y: { ticks: { color: '#4e7098' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
      },
    });

    const donutEl = document.getElementById('categoryDonut');
    if (!donutEl) return;
    if (window._donut) window._donut.destroy();
    const top = categoryExpenses.slice(0, 5);
    window._donut = new Chart(donutEl, {
      type: 'doughnut',
      data: {
        labels: top.map(c => c.name),
        datasets: [{ data: top.map(c => c.amount), backgroundColor: top.map(c => c.color), borderWidth: 0 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '72%',
        plugins: { legend: { position: 'bottom', labels: { color: '#93c5fd', boxWidth: 12 } } },
      },
    });

    return () => {
      window._cashFlow?.destroy();
      window._donut?.destroy();
    };
  }, [metrics, categoryExpenses]);

  return (
    <div>
      {/* KPI Cards */}
      <div className="metrics-grid">
        {[
          { title: 'Solde Total',       value: formatCurrency(metrics.balance),     icon: 'wallet',         bg: 'var(--accent-primary-light)',  color: 'var(--accent-primary)' },
          { title: 'Revenus (Ce Mois)', value: formatCurrency(metrics.totalIncome), icon: 'arrow-up-right', bg: 'var(--accent-success-light)',  color: 'var(--accent-success)', valColor: 'var(--accent-success)' },
          { title: 'Dépenses (Ce Mois)',value: formatCurrency(metrics.totalExpense),icon: 'arrow-down-right',bg: 'var(--accent-danger-light)',   color: 'var(--accent-danger)',  valColor: 'var(--accent-danger)' },
          { title: "Taux d'Épargne",    value: `${metrics.savingsRate.toFixed(1)}%`,icon: 'piggy-bank',     bg: 'var(--accent-info-light)',     color: 'var(--accent-info)' },
        ].map((kpi, i) => (
          <div key={i} className="metric-card">
            <div className="metric-header">
              <span className="metric-title">{kpi.title}</span>
              <div className="metric-icon" style={{ background: kpi.bg, color: kpi.color }}>
                <Icon name={kpi.icon} size={20} />
              </div>
            </div>
            <div className="metric-value" style={kpi.valColor ? { color: kpi.valColor } : {}}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Flux de Trésorerie Mensuel</h3>
              <span className="card-subtitle">Comparatif Revenus vs Dépenses</span>
            </div>
          </div>
          <div className="chart-container"><canvas id="cashFlowChart" /></div>
        </div>
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Répartition des Dépenses</h3>
              <span className="card-subtitle">Top catégories ce mois</span>
            </div>
          </div>
          <div className="chart-container"><canvas id="categoryDonut" /></div>
        </div>
      </div>

      {/* Recent transactions + budget snapshot */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Dernières Transactions</h3>
            <button className="btn-secondary" onClick={() => setActiveTab('transactions')}>
              <span>Voir tout</span><Icon name="arrow-up-right" size={16} />
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>Intitulé</th><th>Catégorie</th><th>Date</th><th>Montant</th></tr></thead>
              <tbody>
                {transactions.slice(0, 5).map(tx => {
                  const cat = categories.find(c => c.id === tx.category) || { name: 'Général', color: '#94a3b8', icon: 'wallet' };
                  return (
                    <tr key={tx.id}>
                      <td style={{ fontWeight: 700 }}>{tx.title}</td>
                      <td><span className="category-pill" style={{ color: cat.color }}><Icon name={cat.icon} size={13} />{cat.name}</span></td>
                      <td style={{ color: 'var(--text-muted)' }}>{tx.date}</td>
                      <td className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Suivi des Budgets</h3>
            <button className="btn-secondary" onClick={() => setActiveTab('budgets')}>Gérer</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {budgets.slice(0, 4).map(bgt => {
              const cat = categories.find(c => c.id === bgt.categoryId) || { name: 'Cat.', color: '#6366f1' };
              const spent = transactions.filter(t => t.type === 'expense' && t.category === bgt.categoryId).reduce((s, t) => s + Number(t.amount), 0);
              const pct = Math.min(100, Math.round((spent / bgt.target) * 100));
              const barColor = pct >= 95 ? 'var(--accent-danger)' : pct > 75 ? 'var(--accent-warning)' : 'var(--accent-success)';
              return (
                <div key={bgt.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.84rem', marginBottom: '.3rem' }}>
                    <span style={{ fontWeight: 700, color: cat.color }}>{cat.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(spent)} / {formatCurrency(bgt.target)}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
