// src/views/Savings/Savings.jsx
import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import Icon from '../../components/Icon/Icon';

export default function Savings() {
  const { savingsGoals, formatCurrency, deleteSavingsGoal, setEditingItem, setModalType, setIsModalOpen } = useFinance();

  const deposit = goal => { setEditingItem(goal); setModalType('deposit'); setIsModalOpen(true); };

  return (
    <div className="savings-grid">
      {savingsGoals.map(goal => {
        const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
        return (
          <div key={goal.id} className="card" style={{ gap: '1.2rem' }}>
            <div className="card-header" style={{ margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <div className="metric-icon" style={{ background: `${goal.color}22`, color: goal.color }}><Icon name={goal.icon || 'piggy-bank'} size={22} /></div>
                <div><h3 className="card-title">{goal.title}</h3><span className="card-subtitle">Échéance: {goal.deadline}</span></div>
              </div>
              <button className="icon-button" onClick={() => deleteSavingsGoal(goal.id)}><Icon name="trash" size={15} color="var(--accent-danger)" /></button>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.3rem' }}>
                <span style={{ fontSize: '.84rem', color: 'var(--text-muted)' }}>Épargné</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: goal.color }}>{formatCurrency(goal.currentAmount)}</span>
              </div>
              <div className="progress-bar-bg" style={{ height: 12 }}>
                <div className="progress-bar-fill" style={{ width: `${pct}%`, backgroundColor: goal.color }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.3rem', fontSize: '.78rem', color: 'var(--text-muted)' }}>
                <span>{pct}% atteint</span><span>Objectif: {formatCurrency(goal.targetAmount)}</span>
              </div>
            </div>
            <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={() => deposit(goal)}>
              <Icon name="plus" size={16} /><span>Alimenter</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
