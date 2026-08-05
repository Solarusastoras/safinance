// src/views/Transactions/Transactions.jsx
import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Icon from '../../components/Icon/Icon';

export default function Transactions() {
  const {
    transactions, categories, formatCurrency, searchQuery,
    deleteTransaction, restoreTransaction, permanentDeleteTransaction,
    setEditingItem, setModalType, setIsModalOpen
  } = useFinance();

  const [selCat, setSelCat] = useState('all');
  const [selType, setSelType] = useState('all');
  const [selStatus, setSelStatus] = useState('active');

  const counts = useMemo(() => {
    return {
      active: transactions.filter(t => !t.isDeleted).length,
      modified: transactions.filter(t => t.isModified && !t.isDeleted).length,
      deleted: transactions.filter(t => t.isDeleted).length,
      all: transactions.length,
    };
  }, [transactions]);

  const filtered = useMemo(() => transactions.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = t.title.toLowerCase().includes(q) || (t.note && t.note.toLowerCase().includes(q));
    const matchesCat = selCat === 'all' || t.category === selCat;
    const matchesType = selType === 'all' || t.type === selType;

    let matchesStatus = true;
    if (selStatus === 'active') matchesStatus = !t.isDeleted;
    else if (selStatus === 'modified') matchesStatus = t.isModified && !t.isDeleted;
    else if (selStatus === 'deleted') matchesStatus = t.isDeleted;
    else if (selStatus === 'all') matchesStatus = true;

    return matchesSearch && matchesCat && matchesType && matchesStatus;
  }), [transactions, searchQuery, selCat, selType, selStatus]);

  const edit = tx => { setEditingItem(tx); setModalType('transaction'); setIsModalOpen(true); };
  const showHistory = tx => { setEditingItem(tx); setModalType('history'); setIsModalOpen(true); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Status Bar Pills */}
      <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
        {[
          { id: 'active', label: 'Actives', count: counts.active, icon: 'check' },
          { id: 'modified', label: 'Modifiées', count: counts.modified, icon: 'edit' },
          { id: 'deleted', label: 'Corbeille', count: counts.deleted, icon: 'trash' },
          { id: 'all', label: 'Toutes les opérations', count: counts.all, icon: 'history' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelStatus(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '.5rem',
              padding: '.55rem 1rem', borderRadius: '8px', border: '1px solid',
              borderColor: selStatus === tab.id ? 'var(--accent-primary)' : 'var(--border-color)',
              background: selStatus === tab.id ? 'var(--accent-primary-light)' : 'rgba(255,255,255,0.02)',
              color: selStatus === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: selStatus === tab.id ? 700 : 500,
              fontSize: '.85rem', cursor: 'pointer', transition: 'all .15s ease'
            }}
          >
            <Icon name={tab.icon} size={15} />
            <span>{tab.label}</span>
            <span style={{
              background: selStatus === tab.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
              color: selStatus === tab.id ? '#fff' : 'var(--text-muted)',
              padding: '.15rem .45rem', borderRadius: '12px', fontSize: '.75rem', fontWeight: 700
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <select className="form-select" style={{ width: 180 }} value={selCat} onChange={e => setSelCat(e.target.value)}>
              <option value="all">Toutes Catégories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="form-select" style={{ width: 140 }} value={selType} onChange={e => setSelType(e.target.value)}>
              <option value="all">Tous Types</option>
              <option value="expense">Dépenses</option>
              <option value="income">Revenus</option>
            </select>
            <select className="form-select" style={{ width: 180 }} value={selStatus} onChange={e => setSelStatus(e.target.value)}>
              <option value="active">Statut: Actives</option>
              <option value="modified">Statut: Modifiées</option>
              <option value="deleted">Statut: Corbeille</option>
              <option value="all">Statut: Tous statuts</option>
            </select>
          </div>
          <span style={{ fontSize: '.84rem', color: 'var(--text-muted)' }}>{filtered.length} opération(s) trouvée(s)</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Date</th><th>Titre & Statut</th><th>Catégorie</th><th>Type</th><th>Montant</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6"><div className="empty-state"><Icon name="search" size={36} /><p>Aucune transaction trouvée.</p></div></td></tr>
              ) : filtered.map(tx => {
                const cat = categories.find(c => c.id === tx.category) || { name: 'Général', color: '#94a3b8', icon: 'wallet' };
                return (
                  <tr key={tx.id} style={tx.isDeleted ? { opacity: 0.6, background: 'rgba(239, 68, 68, 0.03)' } : {}}>
                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{tx.date}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                          <span style={{ fontWeight: 700, textDecoration: tx.isDeleted ? 'line-through' : 'none' }}>{tx.title}</span>
                          {tx.isModified && !tx.isDeleted && (
                            <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontSize: '.72rem', display: 'inline-flex', alignItems: 'center', gap: '.25rem' }} title={`Modifié le ${tx.updatedAt || ''}`}>
                              <Icon name="edit" size={11} /> Modifiée
                            </span>
                          )}
                          {tx.isDeleted && (
                            <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontSize: '.72rem', display: 'inline-flex', alignItems: 'center', gap: '.25rem' }} title={`Supprimé le ${tx.deletedAt || ''}`}>
                              <Icon name="trash" size={11} /> Supprimée
                            </span>
                          )}
                        </div>
                        {tx.note && <span style={{ fontSize: '.76rem', color: 'var(--text-muted)' }}>{tx.note}</span>}
                      </div>
                    </td>
                    <td><span className="category-pill" style={{ color: cat.color }}><Icon name={cat.icon} size={13} />{cat.name}</span></td>
                    <td><span className={`badge ${tx.type === 'income' ? 'trend-up' : 'trend-down'}`}>{tx.type === 'income' ? 'Revenu' : 'Dépense'}</span></td>
                    <td className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.4rem' }}>
                        {!tx.isDeleted ? (
                          <>
                            <button className="icon-button" onClick={() => edit(tx)} title="Modifier"><Icon name="edit" size={15} /></button>
                            <button className="icon-button" onClick={() => showHistory(tx)} title="Historique d'activité"><Icon name="history" size={15} color="var(--accent-info)" /></button>
                            <button className="icon-button" onClick={() => deleteTransaction(tx.id)} title="Mettre à la corbeille"><Icon name="trash" size={15} color="var(--accent-danger)" /></button>
                          </>
                        ) : (
                          <>
                            <button className="icon-button" onClick={() => restoreTransaction(tx.id)} title="Restaurer"><Icon name="rotate-ccw" size={15} color="var(--accent-success)" /></button>
                            <button className="icon-button" onClick={() => showHistory(tx)} title="Historique d'activité"><Icon name="history" size={15} color="var(--accent-info)" /></button>
                            <button className="icon-button" onClick={() => permanentDeleteTransaction(tx.id)} title="Supprimer définitivement"><Icon name="x" size={15} color="var(--accent-danger)" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

