import React, { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import { useTranslated } from '../useTranslated';

const API_URL = process.env.REACT_APP_API_URL || 'https://phantombreaker-backend-xleo.onrender.com';

const UI_STRINGS = {
  title: 'Combined Threat Report',
  subtitle: 'Run a 3-in-1 master security audit across Phishing, Deepfake and Data Breach modules.',
  emailTextLabel: '1. PHISHING EMAIL CONTENT (Optional)',
  emailTextPlaceholder: 'Paste suspicious email content here to scan for phishing tactics...',
  imageLabel: '2. DEEPFAKE IMAGE UPLOAD (Optional)',
  imagePlaceholder: 'Upload image file to analyze pixel patterns for AI generation...',
  addressLabel: '3. BREACH EMAIL ADDRESS (Optional)',
  addressPlaceholder: 'Enter your email address to scan leaked database records...',
  runBtn: '⚡ Run Master Combined Audit',
  runningBtn: 'Analyzing All 3 Modules...',
  gradeTitle: 'Executive Security Grade',
  phishingScore: 'Phishing Threat',
  deepfakeScore: 'Deepfake Fake',
  breachScore: 'Breach Vulnerability',
  recsTitle: 'Actionable Remediation Checklist',
  pdfBtn: '📄 Download Master Security PDF Report',
  errEmpty: 'Please fill in at least one field (Email text, Image file, or Email address) to run audit.'
};

function CombinedReport({ onScanComplete }) {
  const { language } = useLanguage();
  const { t } = useTranslated(Object.values(UI_STRINGS));

  const [emailText, setEmailText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [emailAddress, setEmailAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleRunAudit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailText.trim() && !imageFile && !emailAddress.trim()) {
      setError(t(UI_STRINGS.errEmpty));
      return;
    }

    setLoading(true);
    setReport(null);

    try {
      const formData = new FormData();
      if (emailText.trim()) formData.append('email_text', emailText);
      if (emailAddress.trim()) formData.append('email_address', emailAddress);
      formData.append('response_language', language);
      if (imageFile) formData.append('image', imageFile);

      const resp = await axios.post(`${API_URL}/api/combined-analysis`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });

      setReport(resp.data);

      if (onScanComplete) {
        onScanComplete({
          id: Date.now(),
          type: 'Master Audit',
          icon: '🛡️',
          score: resp.data.unified_threat_score,
          summary: `Grade: ${resp.data.security_grade} (${resp.data.grade_label})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Combined audit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!report) return;
    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setTextColor(56, 189, 248);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PHANTOMBREAKER MASTER SECURITY REPORT', 14, 25);

    doc.setTextColor(203, 213, 225);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()} | Language: ${language}`, 14, 33);

    doc.setDrawColor(51, 65, 85);
    doc.line(14, 38, 196, 38);

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(`Security Posture Grade: ${report.security_grade} (${report.grade_label})`, 14, 50);

    doc.setFontSize(12);
    doc.setTextColor(148, 163, 184);
    doc.text(`Unified Threat Score: ${report.unified_threat_score} / 100`, 14, 58);

    let y = 72;

    doc.setTextColor(56, 189, 248);
    doc.setFontSize(14);
    doc.text('MODULE BREAKDOWN', 14, y);
    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(226, 232, 240);
    doc.text(`• Phishing Email Threat Score: ${report.phishing_module.threat_score}/100`, 14, y);
    y += 7;
    doc.text(`• Deepfake Image Artificiality: ${report.deepfake_module.fake_score}%`, 14, y);
    y += 7;
    doc.text(`• Data Breach Exposure Count: ${report.breach_module.breach_count} breaches`, 14, y);
    y += 15;

    doc.setTextColor(56, 189, 248);
    doc.setFontSize(14);
    doc.text('RECOMMENDED REMEDIATION STEPS', 14, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(203, 213, 225);
    report.recommendations.forEach((rec, i) => {
      doc.text(`${i + 1}. ${rec}`, 14, y);
      y += 7;
    });

    doc.save(`PhantomBreaker_Master_Report_${Date.now()}.pdf`);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '36px' }}>🛡️</span>
            <h1 style={{ fontSize: '32px', fontWeight: 700 }}>{t(UI_STRINGS.title)}</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            {t(UI_STRINGS.subtitle)}
          </p>
        </div>

        {/* Input Form Card */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <form onSubmit={handleRunAudit}>
            {/* Phishing Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                {t(UI_STRINGS.emailTextLabel)}
              </label>
              <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder={t(UI_STRINGS.emailTextPlaceholder)}
                rows={3}
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px',
                  background: 'var(--bg-hover)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical'
                }}
              />
            </div>

            {/* Deepfake File Upload */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: 'var(--accent-purple)', marginBottom: '8px' }}>
                {t(UI_STRINGS.imageLabel)}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px',
                  background: 'var(--bg-hover)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
              {imageFile && (
                <div style={{ fontSize: '13px', color: 'var(--success)', marginTop: '6px' }}>
                  ✓ Selected file: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {/* Breach Email Input */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: 'var(--warning)', marginBottom: '8px' }}>
                {t(UI_STRINGS.addressLabel)}
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder={t(UI_STRINGS.addressPlaceholder)}
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px',
                  background: 'var(--bg-hover)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {error && (
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--danger)', color: 'var(--danger)', marginBottom: '20px', fontSize: '14px' }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 600 }}
            >
              {loading ? t(UI_STRINGS.runningBtn) : t(UI_STRINGS.runBtn)}
            </button>
          </form>
        </div>

        {/* Results Audit Output */}
        {report && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Grade Display Meter */}
            <div className="card" style={{ textAlign: 'center', padding: '40px 24px', marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                {t(UI_STRINGS.gradeTitle)}
              </div>
              <div style={{
                fontSize: '72px', fontWeight: 800, color: report.grade_color,
                fontFamily: 'Space Grotesk', textShadow: `0 0 30px ${report.grade_color}`
              }}>
                {report.security_grade}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: report.grade_color, marginTop: '4px' }}>
                {report.grade_label}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Unified Threat Score: <strong style={{ color: 'var(--text-primary)' }}>{report.unified_threat_score} / 100</strong>
              </div>
            </div>

            {/* 3 Modules Score Cards */}
            <div className="grid-3" style={{ marginBottom: '24px' }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>📧</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>{t(UI_STRINGS.phishingScore)}</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: report.phishing_module.threat_score >= 50 ? 'var(--danger)' : 'var(--success)' }}>
                  {report.phishing_module.threat_score} <span style={{ fontSize: '14px' }}>/100</span>
                </div>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>🖼️</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>{t(UI_STRINGS.deepfakeScore)}</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: report.deepfake_module.fake_score >= 50 ? 'var(--danger)' : 'var(--success)' }}>
                  {report.deepfake_module.fake_score}%
                </div>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>🔓</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>{t(UI_STRINGS.breachScore)}</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: report.breach_module.breach_count > 0 ? 'var(--danger)' : 'var(--success)' }}>
                  {report.breach_module.breach_count} <span style={{ fontSize: '14px' }}>leaks</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📋</span> {t(UI_STRINGS.recsTitle)}
              </h3>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {report.recommendations.map((rec, i) => (
                  <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Download PDF button */}
            <button
              onClick={downloadPDF}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 600 }}
            >
              {t(UI_STRINGS.pdfBtn)}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default CombinedReport;
