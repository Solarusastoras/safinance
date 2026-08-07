// src/views/Settings/Settings.jsx
import React, { useState, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Icon from '../../components/Icon/Icon';

export default function Settings() {
  const {
    theme, setTheme,
    currency, setCurrency,
    resetData,
    lastSaved,
    exportDataJSON,
    exportDataCSV,
    importDataJSON,
    transactions,
    budgets,
    savingsGoals,
    subscriptions,
  } = useFinance();

  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  const formatSavedDate = (isoString) => {
    if (!isoString) return 'Jamais';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (e) {
      return isoString;
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      const res = importDataJSON(content);
      if (res.success) {
        setNotification({
          type: 'success',
          message: `Restauration réussie ! ${res.count} élément(s) restauré(s).`,
        });
      } else {
        setNotification({
          type: 'error',
          message: `Échec de l'importation : ${res.error}`,
        });
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      setNotification({
        type: 'error',
        message: 'Impossible de lire le fichier.',
      });
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 680 }}>
      {/* ── Visual Preferences ── */}
      <div className="card" style={{ gap: '1.25rem' }}>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <Icon name="settings" size={20} />
          <span>Préférences de l'application</span>
        </h3>

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
      </div>

      {/* ── Data Backup & Persistence ── */}
      <div className="card" style={{ gap: '1.25rem' }}>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <Icon name="shield-check" size={20} color="var(--accent-success)" />
          <span>Sauvegarde & Restauration des Données</span>
        </h3>

        {/* Auto-save status banner */}
        <div style={{
          background: 'var(--accent-success-light, rgba(16, 185, 129, 0.1))',
          border: '1px solid var(--accent-success, #10b981)',
          borderRadius: 'var(--radius-md, 8px)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '.75rem'
        }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: 'var(--accent-success, #10b981)',
            boxShadow: '0 0 10px var(--accent-success, #10b981)',
            flexShrink: 0
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--text-primary)' }}>
              Sauvegarde Automatique Activée (LocalStorage)
            </div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Vos modifications sont automatiquement enregistrées dans votre navigateur.
              <br />
              <strong>Dernière sauvegarde :</strong> {formatSavedDate(lastSaved)}
            </div>
          </div>
        </div>

        {/* Summary counts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '.75rem',
          margin: '.5rem 0'
        }}>
          <div style={{ background: 'var(--bg-input)', padding: '.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{transactions.length}</div>
            <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Transactions</div>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{budgets.length}</div>
            <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Budgets</div>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{savingsGoals.length}</div>
            <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Projets / Épargnes</div>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{subscriptions.length}</div>
            <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Abonnements</div>
          </div>
        </div>

        {/* Notification Feedback */}
        {notification && (
          <div style={{
            padding: '.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '.85rem',
            fontWeight: 600,
            background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: notification.type === 'success' ? '#10b981' : '#ef4444',
            border: `1px solid ${notification.type === 'success' ? '#10b981' : '#ef4444'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 800 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Export & Import Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '.5rem' }}>
          <h4 style={{ fontSize: '.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Exportation & Importation Fichiers
          </h4>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={exportDataJSON} style={{ flex: 1, justifyContent: 'center' }}>
              <Icon name="download" size={16} />
              <span>Exporter Sauvegarde (JSON)</span>
            </button>
            <button className="btn-secondary" onClick={exportDataCSV} style={{ flex: 1, justifyContent: 'center' }}>
              <Icon name="file-text" size={16} />
              <span>Exporter Transactions (CSV)</span>
            </button>
          </div>

          <div style={{
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'center',
            background: 'var(--bg-input)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '.5rem'
          }}>
            <Icon name="upload" size={24} color="var(--accent-primary)" />
            <div style={{ fontSize: '.875rem', fontWeight: 600 }}>Importer une sauvegarde (Fichier JSON)</div>
            <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginBottom: '.5rem' }}>
              Restaurez la totalité de vos données à partir d'un fichier .json précédemment exporté.
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="json-upload-input"
            />
            <label htmlFor="json-upload-input" className="btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
              <Icon name="file-plus" size={16} />
              <span>Sélectionner un fichier .json</span>
            </label>
          </div>
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="card" style={{ gap: '1rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-danger)', margin: 0, display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <Icon name="alert-triangle" size={18} color="var(--accent-danger)" />
          <span>Zone de Danger</span>
        </h4>
        <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', margin: 0 }}>
          Réinitialisez vos données aux valeurs par défaut de démonstration. Nous vous recommandons d'exporter d'abord une sauvegarde.
        </p>
        <div>
          <button className="btn-secondary" style={{ borderColor: 'var(--accent-danger)', color: 'var(--accent-danger)' }} onClick={resetData}>
            <Icon name="rotate-ccw" size={16} />
            <span>Réinitialiser toutes les données</span>
          </button>
        </div>
      </div>
    </div>
  );
}

