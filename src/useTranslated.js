import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import PhishingAnalyzer from './components/PhishingAnalyzer';
import DeepfakeDetector from './components/DeepfakeDetector';
import BreachScanner from './components/BreachScanner';
import ScanHistory from './components/ScanHistory';
import { LanguageProvider } from './LanguageContext';
import { useTranslated } from './useTranslated';
import './index.css';
 
function App() {
  const [activeModule, setActiveModule] = useState('home');
  const [scanHistory, setScanHistory] = useState([]);
 
  const addToHistory = (scan) => {
    setScanHistory(prev => [{
      ...scan,
      id: Date.now(),
      timestamp: new Date().toLocaleString()
    }, ...prev]);
  };
 
  const renderModule = () => {
    switch (activeModule) {
      case 'phishing':
        return <PhishingAnalyzer addToHistory={addToHistory} />;
      case 'deepfake':
        return <DeepfakeDetector addToHistory={addToHistory} />;
      case 'breach':
        return <BreachScanner addToHistory={addToHistory} />;
      case 'history':
        return <ScanHistory history={scanHistory} />;
      default:
        return <HomePage setActiveModule={setActiveModule} />;
    }
  };
 
  return (
    <LanguageProvider>
      <div className="app">
        <Navbar activeModule={activeModule} setActiveModule={setActiveModule} />
        <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderModule()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </LanguageProvider>
  );
}
 
function HomePage({ setActiveModule }) {
  const modules = [
    {
      id: 'phishing',
      icon: '🎣',
      title: 'Phishing Analyzer',
      description: 'Detect phishing emails and AI-written content with LLaMA AI. Get threat score, dangerous sentences and manipulation tactics.',
      color: 'var(--accent-cyan)',
      gradient: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(123,47,255,0.1))',
      border: 'rgba(0,212,255,0.3)'
    },
    {
      id: 'deepfake',
      icon: '🤖',
      title: 'Deepfake Detector',
      description: 'Upload any image and detect if it was AI generated using real computer vision models from HuggingFace.',
      color: 'var(--accent-purple)',
      gradient: 'linear-gradient(135deg, rgba(123,47,255,0.1), rgba(255,45,120,0.1))',
      border: 'rgba(123,47,255,0.3)'
    },
    {
      id: 'breach',
      icon: '🔓',
      title: 'Breach Scanner',
      description: 'Check if your email was leaked in any data breach using the real HaveIBeenPwned database with millions of records.',
      color: 'var(--accent-pink)',
      gradient: 'linear-gradient(135deg, rgba(255,45,120,0.1), rgba(255,107,53,0.1))',
      border: 'rgba(255,45,120,0.3)'
    }
  ];
 
  // Every English string shown on this page — the hook translates all of
  // these together in one batch call whenever the language changes.
  const tagline = 'Protect yourself from AI misuse. Detect phishing, deepfakes and data breaches with real AI models and live databases.';
  const badge = 'AI-Powered Cybersecurity Platform';
  const tags = ['Real AI Models', 'Live Databases', 'Multilingual', 'Threat Reports'];
  const launchLabel = 'Launch Scanner';
 
  const englishStrings = [
    badge, tagline, launchLabel,
    ...tags,
    ...modules.map(m => m.title),
    ...modules.map(m => m.description),
  ];
 
  const { t } = useTranslated(englishStrings);
 
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '80px' }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
          borderRadius: '20px', padding: '6px 16px', marginBottom: '24px'
        }}>
          <span style={{ width: '8px', height: '8px', background: 'var(--accent-cyan)', borderRadius: '50%', display: 'inline-block' }} className="animate-pulse"></span>
          <span style={{ fontSize: '13px', color: 'var(--accent-cyan)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>{t(badge)}</span>
        </div>
 
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 50%, #7b2fff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Phantom<span style={{ color: 'var(--accent-cyan)' }}>Breaker</span>
        </h1>
 
        <p style={{
          fontSize: '18px', color: 'var(--text-secondary)',
          maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7
        }}>
          {t(tagline)}
        </p>
 
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['🔒 ', '⚡ ', '🌐 ', '📊 '].map((emoji, i) => (
            <span key={tags[i]} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '20px', padding: '8px 16px',
              fontSize: '13px', color: 'var(--text-secondary)'
            }}>{emoji}{t(tags[i])}</span>
          ))}
        </div>
      </motion.div>
 
      {/* Module Cards */}
      <div className="grid-3">
        {modules.map((mod, i) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            onClick={() => setActiveModule(mod.id)}
            style={{
              background: mod.gradient,
              border: `1px solid ${mod.border}`,
              borderRadius: '20px', padding: '32px',
              cursor: 'pointer', transition: 'all 0.3s ease'
            }}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{mod.icon}</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: mod.color }}>{t(mod.title)}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t(mod.description)}</p>
            <div style={{
              marginTop: '24px', display: 'flex', alignItems: 'center',
              gap: '8px', color: mod.color, fontSize: '14px', fontWeight: 600
            }}>
              <span>{t(launchLabel)}</span>
              <span>→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
 
export default App;