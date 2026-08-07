// src/views/Subscriptions/Subscriptions.jsx
import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import Icon from '../../components/Icon/Icon';

export default function Subscriptions() {
  const { subscriptions, formatCurrency, deleteSubscription, setEditingItem, setModalType, setIsModalOpen } = useFinance();
  const total = subscriptions.reduce((s, sub) => s + Number(sub.amount), 0);

  const handleEdit = (sub) => {
    setEditingItem(sub);
    setModalType('subscription');
    setIsModalOpen(true);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', width: '100%' }}>
        <div className="metric-card" style={{ width: '100%' }}>
          <div className="metric-header">
            <span className="metric-title">Coût Fixe Mensuel</span>
            <div className="metric-icon" style={{ background: 'var(--accent-primary-light)', color: 'var(--accent-primary)' }}>
              <Icon name="tv" size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-primary)' }}>{formatCurrency(total)}</div>
          <div className="metric-footer">
            <span>{subscriptions.length} abonnements actifs</span>
          </div>
        </div>
      </div>

      <div className="subs-grid">
        {subscriptions.map(sub => (
          <div key={sub.id} className="card" style={{ gap: '1rem' }}>
            <div className="card-header" style={{ margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <div className="metric-icon" style={{ background: 'var(--accent-primary-light)', color: 'var(--accent-primary)' }}><Icon name={sub.icon || 'tv'} size={20} /></div>
                <div>
                  <h3 className="card-title">{sub.name}</h3>
                  <span className="card-subtitle">Prélèvement le {sub.billingDay} du mois</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                <button
                  className="icon-button"
                  onClick={() => handleEdit(sub)}
                  title="Modifier l'abonnement et le montant"
                >
                  <Icon name="edit" size={15} color="var(--accent-primary)" />
                </button>
                <button
                  className="icon-button"
                  onClick={() => deleteSubscription(sub.id)}
                  title="Supprimer l'abonnement"
                >
                  <Icon name="trash" size={15} color="var(--accent-danger)" />
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,.05)', color: 'var(--text-secondary)' }}>Mensuel</span>
              <span
                style={{ fontSize: '1.3rem', fontWeight: 800, cursor: 'pointer' }}
                onClick={() => handleEdit(sub)}
                title="Cliquer pour modifier le montant"
              >
                {formatCurrency(sub.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

