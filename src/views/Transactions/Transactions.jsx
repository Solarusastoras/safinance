// src/views/Transactions/Transactions.jsx
import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Icon from '../../components/Icon/Icon';

export default function Transactions() {
  const { transactions, categories, formatCurrency, searchQuery, deleteTransaction, setEditingItem, setModalType, setIsModalOpen } = useFinance();
  const [selCat, setSelCat] = useState('all');
  const [selType, setSelType] = useState('all');

  const filtered = useMemo(() => transactions.filter(t => {
    const q = searchQuery.toLowerCase();
    return (t.title.toLowerCase().includes(q) || (t.note && t.note.toLowerCase().includes(q)))
      && (selCat === 'all' || t.category === selCat)
      && (selType === 'all' || t.type === selType);
  }), [transactions, searchQuery, selCat, selType]);

  const edit = tx => { setEditingItem(tx); setModalType('transaction'); setIsModalOpen(true); };

  return (
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
        </div>
        <span style={{ fontSize: '.84rem', color: 'var(--text-muted)' }}>{filtered.length} opération(s)</span>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>Date</th><th>Titre</th><th>Catégorie</th><th>Type</th><th>Montant</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6"><div className="empty-state"><Icon name="search" size={36} /><p>Aucune transaction trouvée.</p></div></td></tr>
            ) : filtered.map(tx => {
              const cat = categories.find(c => c.id === tx.category) || { name: 'Général', color: '#94a3b8', icon: 'wallet' };
              return (
                <tr key={tx.id}>
                  <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{tx.date}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700 }}>{tx.title}</span>
                      {tx.note && <span style={{ fontSize: '.76rem', color: 'var(--text-muted)' }}>{tx.note}</span>}
                    </div>
                  </td>
                  <td><span className="category-pill" style={{ color: cat.color }}><Icon name={cat.icon} size={13} />{cat.name}</span></td>
                  <td><span className={`badge ${tx.type === 'income' ? 'trend-up' : 'trend-down'}`}>{tx.type === 'income' ? 'Revenu' : 'Dépense'}</span></td>
                  <td className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.4rem' }}>
                      <button className="icon-button" onClick={() => edit(tx)}><Icon name="edit" size={15} /></button>
                      <button className="icon-button" onClick={() => deleteTransaction(tx.id)}><Icon name="trash" size={15} color="var(--accent-danger)" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
