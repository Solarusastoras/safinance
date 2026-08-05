// src/views/Settings/Settings.jsx
import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import Icon from '../../components/Icon/Icon';

export default function Settings() {
  const { theme, setTheme, currency, setCurrency, resetData } = useFinance();
  return (
    <div className="card" style={{ maxWidth: 600, gap: '1.5rem' }}>
      <h3 className="card-title">Préférences de l'application</h3>
      <div className="form-group">
        <label className="form-label">Thème Visuel</label>
        <select className="form-select" value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="metallic">🏎️ Bleu Métallique</option>
          <option value="dark">🌙 Sombre</option>
          <option value="light">☀️ Clair</option>
          <option value="forest">🌿 Forêt</option>
          <option value="sunset">🌅 Sunset</option>
          <option value="galaxy">🪐 Galaxie</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Devise Principale</label>
        <select className="form-select" value={currency} onChange={e => setCurrency(e.target.value)}>
          <option value="EUR">Euro (€)</option>
          <option value="USD">Dollar US ($)</option>
          <option value="GBP">Livre Sterling (£)</option>
          <option value="CHF">Franc Suisse (CHF)</option>
        </select>
      </div>
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-danger)', marginBottom: '.75rem' }}>Zone de Danger</h4>
        <button className="btn-secondary" style={{ borderColor: 'var(--accent-danger)', color: 'var(--accent-danger)' }} onClick={resetData}>
          <Icon name="rotate-ccw" size={16} /><span>Réinitialiser les données</span>
        </button>
      </div>
    </div>
  );
}
