import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import PhishingAnalyzer from './components/PhishingAnalyzer';
import DeepfakeDetector from './components/DeepfakeDetector';
import BreachScanner from './components/BreachScanner';
import ScanHistory from './components/ScanHistory';
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
  );
}
 
function HomePage({ setActiveModule }) {
  const [openInfo, setOpenInfo] = useState(null); // holds module id whose "How it works" is expanded
 
  const modules = [
    {
      id: 'phishing',
      icon: '🎣',
      title: 'Phishing Analyzer',
      description: 'Detect phishing emails and AI-written content with LLaMA AI. Get threat score, dangerous sentences and manipulation tactics.',
      color: 'var(--accent-cyan)',
      gradient: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(123,47,255,0.1))',
      border: 'rgba(0,212,255,0.3)',
      howItWorks: [
        'Paste the full text of a suspicious email into the box.',
        'Groq\'s LLaMA 3.3 70B model reads it and checks for phishing tactics — urgency, fake links, impersonation, threats.',
        'Sapling AI separately checks whether the text was AI-written.',
        'Both scores are combined into one Threat Score (0-100).',
        'If the score is 60+, a voice alert, an email alert, and a full breakdown of dangerous sentences and tactics are shown.'
      ]
    },
    {
      id: 'deepfake',
      icon: '🤖',
      title: 'Deepfake Detector',
      description: 'Upload any image and detect if it was AI generated using real computer vision models from HuggingFace.',
      color: 'var(--accent-purple)',
      gradient: 'linear-gradient(135deg, rgba(123,47,255,0.1), rgba(255,45,120,0.1))',
      border: 'rgba(123,47,255,0.3)',
      howItWorks: [
        'Upload any image — a photo, a profile picture, anything you want to check.',
        'The image is sent to a HuggingFace computer vision model trained to spot AI-generation artifacts.',
        'The model returns a confidence score for whether the image is real or AI-generated.',
        'You get a clear verdict plus the confidence percentage behind it.'
      ]
    },
    {
      id: 'breach',
      icon: '🔓',
      title: 'Breach Scanner',
      description: 'Check if your email was leaked in any data breach using the real HaveIBeenPwned database with millions of records.',
      color: 'var(--accent-pink)',
      gradient: 'linear-gradient(135deg, rgba(255,45,120,0.1), rgba(255,107,53,0.1))',
      border: 'rgba(255,45,120,0.3)',
      howItWorks: [
        'Enter any email address you want to check.',
        'It\'s checked against LeakCheck\'s live database of real leaked-record breaches.',
        'If found, you see which breaches it appeared in, the date, and what data types were exposed (passwords, phone numbers, etc).',
        'If it\'s clean, you get a clear "no known breaches" result.'
      ]
    }
  ];
 
  const toggleInfo = (id) => {
    setOpenInfo(prev => (prev === id ? null : id));
  };
 
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
          <span style={{ fontSize: '13px', color: 'var(--accent-cyan)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>AI-Powered Cybersecurity Platform</span>
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
          Protect yourself from AI misuse. Detect phishing, deepfakes and data breaches with real AI models and live databases.
        </p>
 
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['🔒 Real AI Models', '⚡ Live Databases', '🌐 Multilingual', '📊 Threat Reports'].map(tag => (
            <span key={tag} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '20px', padding: '8px 16px',
              fontSize: '13px', color: 'var(--text-secondary)'
            }}>{tag}</span>
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
            style={{
              background: mod.gradient,
              border: `1px solid ${mod.border}`,
              borderRadius: '20px', padding: '32px',
              transition: 'all 0.3s ease'
            }}
          >
            <div
              onClick={() => setActiveModule(mod.id)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{mod.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: mod.color }}>{mod.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{mod.description}</p>
              <div style={{
                marginTop: '24px', display: 'flex', alignItems: 'center',
                gap: '8px', color: mod.color, fontSize: '14px', fontWeight: 600
              }}>
                <span>Launch Scanner</span>
                <span>→</span>
              </div>
            </div>
 
            {/* How it works toggle — separate click target, doesn't navigate */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleInfo(mod.id); }}
              style={{
                marginTop: '18px', width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${mod.border}`,
                borderRadius: '10px', padding: '10px 14px',
                color: 'var(--text-secondary)', fontSize: '13px',
                fontFamily: 'Space Grotesk', fontWeight: 600,
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <span>ℹ️ How it works</span>
              <motion.span
                animate={{ rotate: openInfo === mod.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▾
              </motion.span>
            </button>
 
            <AnimatePresence>
              {openInfo === mod.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <ol style={{
                    marginTop: '14px', paddingLeft: '20px',
                    display: 'flex', flexDirection: 'column', gap: '8px'
                  }}>
                    {mod.howItWorks.map((step, idx) => (
                      <li key={idx} style={{
                        fontSize: '13px', color: 'var(--text-secondary)',
                        lineHeight: 1.6
                      }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
 
export default App;