import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { useTranslated } from '../useTranslated';

const UI_STRINGS = {
  title: 'Scan History',
  subtitle: 'All your past scans, threat trends and security overview.',
  noScansTitle: 'No scans yet',
  noScansBody: 'Run a scan from any module and it will appear here.',
  totalScans: 'Total Scans',
  avgThreatScore: 'Avg Threat Score',
  highThreats: 'High Threats',
  threatScoreTrend: 'Threat Score Trend',
  scansByType: 'Scans by Type',
  recentScans: 'Recent Scans',
  module: 'Module',
  result: 'Result',
  threatScore: 'Threat Score',
  time: 'Time',
};

function ScanHistory({ history }) {
  const { t } = useTranslated(Object.values(UI_STRINGS));

  const getScoreColor = (score) => {
    if (score >= 70) return 'var(--danger)';
    if (score >= 40) return 'var(--warning)';
    return 'var(--success)';
  };

  const avgScore = history.length
    ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length)
    : 0;

  const highThreats = history.filter(s => s.score >= 70).length;
  const chartData = history.slice(0, 10).reverse().map((scan, i) => ({
    name: `Scan ${i + 1}`,
    score: scan.score,
    type: scan.type
  }));

  const typeCount = history.reduce((acc, scan) => {
    acc[scan.type] = (acc[scan.type] || 0) + 1;
    return acc;
  }, {});

  const typeData = Object.entries(typeCount).map(([name, count]) => ({ name, count }));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '36px' }}>📊</span>
            <h1 style={{ fontSize: '32px', fontWeight: 700 }}>{t(UI_STRINGS.title)}</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            {t(UI_STRINGS.subtitle)}
          </p>
        </div>

        {history.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '80px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>{t(UI_STRINGS.noScansTitle)}</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              {t(UI_STRINGS.noScansBody)}
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid-3" style={{ marginBottom: '24px' }}>
              {[
                { label: t(UI_STRINGS.totalScans), value: history.length, icon: '🔍', color: 'var(--accent-cyan)' },
                { label: t(UI_STRINGS.avgThreatScore), value: avgScore, icon: '📈', color: avgScore >= 70 ? 'var(--danger)' : avgScore >= 40 ? 'var(--warning)' : 'var(--success)' },
                { label: t(UI_STRINGS.highThreats), value: highThreats, icon: '🚨', color: 'var(--danger)' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{
                    fontSize: '40px', fontWeight: 700,
                    color: stat.color, fontFamily: 'Space Grotesk'
                  }}>{stat.value}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            {chartData.length > 1 && (
              <div className="grid-2" style={{ marginBottom: '24px' }}>
                {/* Threat score over time */}
                <div className="card">
                  <h3 style={{ marginBottom: '20px' }}>{t(UI_STRINGS.threatScoreTrend)}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px', color: 'var(--text-primary)'
                        }}
                      />
                      <Line
                        type="monotone" dataKey="score"
                        stroke="var(--accent-cyan)" strokeWidth={2}
                        dot={{ fill: 'var(--accent-cyan)', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Scans by type */}
                <div className="card">
                  <h3 style={{ marginBottom: '20px' }}>{t(UI_STRINGS.scansByType)}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={typeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px', color: 'var(--text-primary)'
                        }}
                      />
                      <Bar dataKey="count" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* History table */}
            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>{t(UI_STRINGS.recentScans)}</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {[UI_STRINGS.module, UI_STRINGS.result, UI_STRINGS.threatScore, UI_STRINGS.time].map(h => (
                        <th key={h} style={{
                          padding: '12px 16px', textAlign: 'left',
                          fontSize: '12px', color: 'var(--text-muted)',
                          fontWeight: 600, letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>{t(h)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((scan, i) => (
                      <motion.tr
                        key={scan.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{scan.icon}</span>
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{scan.type}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            {scan.summary}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '80px', height: '6px',
                              background: 'var(--border)', borderRadius: '3px', overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${scan.score}%`, height: '100%',
                                background: getScoreColor(scan.score),
                                borderRadius: '3px'
                              }} />
                            </div>
                            <span style={{
                              fontSize: '14px', fontWeight: 600,
                              color: getScoreColor(scan.score)
                            }}>{scan.score}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            {scan.timestamp}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default ScanHistory;