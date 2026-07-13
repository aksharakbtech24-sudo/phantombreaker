import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import PDFReport from './PDFReport';

const API_URL = 'https://phantombreaker-backend-xleo.onrender.com';

function BreachScanner({ addToHistory }) {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scan = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/check-breach`, {
        params: { email }
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
      setError('Backend not connected yet. Set up Flask backend to get real results.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '36px' }}>🔓</span>
            <h1 style={{ fontSize: '32px', fontWeight: 700 }}>Breach Scanner</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Check if your email was leaked in any data breach using the real HaveIBeenPwned database.
          </p>
        </div>

        {/* Input */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block', marginBottom: '12px',
            fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)'
          }}>
            ENTER EMAIL ADDRESS
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
              {loading ? 'Scanning...' : '🔍 Scan Now'}
            </button>
          </div>
          <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
            🔒 Your email is hashed before checking — never stored or shared
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
            <p style={{ color: 'var(--text-secondary)' }}>Checking breach databases...</p>
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
                  ? `Found in ${result.breach_count} Data Breaches`
                  : 'No Breaches Found!'}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                {result.breach_count > 0
                  ? `Your email ${email} was exposed in ${result.breach_count} known data breaches.`
                  : `Great news! ${email} hasn't appeared in any known data breaches.`}
              </p>
            </div>
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <PDFReport scanData={result} type="Breach Scan" />
            </div>

            {/* Breach list */}
            {result.breaches?.length > 0 && (
              <div className="card">
                <h3 style={{ marginBottom: '20px', color: 'var(--danger)' }}>
                  🔓 Breached Sites
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
                          Breached: {breach.breach_date}
                        </div>
                      </div>
                      <span className="badge badge-danger">
                        {breach.pwn_count?.toLocaleString()} accounts
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
                  🛡️ What To Do Now
                </h3>
                {[
                  'Change your password immediately on all breached sites',
                  'Enable two-factor authentication (2FA) everywhere',
                  'Use a unique password for every website',
                  'Consider using a password manager like Bitwarden',
                  'Monitor your bank accounts for suspicious activity',
                  'Check if your phone number was also leaked'
                ].map((rec, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '10px 0',
                    borderBottom: i < 5 ? '1px solid var(--border)' : 'none'
                  }}>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>→</span>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{rec}</span>
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