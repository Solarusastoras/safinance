// src/views/Budgets/Budgets.jsx
import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import Icon from '../../components/Icon/Icon';

export default function Budgets() {
  const { budgets, categories, transactions, formatCurrency, setEditingItem, setModalType, setIsModalOpen } = useFinance();

  const edit = (cat, bgt) => { setEditingItem({ categoryId: cat.id, target: bgt.target }); setModalType('budget'); setIsModalOpen(true); };

  return (
    <div className="budgets-grid">
      {categories.filter(c => c.type === 'expense').map(cat => {
        const bgt = budgets.find(b => b.categoryId === cat.id) || { target: 0 };
        const spent = transactions.filter(t => !t.isDeleted && t.type === 'expense' && t.category === cat.id).reduce((s, t) => s + Number(t.amount), 0);
        const pct = bgt.target > 0 ? Math.round((spent / bgt.target) * 100) : 0;
        const remaining = bgt.target - spent;
        let status = 'Budget respecté'; let barColor = 'var(--accent-success)';
        if (pct > 75) { status = 'Attention (75%)'; barColor = 'var(--accent-warning)'; }
        if (pct >= 95) { status = 'Budget dépassé !'; barColor = 'var(--accent-danger)'; }

        return (
          <div key={cat.id} className="card" style={{ gap: '1rem' }}>
            <div className="card-header" style={{ margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <div className="metric-icon" style={{ background: `${cat.color}22`, color: cat.color }}><Icon name={cat.icon} size={20} /></div>
                <div><h3 className="card-title">{cat.name}</h3><span className="card-subtitle">{status}</span></div>
              </div>
              <button className="icon-button" onClick={() => edit(cat, bgt)}><Icon name="edit" size={15} /></button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontSize: '.76rem', color: 'var(--text-muted)' }}>Dépensé</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{formatCurrency(spent)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '.76rem', color: 'var(--text-muted)' }}>Plafond</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{bgt.target > 0 ? formatCurrency(bgt.target) : 'Non défini'}</div>
              </div>
            </div>
            {bgt.target > 0 && (
              <>
                <div className="progress-bar-bg" style={{ height: 10 }}>
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, pct)}%`, backgroundColor: barColor }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', color: 'var(--text-muted)' }}>
                  <span>{pct}% utilisé</span>
                  <span style={{ color: remaining < 0 ? 'var(--accent-danger)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {remaining < 0 ? `Dépassement: ${formatCurrency(Math.abs(remaining))}` : `Reste: ${formatCurrency(remaining)}`}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
