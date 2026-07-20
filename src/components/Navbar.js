import React from 'react';
import { motion } from 'framer-motion';
 
function Navbar({ activeModule, setActiveModule }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'phishing', label: 'Phishing' },
    { id: 'deepfake', label: 'Deepfake' },
    { id: 'breach', label: 'Breach' },
    { id: 'history', label: 'History' },
  ];
 
  return (
    <nav className="pb-navbar" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)', padding: '0 24px',
      height: '70px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Logo */}
      <motion.div
        onClick={() => setActiveModule('home')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}
        whileHover={{ scale: 1.05 }}
      >
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'var(--gradient-main)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', flexShrink: 0
        }}></div>
        <span className="pb-logo-text" style={{
          fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '20px',
          background: 'var(--gradient-main)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          whiteSpace: 'nowrap'
        }}>PhantomBreaker</span>
      </motion.div>
 
      {/* Nav Links — scrolls horizontally within its own row on small screens
          instead of pushing the whole navbar (and page) wider than the viewport */}
      <div className="pb-nav-links" style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
        {navItems.map(item => (
          <motion.button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: activeModule === item.id
                ? 'rgba(0,212,255,0.15)' : 'transparent',
              border: activeModule === item.id
                ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
              color: activeModule === item.id
                ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              padding: '8px 16px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '14px',
              fontFamily: 'Space Grotesk', fontWeight: 500,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap', flexShrink: 0
            }}
          >
            {item.label}
          </motion.button>
        ))}
      </div>
 
      {/* Status — hidden on small screens via CSS to make room for nav links */}
      <div className="pb-status" style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)',
        borderRadius: '20px', padding: '6px 14px', flexShrink: 0
      }}>
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: 'var(--success)', display: 'inline-block'
        }} className="animate-pulse"></span>
        <span style={{ fontSize: '13px', color: 'var(--success)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>
          Systems Online
        </span>
      </div>
    </nav>
  );
}
 
export default Navbar;
 