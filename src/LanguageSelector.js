import React, { useState } from 'react';
import { useLanguage, LANGUAGES } from './LanguageContext';
 
function LanguageSelector() {
  const { language, setLanguage, translating } = useLanguage();
  const [open, setOpen] = useState(false);
 
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          background: 'rgba(0,212,255,0.1)',
          border: '1px solid rgba(0,212,255,0.3)',
          borderRadius: '20px', padding: '6px 14px',
          color: 'var(--accent-cyan)', fontSize: '13px',
          fontFamily: 'Space Grotesk', fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          whiteSpace: 'nowrap'
        }}
      >
        🌐 {translating ? '...' : language}
      </button>
 
      {open && (
        <div style={{
          position: 'absolute', top: '110%', right: 0,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '8px',
          maxHeight: '320px', overflowY: 'auto',
          minWidth: '180px', zIndex: 2000,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          {LANGUAGES.map(lang => (
            <div
              key={lang}
              onClick={() => { setLanguage(lang); setOpen(false); }}
              style={{
                padding: '8px 12px', borderRadius: '8px',
                cursor: 'pointer', fontSize: '14px',
                color: lang === language ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                background: lang === language ? 'rgba(0,212,255,0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = lang === language ? 'rgba(0,212,255,0.1)' : 'transparent'}
            >
              {lang}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
 
export default LanguageSelector;
