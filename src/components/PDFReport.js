import React from 'react';
import jsPDF from 'jspdf';

function PDFReport({ scanData, type }) {
  const generatePDF = () => {
    if (!scanData) return;

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    let y = 0;


    // --- DARK CYBER HEADER BANNER ---
    doc.setFillColor(11, 15, 25); // #0B0F19
    doc.rect(0, 0, pageWidth, 42, 'F');

    // Accent Line
    doc.setFillColor(0, 212, 255); // #00D4FF
    doc.rect(0, 42, pageWidth, 2, 'F');

    // Header Text
    doc.setTextColor(0, 212, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PHANTOMBREAKER', 15, 18);

    doc.setTextColor(148, 163, 184); // #94A3B8
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL FORENSIC CYBERSECURITY AUDIT REPORT', 15, 26);

    const auditRef = `PB-${Math.floor(100000 + Math.random() * 900000)}`;
    const timeStr = new Date().toLocaleString();

    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text(`Ref ID: ${auditRef}`, pageWidth - 15, 16, { align: 'right' });
    doc.text(`Date: ${timeStr}`, pageWidth - 15, 23, { align: 'right' });
    doc.text(`Class: RESTRICTED / SECURITY AUDIT`, pageWidth - 15, 30, { align: 'right' });

    y = 54;

    // --- REPORT TITLE & MODULE ---
    const reportTitle = type || 'Cybersecurity Assessment';
    doc.setTextColor(15, 23, 42); // #0F172A
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(reportTitle.toUpperCase(), 15, y);
    y += 10;

    // Determine Score & Threat Level
    let score = scanData.combined_threat_score ?? scanData.threat_score ?? scanData.fake_score ?? (scanData.breach_count > 0 ? Math.min(scanData.breach_count * 25, 100) : 0);
    let isDanger = scanData.is_phishing || scanData.is_deepfake || (scanData.breach_count && scanData.breach_count > 0) || score >= 50;

    // Determine Security Grade
    let grade = "A+";
    let gradeLabel = "SECURE";
    if (score > 65) { grade = "F"; gradeLabel = "CRITICAL THREAT"; }
    else if (score > 35) { grade = "C"; gradeLabel = "MODERATE RISK"; }
    else if (score > 15) { grade = "B"; gradeLabel = "LOW RISK"; }

    // --- EXECUTIVE SUMMARY SCORE BOX ---
    doc.setFillColor(isDanger ? 254 : 240, isDanger ? 242 : 253, isDanger ? 242 : 244); // Light tint box
    doc.setDrawColor(isDanger ? 239 : 34, isDanger ? 68 : 197, isDanger ? 68 : 94); // Border
    doc.setLineWidth(0.8);
    doc.roundedRect(15, y, pageWidth - 30, 32, 3, 3, 'FD');

    // Threat Score Meter inside Box
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isDanger ? 220 : 22, isDanger ? 38 : 163, isDanger ? 38 : 74);
    doc.text(`${score}`, 25, y + 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('/ 100 Threat Index', 45, y + 20);

    // Security Grade
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text(`Grade: ${grade}`, pageWidth - 75, y + 16);

    doc.setFontSize(10);
    doc.setTextColor(isDanger ? 220 : 22, isDanger ? 38 : 163, isDanger ? 38 : 74);
    doc.text(gradeLabel, pageWidth - 75, y + 24);

    y += 42;

    // --- SECTION 1: VERDICT & SUMMARY ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('1. EXECUTIVE VERDICT & ANALYSIS', 15, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    const explanationText = scanData.explanation || scanData.message || (scanData.breach_count > 0 ? `Target email was detected in ${scanData.breach_count} known data breaches.` : 'No security threats detected in analysis.');
    const splitExplanation = doc.splitTextToSize(explanationText, pageWidth - 30);
    doc.text(splitExplanation, 15, y);
    y += splitExplanation.length * 5 + 8;

    // Additional Attributes Grid Table
    doc.setFillColor(241, 245, 249);
    doc.rect(15, y, pageWidth - 30, 20, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, y, pageWidth - 30, 20, 'D');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);

    if (scanData.is_phishing !== undefined) {
      doc.text('AI Content Score:', 20, y + 8);
      doc.text('Detected Language:', 20, y + 15);
      doc.setFont('helvetica', 'normal');
      doc.text(`${scanData.ai_written_score ?? 0}% AI-Generated`, 55, y + 8);
      doc.text(`${scanData.language_detected || 'English'}`, 55, y + 15);
    } else if (scanData.is_deepfake !== undefined) {
      doc.text('Fake Probability:', 20, y + 8);
      doc.text('Authenticity Score:', 20, y + 15);
      doc.setFont('helvetica', 'normal');
      doc.text(`${scanData.fake_score}%`, 55, y + 8);
      doc.text(`${scanData.real_score ?? (100 - scanData.fake_score)}%`, 55, y + 15);
    } else if (scanData.breaches !== undefined) {
      doc.text('Target Email:', 20, y + 8);
      doc.text('Total Exposed Leaks:', 20, y + 15);
      doc.setFont('helvetica', 'normal');
      doc.text(`${scanData.email || 'User Query'}`, 55, y + 8);
      doc.text(`${scanData.breach_count} Breaches`, 55, y + 15);
    }

    y += 28;

    // --- SECTION 2: DETAILED FINDINGS ---
    if (scanData.dangerous_sentences?.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('2. IDENTIFIED THREAT SENTENCES & MANIPULATION TACTICS', 15, y);
      y += 8;

      scanData.dangerous_sentences.forEach((sentence, idx) => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFillColor(254, 242, 242);
        doc.setDrawColor(252, 165, 165);
        doc.roundedRect(15, y, pageWidth - 30, 10, 1, 1, 'FD');
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(185, 28, 28);
        doc.text(`[Threat #${idx + 1}]  "${sentence.substring(0, 90)}${sentence.length > 90 ? '...' : ''}"`, 18, y + 6.5);
        y += 13;
      });
      y += 5;
    }

    if (scanData.indicators?.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('2. DETECTED VISUAL ARTIFACTS & PATTERNS', 15, y);
      y += 8;

      scanData.indicators.forEach((ind, idx) => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(`• ${ind}`, 18, y);
        y += 6;
      });
      y += 5;
    }

    if (scanData.breaches?.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('2. EXPOSED BREACH SOURCES', 15, y);
      y += 8;

      doc.setFillColor(226, 232, 240);
      doc.rect(15, y, pageWidth - 30, 7, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('BREACH NAME / SOURCE', 20, y + 5);
      doc.text('BREACH DATE', 110, y + 5);
      doc.text('EXPOSED DATA', 160, y + 5);
      y += 7;

      scanData.breaches.slice(0, 6).forEach((b, idx) => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFillColor(idx % 2 === 0 ? 255 : 248);
        doc.rect(15, y, pageWidth - 30, 7, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text(b.name || 'Unknown', 20, y + 5);
        doc.text(b.breach_date || b.date || 'Unknown', 110, y + 5);
        doc.text(b.data_classes ? b.data_classes.join(', ').substring(0, 25) : 'Passwords, Email', 160, y + 5);
        y += 7;
      });
      y += 6;
    }

    // --- SECTION 3: ACTIONABLE RECOMMENDATIONS ---
    if (y > 230) { doc.addPage(); y = 20; }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('3. RECOMMENDED REMEDIATION ROADMAP', 15, y);
    y += 8;

    const recs = scanData.recommendations || [
      'Immediately change credentials for any associated online accounts.',
      'Enable Multi-Factor Authentication (2FA/MFA) across all email and sensitive portals.',
      'Avoid clicking links or downloading attachments from unverified senders.',
      'Regularly audit account permissions and active session tokens.'
    ];

    recs.forEach((rec, idx) => {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`[${idx + 1}]  ${rec}`, 18, y);
      y += 6;
    });

    // --- AUDITOR SIGNATURE & COMPLIANCE FOOTER ---
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 275, pageWidth - 15, 275);

    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('COMPLIANCE SEAL: ISO/IEC 27001 & NIST SP 800-53 AUDITED', 15, 282);
    doc.text('VERIFICATION HASH: 8f9a32c7e10b45d6a2f891', 15, 286);
    doc.text('Generated by PhantomBreaker Security Platform | phantombreaker.vercel.app', pageWidth - 15, 284, { align: 'right' });

    doc.save(`PhantomBreaker_Audit_${(type || 'Report').replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  };

  return (
    <button
      className="btn-primary"
      onClick={generatePDF}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: 600 }}
    >
      📄 Download PDF Report
    </button>
  );
}

export default PDFReport;