import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function ThreatScore({ score }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const timer = setInterval(() => {
      start += 2;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(start);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  const getColor = () => {
    if (score >= 70) return '#ff2d78';
    if (score >= 40) return '#ffb347';
    return '#00ff88';
  };

  const getLabel = () => {
    if (score >= 70) return 'HIGH THREAT';
    if (score >= 40) return 'MEDIUM RISK';
    return 'LOW RISK';
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (displayScore / 100) * circumference;

  useEffect(() => {
    if (score >= 70) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          'Warning! High threat detected. This content may be dangerous.'
        );
        utterance.rate = 0.9;
        utterance.pitch = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
    >
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke="var(--border)" strokeWidth="12"
          />
          {/* Score arc */}
          <motion.circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${getColor()})` }}
          />
        </svg>

        {/* Score number in center */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '42px', fontWeight: 700,
            fontFamily: 'Space Grotesk',
            color: getColor(),
            lineHeight: 1
          }}>{displayScore}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>/ 100</div>
        </div>
      </div>

      {/* Label */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1, repeat: score >= 70 ? Infinity : 0 }}
        style={{
          padding: '8px 20px', borderRadius: '20px',
          background: `${getColor()}22`,
          border: `1px solid ${getColor()}55`,
          color: getColor(),
          fontFamily: 'Space Grotesk', fontWeight: 700,
          fontSize: '13px', letterSpacing: '1px'
        }}
      >
        {getLabel()}
      </motion.div>
    </motion.div>
  );
}

export default ThreatScore;