// src/components/Modal/Modal.jsx
import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Icon from '../Icon/Icon';

// ── Transaction Form ─────────────────────────────────────
function TransactionForm({ item, onClose }) {
  const { categories, addTransaction, updateTransaction } = useFinance();
  const [type, setType]         = useState(item?.type || 'expense');
  const [title, setTitle]       = useState(item?.title || '');
  const [amount, setAmount]     = useState(item?.amount || '');
  const [category, setCategory] = useState(item?.category || categories[0]?.id);
  const [date, setDate]         = useState(item?.date || new Date().toISOString().split('T')[0]);
  const [note, setNote]         = useState(item?.note || '');

  const submit = e => {
    e.preventDefault();
    if (!title || !amount) return;
    const data = { title, amount: Number(amount), type, category, date, note, account: 'acc-main' };
    item ? updateTransaction(item.id, data) : addTransaction(data);
    onClose();
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="type-toggle">
        <button type="button" className={`type-toggle-btn ${type === 'expense' ? 'active-expense' : ''}`} onClick={() => setType('expense')}>Dépense</button>
        <button type="button" className={`type-toggle-btn ${type === 'income'  ? 'active-income'  : ''}`} onClick={() => setType('income')}>Revenu</button>
      </div>
      <div className="form-group">
        <label className="form-label">Titre de l'opération</label>
        <input className="form-input" type="text" placeholder="ex: Courses Carrefour" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Montant (€)</label>
          <input className="form-input" type="number" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Catégorie</label>
        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
          {categories.filter(c => c.type === type).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Note (optionnel)</label>
        <input className="form-input" type="text" placeholder="Détails…" value={note} onChange={e => setNote(e.target.value)} />
      </div>
      <button className="btn-primary" type="submit" style={{ justifyContent: 'center' }}>
        {item ? 'Enregistrer les modifications' : 'Ajouter la transaction'}
      </button>
    </form>
  );
}

// ── Budget Form ───────────────────────────────────────────
function BudgetForm({ item, onClose }) {
  const { categories, updateBudget } = useFinance();
  const [categoryId, setCategoryId] = useState(item?.categoryId || categories[0]?.id);
  const [target, setTarget]         = useState(item?.target || '');
  const submit = e => { e.preventDefault(); if (!target) return; updateBudget(categoryId, target); onClose(); };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="form-group">
        <label className="form-label">Catégorie</label>
        <select className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          {categories.filter(c => c.type === 'expense').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Plafond Mensuel (€)</label>
        <input className="form-input" type="number" step="10" placeholder="400" value={target} onChange={e => setTarget(e.target.value)} required />
      </div>
      <button className="btn-primary" type="submit" style={{ justifyContent: 'center' }}>Définir le plafond</button>
    </form>
  );
}

// ── Savings Form ──────────────────────────────────────────
function SavingsForm({ onClose }) {
  const { addSavingsGoal } = useFinance();
  const [title, setTitle]             = useState('');
  const [targetAmount, setTarget]     = useState('');
  const [currentAmount, setCurrent]   = useState('0');
  const [deadline, setDeadline]       = useState('2026-12-31');
  const submit = e => {
    e.preventDefault();
    if (!title || !targetAmount) return;
    addSavingsGoal({ title, targetAmount: Number(targetAmount), currentAmount: Number(currentAmount), deadline, color: '#6366f1', icon: 'piggy-bank' });
    onClose();
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="form-group"><label className="form-label">Nom du Projet</label><input className="form-input" type="text" placeholder="ex: Voyage Japon" value={title} onChange={e => setTitle(e.target.value)} required /></div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Objectif (€)</label><input className="form-input" type="number" placeholder="2000" value={targetAmount} onChange={e => setTarget(e.target.value)} required /></div>
        <div className="form-group"><label className="form-label">Déjà Épargné (€)</label><input className="form-input" type="number" value={currentAmount} onChange={e => setCurrent(e.target.value)} /></div>
      </div>
      <div className="form-group"><label className="form-label">Date limite</label><input className="form-input" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required /></div>
      <button className="btn-primary" type="submit" style={{ justifyContent: 'center' }}>Créer l'objectif</button>
    </form>
  );
}

// ── Deposit Form ──────────────────────────────────────────
function DepositForm({ goal, onClose }) {
  const { depositToGoal } = useFinance();
  const [amount, setAmount] = useState('');
  const submit = e => { e.preventDefault(); if (!amount || !goal) return; depositToGoal(goal.id, amount); onClose(); };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="form-group"><label className="form-label">Montant à verser (€)</label><input className="form-input" type="number" step="5" placeholder="100.00" value={amount} onChange={e => setAmount(e.target.value)} required /></div>
      <button className="btn-primary" type="submit" style={{ justifyContent: 'center' }}>Valider le versement</button>
    </form>
  );
}

