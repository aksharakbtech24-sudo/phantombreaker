import React from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

function PDFReport({ scanData, type }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Background
    doc.setFillColor(10, 10, 15);
    doc.rect(0, 0, pageWidth, 297, 'F');

    // Header bar
    doc.setFillColor(0, 212, 255);
    doc.rect(0, 0, pageWidth, 2, 'F');

    // Logo area
    doc.setFillColor(19, 19, 31);
    doc.roundedRect(14, 10, pageWidth - 28, 30, 3, 3, 'F');

    // Title
    doc.setTextColor(0, 212, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PhantomBreaker', 20, 28);

    doc.setTextColor(136, 146, 164);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('AI-Powered Cybersecurity Platform', 20, 36);

    // Report type badge
    doc.setFillColor(0, 212, 255);
    doc.roundedRect(pageWidth - 70, 14, 56, 18, 3, 3, 'F');
    doc.setTextColor(10, 10, 15);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('SECURITY REPORT', pageWidth - 67, 25);

    // Date
    doc.setTextColor(136, 146, 164);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 50);
    doc.text(`Report Type: ${type}`, 20, 57);

    // Divider
    doc.setDrawColor(30, 32, 48);
    doc.line(14, 62, pageWidth - 14, 62);

    // Threat Score Section
    doc.setFillColor(19, 19, 31);
    doc.roundedRect(14, 68, pageWidth - 28, 40, 3, 3, 'F');

    const score = scanData?.combined_threat_score ||
      scanData?.fake_score ||
      (scanData?.breach_count > 0 ? Math.min(scanData.breach_count * 15, 100) : 0);

    const scoreColor = score >= 70 ? [255, 45, 120] :
      score >= 40 ? [255, 179, 71] : [0, 255, 136];

    doc.setTextColor(...scoreColor);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text(`${score}/100`, 20, 98);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('THREAT SCORE', 70, 82);

    const verdict = score >= 70 ? '⚠ HIGH THREAT DETECTED' :
      score >= 40 ? '⚡ MEDIUM RISK' : '✓ LOW RISK - SAFE';

    doc.setTextColor(...scoreColor);
    doc.setFontSize(12);
    doc.text(verdict, 70, 95);

    doc.setTextColor(136, 146, 164);
    doc.setFontSize(9);
    doc.text(
      score >= 70 ? 'Immediate action required' :
        score >= 40 ? 'Review recommended' : 'No immediate action needed',
      70, 104
    );

    let yPos = 118;

    // Phishing specific
    if (type === 'Phishing Analysis' && scanData) {
      // Verdict
      doc.setFillColor(19, 19, 31);
      doc.roundedRect(14, yPos, pageWidth - 28, 28, 3, 3, 'F');
      doc.setTextColor(0, 212, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('ANALYSIS VERDICT', 20, yPos + 10);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(scanData.is_phishing ? '⚠ PHISHING DETECTED' : '✓ EMAIL IS SAFE', 20, yPos + 20);
      doc.setTextColor(136, 146, 164);
      doc.setFontSize(9);
      doc.text(`AI Written Score: ${scanData.ai_written_score}%  |  Language: ${scanData.language_detected}`, pageWidth - 14, yPos + 20, { align: 'right' });
      yPos += 36;

      // Explanation
      if (scanData.explanation) {
        doc.setFillColor(19, 19, 31);
        doc.roundedRect(14, yPos, pageWidth - 28, 24, 3, 3, 'F');
        doc.setTextColor(0, 212, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('EXPLANATION', 20, yPos + 10);
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(scanData.explanation, pageWidth - 40);
        doc.text(lines[0], 20, yPos + 18);
        yPos += 32;
      }

      // Dangerous sentences
      if (scanData.dangerous_sentences?.length > 0) {
        doc.setFillColor(40, 10, 20);
        doc.roundedRect(14, yPos, pageWidth - 28, 12 + scanData.dangerous_sentences.length * 14, 3, 3, 'F');
        doc.setDrawColor(255, 45, 120);
        doc.roundedRect(14, yPos, pageWidth - 28, 12 + scanData.dangerous_sentences.length * 14, 3, 3, 'S');
        doc.setTextColor(255, 45, 120);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('DANGEROUS SENTENCES', 20, yPos + 10);
        yPos += 16;
        scanData.dangerous_sentences.forEach(sentence => {
          doc.setTextColor(220, 220, 220);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          const lines = doc.splitTextToSize(`• ${sentence}`, pageWidth - 44);
          doc.text(lines[0], 22, yPos);
          yPos += 14;
        });
        yPos += 8;
      }

      // Manipulation tactics
      if (scanData.manipulation_tactics?.length > 0) {
        doc.setFillColor(19, 19, 31);
        doc.roundedRect(14, yPos, pageWidth - 28, 12 + Math.ceil(scanData.manipulation_tactics.length / 2) * 12, 3, 3, 'F');
        doc.setTextColor(255, 179, 71);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('MANIPULATION TACTICS', 20, yPos + 10);
        yPos += 16;
        scanData.manipulation_tactics.forEach((tactic, i) => {
          doc.setTextColor(220, 220, 220);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          if (i % 2 === 0) {
            doc.text(`• ${tactic}`, 22, yPos);
          } else {
            doc.text(`• ${tactic}`, pageWidth / 2, yPos);
            yPos += 12;
          }
        });
        yPos += 16;
      }
    }

    // Deepfake specific
    if (type === 'Deepfake Detection' && scanData) {
      doc.setFillColor(19, 19, 31);
      doc.roundedRect(14, yPos, pageWidth - 28, 28, 3, 3, 'F');
      doc.setTextColor(0, 212, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('DETECTION RESULT', 20, yPos + 10);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(scanData.is_deepfake ? '⚠ DEEPFAKE DETECTED' : '✓ IMAGE IS REAL', 20, yPos + 20);
      doc.setTextColor(136, 146, 164);
      doc.text(`Confidence: ${scanData.fake_score}%`, pageWidth - 14, yPos + 20, { align: 'right' });
      yPos += 36;

      if (scanData.explanation) {
        doc.setFillColor(19, 19, 31);
        doc.roundedRect(14, yPos, pageWidth - 28, 24, 3, 3, 'F');
        doc.setTextColor(0, 212, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('EXPLANATION', 20, yPos + 10);
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(scanData.explanation, 20, yPos + 18);
        yPos += 32;
      }

      if (scanData.indicators?.length > 0) {
        doc.setFillColor(19, 19, 31);
        doc.roundedRect(14, yPos, pageWidth - 28, 12 + scanData.indicators.length * 14, 3, 3, 'F');
        doc.setTextColor(255, 179, 71);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('INDICATORS', 20, yPos + 10);
        yPos += 16;
        scanData.indicators.forEach(ind => {
          doc.setTextColor(220, 220, 220);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.text(`• ${ind}`, 22, yPos);
          yPos += 14;
        });
      }
    }

    // Breach specific
    if (type === 'Breach Scan' && scanData) {
      doc.setFillColor(19, 19, 31);
      doc.roundedRect(14, yPos, pageWidth - 28, 28, 3, 3, 'F');
      doc.setTextColor(0, 212, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('BREACH SUMMARY', 20, yPos + 10);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        scanData.breach_count > 0
          ? `Found in ${scanData.breach_count} data breaches`
          : '✓ No breaches found',
        20, yPos + 20
      );
      yPos += 36;

      if (scanData.breaches?.length > 0) {
        scanData.breaches.slice(0, 8).forEach(breach => {
          if (yPos > 260) return;
          doc.setFillColor(19, 19, 31);
          doc.roundedRect(14, yPos, pageWidth - 28, 22, 2, 2, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(breach.name, 20, yPos + 9);
          doc.setTextColor(136, 146, 164);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.text(`Date: ${breach.breach_date}`, 20, yPos + 17);
          if (breach.data_classes?.length > 0) {
            doc.text(`Data: ${breach.data_classes.slice(0, 4).join(', ')}`, 80, yPos + 17);
          }
          yPos += 26;
        });
      }
    }

    // Recommendations
    if (yPos < 230) {
      yPos += 10;
      doc.setFillColor(10, 25, 20);
      doc.roundedRect(14, yPos, pageWidth - 28, 48, 3, 3, 'F');
      doc.setDrawColor(0, 255, 136);
      doc.roundedRect(14, yPos, pageWidth - 28, 48, 3, 3, 'S');
      doc.setTextColor(0, 255, 136);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('RECOMMENDATIONS', 20, yPos + 10);
      const recs = score >= 70
        ? ['Change all passwords immediately', 'Enable 2FA on all accounts', 'Report to cybercrime.gov.in']
        : score >= 40
          ? ['Review flagged content carefully', 'Update passwords as precaution', 'Stay vigilant online']
          : ['Keep software updated', 'Use strong unique passwords', 'Enable 2FA everywhere'];
      recs.forEach((rec, i) => {
        doc.setTextColor(200, 220, 200);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`${i + 1}. ${rec}`, 20, yPos + 22 + i * 10);
      });
      yPos += 56;
    }

    // Footer
    doc.setFillColor(19, 19, 31);
    doc.rect(0, 280, pageWidth, 17, 'F');
    doc.setFillColor(0, 212, 255);
    doc.rect(0, 295, pageWidth, 2, 'F');
    doc.setTextColor(136, 146, 164);
    doc.setFontSize(8);
    doc.text('PhantomBreaker — AI Cybersecurity Platform', 14, 290);
    doc.text('phantombreaker.vercel.app', pageWidth - 14, 290, { align: 'right' });

    doc.save(`PhantomBreaker_${type.replace(/\s/g, '_')}_${Date.now()}.pdf`);
  };

  return (
    <motion.button
      className="btn-primary"
      onClick={generatePDF}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'linear-gradient(135deg, #00ff88, #00d4ff)'
      }}
    >
      📄 Download PDF Report
    </motion.button>
  );
}

export default PDFReport;