import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import ThreatScore from './ThreatScore';
import PDFReport from './PDFReport';
import { useLanguage } from '../LanguageContext';
 
const API_URL = 'https://phantombreaker-backend-xleo.onrender.com';
const EMAILJS_SERVICE_ID = 'service_lxa01q6';
const EMAILJS_TEMPLATE_ID = 'template_3ct82po';
const EMAILJS_PUBLIC_KEY = 'xusdSXbfVMIB9_YE7';
 
function speakAlert(message) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 500);
  }
}
 
function PhishingAnalyzer({ addToHistory }) {
  const { language } = useLanguage(); // currently selected site language, e.g. "Hindi"
  const [emailText, setEmailText] = useState('');
  const [alertEmail, setAlertEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [voiceTriggered, setVoiceTriggered] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
 
  const sendEmailAlert = async (data) => {
    if (!alertEmail || !alertEmail.includes('@')) return;
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: alertEmail,
          name: 'PhantomBreaker User',
          time: new Date().toLocaleString(),
          message: `Your PhantomBreaker scan is complete.\n\nThreat Score: ${data.combined_threat_score}/100\nResult: ${data.is_phishing ? 'Phishing Detected' : 'Safe'}\nLanguage: ${data.language_detected}\nTactics Found: ${data.manipulation_tactics?.join(', ') || 'None'}\n\nView full details in your PhantomBreaker dashboard.\n\n— PhantomBreaker Security Platform\nphantombreaker.vercel.app`,
        },
        EMAILJS_PUBLIC_KEY
      );
      setEmailSent(true);
    } catch (err) {
      console.error('Email failed:', err);
    }
  };
 
  const analyze = async () => {
    if (!emailText.trim() || emailText.length < 10) {
      setError('Please enter the email text to analyze.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    setVoiceTriggered(false);
    setEmailSent(false);
 
    try {
      const response = await axios.post(`${API_URL}/api/analyze-phishing`, {
        email_text: emailText,
        response_language: language, // ensures result follows the selected site language
      });
      setResult(response.data);
      if (response.data.combined_threat_score >= 60) {
        setVoiceTriggered(true);
        speakAlert('Warning! High threat detected. This email is likely a phishing attack. Do not click any links.');
        await sendEmailAlert(response.data);
      }
      addToHistory({
        type: 'Phishing Analysis',
        score: response.data.combined_threat_score,
        summary: response.data.is_phishing ? 'Phishing Detected' : 'Clean Email',
        icon: '🎣'
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Connection failed: ' + err.toString());
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '36px' }}>🎣</span>
            <h1 style={{ fontSize: '32px', fontWeight: 700 }}>Phishing Analyzer</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Paste any suspicious email. AI will detect phishing tactics, AI-written content and give a threat score.
          </p>
        </div>
 
        <div className="card" style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block', marginBottom: '12px',
            fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)'
          }}>
            PASTE EMAIL TEXT
          </label>
          <textarea
            className="input-field"
            placeholder="Paste the full email content here including subject, sender and body..."
            value={emailText}
            onChange={e => setEmailText(e.target.value)}
            style={{ minHeight: '200px' }}
          />
 
          <div style={{ marginTop: '16px', marginBottom: '8px' }}>
            <label style={{
              display: 'block', marginBottom: '8px',
              fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)'
            }}>
              📧 YOUR EMAIL (for scan report — optional)
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="Enter your email to receive scan report..."
              value={alertEmail}
              onChange={e => setAlertEmail(e.target.value)}
              style={{ padding: '12px 16px', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
 
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginTop: '16px'
          }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {emailText.length} characters
            </span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-primary"
                onClick={() => { setEmailText(''); setAlertEmail(''); setResult(null); setError(''); setVoiceTriggered(false); setEmailSent(false); }}
                style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
              >
                Clear
              </button>
              <button
                className="btn-primary"
                onClick={analyze}
                disabled={loading}
              >
                {loading ? 'Analyzing...' : '🔍 Analyze Email'}
              </button>
            </div>
          </div>
        </div>
 
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
 
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>AI is analyzing your email...</p>
          </div>
        )}
 
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px' }}>
              <ThreatScore score={result.combined_threat_score} />
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{
                  fontSize: '28px', fontWeight: 700, marginBottom: '8px',
                  color: result.is_phishing ? 'var(--danger)' : 'var(--success)'
                }}>
                  {result.is_phishing ? '⚠️ PHISHING DETECTED' : '✅ EMAIL IS SAFE'}
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {result.explanation}
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span className={`badge ${result.is_phishing ? 'badge-danger' : 'badge-success'}`}>
                    {result.is_phishing ? '🚨 Phishing' : '✅ Safe'}
                  </span>
                  <span className="badge badge-warning">
                    🤖 AI Written: {result.ai_written_score}%
                  </span>
                  <span className="badge" style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,212,255,0.3)' }}>
                    🌐 {result.language_detected}
                  </span>
                </div>
                {voiceTriggered && (
                  <div style={{
                    marginTop: '12px', padding: '10px 16px',
                    background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)',
                    borderRadius: '8px', fontSize: '13px', color: 'var(--danger)'
                  }}>
                    🔊 Voice Alert Triggered — High Threat Detected!
                  </div>
                )}
                {emailSent && (
                  <div style={{
                    marginTop: '8px', padding: '10px 16px',
                    background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: '8px', fontSize: '13px', color: 'var(--accent-cyan)'
                  }}>
                    📧 Scan report sent to {alertEmail}!
                  </div>
                )}
                <div style={{ marginTop: '16px' }}>
                  <PDFReport scanData={result} type="Phishing Analysis" />
                </div>
              </div>
            </div>
 
            {result.dangerous_sentences?.length > 0 && (
              <div className="card">
                <h3 style={{ marginBottom: '16px', color: 'var(--danger)' }}>
                  🚨 Dangerous Sentences
                </h3>
                {result.dangerous_sentences.map((sentence, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,45,120,0.08)',
                    border: '1px solid rgba(255,45,120,0.2)',
                    borderRadius: '8px', padding: '12px 16px', marginBottom: '8px',
                    fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6
                  }}>
                    ⚡ {sentence}
                  </div>
                ))}
              </div>
            )}
 
            {result.manipulation_tactics?.length > 0 && (
              <div className="card">
                <h3 style={{ marginBottom: '16px', color: 'var(--warning)' }}>
                  🧠 Manipulation Tactics Used
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {result.manipulation_tactics.map((tactic, i) => (
                    <span key={i} className="badge badge-warning">
                      {tactic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
 
export default PhishingAnalyzer;