// ── Subscription Form ─────────────────────────────────────
function SubscriptionForm({ onClose }) {
  const { addSubscription } = useFinance();
  const [name, setName]           = useState('');
  const [amount, setAmount]       = useState('');
  const [billingDay, setBilling]  = useState('5');
  const submit = e => { e.preventDefault(); if (!name || !amount) return; addSubscription({ name, amount: Number(amount), billingDay: Number(billingDay), cycle: 'monthly', icon: 'tv' }); onClose(); };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="form-group"><label className="form-label">Nom du Service</label><input className="form-input" type="text" placeholder="ex: Spotify" value={name} onChange={e => setName(e.target.value)} required /></div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Prix Mensuel (€)</label><input className="form-input" type="number" step="0.01" placeholder="9.99" value={amount} onChange={e => setAmount(e.target.value)} required /></div>
        <div className="form-group"><label className="form-label">Jour du prélèvement</label><input className="form-input" type="number" min="1" max="31" value={billingDay} onChange={e => setBilling(e.target.value)} required /></div>
      </div>
      <button className="btn-primary" type="submit" style={{ justifyContent: 'center' }}>Ajouter l'abonnement</button>
    </form>
  );
}

// ── History Form / Viewer ──────────────────────────────────
function HistoryModalContent({ item, onClose }) {
  const historyList = Array.isArray(item?.history) ? item.history : [];

  const getActionBadge = (action) => {
    switch (action) {
      case 'created':
        return { label: 'Création', color: 'var(--accent-success)', icon: 'plus' };
      case 'modified':
        return { label: 'Modification', color: '#818cf8', icon: 'edit' };
      case 'deleted':
        return { label: 'Suppression (Corbeille)', color: 'var(--accent-danger)', icon: 'trash' };
      case 'restored':
        return { label: 'Restauration', color: 'var(--accent-success)', icon: 'rotate-ccw' };
      default:
        return { label: 'Action', color: 'var(--text-muted)', icon: 'clock' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <div style={{ padding: '.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{item?.title}</div>
        <div style={{ fontSize: '.84rem', color: 'var(--text-muted)', marginTop: '.25rem' }}>
          Date: {item?.date} | Montant: {item?.amount} €
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
        <h4 style={{ fontSize: '.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: 0 }}>
          Journal chronologique ({historyList.length} action(s))
        </h4>

        {historyList.length === 0 ? (
          <p style={{ fontSize: '.88rem', color: 'var(--text-muted)' }}>Aucun historique disponible pour cette transaction.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
            {historyList.map((h, i) => {
              const badge = getActionBadge(h.action);
              return (
                <div key={i} style={{ display: 'flex', gap: '.85rem', alignItems: 'flex-start', paddingBottom: '.75rem', borderBottom: i < historyList.length - 1 ? '1px dashed var(--border-color)' : 'none' }}>
                  <div style={{ background: `${badge.color}22`, color: badge.color, borderRadius: '50%', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 28, height: 28 }}>
                    <Icon name={badge.icon} size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '.88rem', color: badge.color }}>{badge.label}</span>
                      <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{h.date}</span>
                    </div>
                    {h.note && <div style={{ fontSize: '.84rem', color: 'var(--text-secondary)', marginTop: '.15rem' }}>{h.note}</div>}
                    {h.details && (
                      <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginTop: '.3rem', background: 'rgba(0,0,0,0.2)', padding: '.4rem .6rem', borderRadius: 4 }}>
                        {h.details}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button className="btn-secondary" onClick={onClose} style={{ alignSelf: 'flex-end', marginTop: '.5rem' }}>
        Fermer
      </button>
    </div>
  );
}

// ── Modal Manager ─────────────────────────────────────────
const TITLES = {
  transaction:  item => item ? 'Modifier Transaction' : 'Nouvelle Transaction',
  budget:       () => 'Définir un Budget',
  savings:      () => "Nouveau Projet d'Épargne",
  subscription: () => 'Ajouter un Abonnement',
  deposit:      item => `Déposer sur ${item?.title || ''}`,
  history:      item => `Historique d'Activité: ${item?.title || ''}`,
};

export default function Modal() {
  const { isModalOpen, setIsModalOpen, modalType, editingItem } = useFinance();
  if (!isModalOpen) return null;
  const close = () => setIsModalOpen(false);

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{TITLES[modalType]?.(editingItem) || 'Nouveau'}</h3>
          <button className="icon-button" onClick={close}><Icon name="x" size={18} /></button>
        </div>
        {modalType === 'transaction'  && <TransactionForm  item={editingItem} onClose={close} />}
        {modalType === 'budget'       && <BudgetForm       item={editingItem} onClose={close} />}
        {modalType === 'savings'      && <SavingsForm      onClose={close} />}
        {modalType === 'deposit'      && <DepositForm      goal={editingItem} onClose={close} />}
        {modalType === 'subscription' && <SubscriptionForm onClose={close} />}
        {modalType === 'history'      && <HistoryModalContent item={editingItem} onClose={close} />}
      </div>
    </div>
  );
}

