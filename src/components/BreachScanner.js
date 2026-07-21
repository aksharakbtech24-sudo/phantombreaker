import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import PDFReport from './PDFReport';
import { useLanguage } from '../LanguageContext';
import { useTranslated } from '../useTranslated';
 
const API_URL = 'https://phantombreaker-backend-xleo.onrender.com';
 
const UI_STRINGS = {
  title: 'Breach Scanner',
  subtitle: 'Check if your email was leaked in any data breach using the real LeakCheck database.',
  enterEmail: 'ENTER EMAIL ADDRESS',
  scanNow: '🔍 Scan Now',
  scanning: 'Scanning...',
  hashNotice: '🔒 Your email is hashed before checking — never stored or shared',
  emptyError: 'Please enter a valid email address.',
  checkingDb: 'Checking breach databases...',
  foundBreachesPrefix: 'Found in',
  foundBreachesSuffix: 'Data Breaches',
  noBreaches: 'No Breaches Found!',
  exposedPrefix: 'Your email',
  exposedMiddle: 'was exposed in',
  exposedSuffix: 'known data breaches.',
  cleanPrefix: 'Great news!',
  cleanSuffix: "hasn't appeared in any known data breaches.",
  breachedSites: '🔓 Breached Sites',
  breachedLabel: 'Breached:',
  accountsSuffix: 'accounts',
  whatToDoNow: '🛡️ What To Do Now',
  rec1: 'Change your password immediately on all breached sites',
  rec2: 'Enable two-factor authentication (2FA) everywhere',
  rec3: 'Use a unique password for every website',
  rec4: 'Consider using a password manager like Bitwarden',
  rec5: 'Monitor your bank accounts for suspicious activity',
  rec6: 'Check if your phone number was also leaked',
  backendError: 'Backend not connected yet. Set up Flask backend to get real results.',
};
 
function BreachScanner({ addToHistory }) {
  const { language } = useLanguage();
  const { t } = useTranslated(Object.values(UI_STRINGS));
 
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 
  const scan = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError(t(UI_STRINGS.emptyError));
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
 
    try {
      const response = await axios.get(`${API_URL}/api/check-breach`, {
        params: { email, response_language: language }
      });
      setResult(response.data);
      addToHistory({
        type: 'Breach Scan',
        score: response.data.breach_count > 0 ? Math.min(response.data.breach_count * 15, 100) : 0,
        summary: response.data.breach_count > 0
          ? `Found in ${response.data.breach_count} breaches`
          : 'No breaches found',
        icon: '🔓'
      });
    } catch (err) {
      setError(t(UI_STRINGS.backendError));
    } finally {
      setLoading(false);
    }
  };
 
  const recommendations = [
    UI_STRINGS.rec1, UI_STRINGS.rec2, UI_STRINGS.rec3,
    UI_STRINGS.rec4, UI_STRINGS.rec5, UI_STRINGS.rec6
  ];
 
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '36px' }}>🔓</span>
            <h1 style={{ fontSize: '32px', fontWeight: 700 }}>{t(UI_STRINGS.title)}</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
           {t(UI_STRINGS.subtitle)}
          </p>
        </div>
 
        {/* Input */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block', marginBottom: '12px',
            fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)'
          }}>
            {t(UI_STRINGS.enterEmail)}
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="email"
              className="input-field"
              placeholder="yourname@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && scan()}
            />
            <button
              className="btn-primary"
              onClick={scan}
              disabled={loading}
              style={{ whiteSpace: 'nowrap' }}
            >
              {loading ? t(UI_STRINGS.scanning) : t(UI_STRINGS.scanNow)}
            </button>
          </div>
          <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
            {t(UI_STRINGS.hashNotice)}
          </p>
        </div>
 
        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)',
              borderRadius: '12px', padding: '16px', marginBottom: '24px',
              color: 'var(--danger)', fontSize: '14px'
            }}
          >
            ⚠️ {error}
          </motion.div>
        )}
 
        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>{t(UI_STRINGS.checkingDb)}</p>
          </div>
        )}
 
        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Summary */}
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                {result.breach_count > 0 ? '🚨' : '✅'}
              </div>
              <div style={{
                fontSize: '32px', fontWeight: 700, marginBottom: '8px',
                color: result.breach_count > 0 ? 'var(--danger)' : 'var(--success)'
              }}>
                {result.breach_count > 0
                  ? `${t(UI_STRINGS.foundBreachesPrefix)} ${result.breach_count} ${t(UI_STRINGS.foundBreachesSuffix)}`
                  : t(UI_STRINGS.noBreaches)}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                {result.breach_count > 0
                  ? `${t(UI_STRINGS.exposedPrefix)} ${email} ${t(UI_STRINGS.exposedMiddle)} ${result.breach_count} ${t(UI_STRINGS.exposedSuffix)}`
                  : `${t(UI_STRINGS.cleanPrefix)} ${email} ${t(UI_STRINGS.cleanSuffix)}`}
              </p>
            </div>
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <PDFReport scanData={result} type="Breach Scan" />
            </div>
 
            {/* Breach list */}
            {result.breaches?.length > 0 && (
              <div className="card">
                <h3 style={{ marginBottom: '20px', color: 'var(--danger)' }}>
                  {t(UI_STRINGS.breachedSites)}
                </h3>
                {result.breaches.map((breach, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px', padding: '16px',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px'
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                          {breach.name}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          {t(UI_STRINGS.breachedLabel)} {breach.breach_date}
                        </div>
                      </div>
                      <span className="badge badge-danger">
                        {breach.pwn_count?.toLocaleString()} {t(UI_STRINGS.accountsSuffix)}
                      </span>
                    </div>
                    {breach.data_classes?.length > 0 && (
                      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {breach.data_classes.map((dc, j) => (
                          <span key={j} style={{
                            background: 'rgba(255,179,71,0.1)',
                            border: '1px solid rgba(255,179,71,0.2)',
                            borderRadius: '6px', padding: '3px 10px',
                            fontSize: '12px', color: 'var(--warning)'
                          }}>
                            {dc}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
 
            {/* Recommendations */}
            {result.breach_count > 0 && (
              <div className="card">
                <h3 style={{ marginBottom: '16px', color: 'var(--accent-cyan)' }}>
                  {t(UI_STRINGS.whatToDoNow)}
                </h3>
                {recommendations.map((rec, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '10px 0',
                    borderBottom: i < 5 ? '1px solid var(--border)' : 'none'
                  }}>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>→</span>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{t(rec)}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
 
export default BreachScanner;