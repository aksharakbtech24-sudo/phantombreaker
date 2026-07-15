import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ThreatScore from './ThreatScore';
import PDFReport from './PDFReport';

const API_URL = 'https://phantombreaker-backend-xleo.onrender.com';

function DeepfakeDetector({ addToHistory }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false
  });

  const analyze = async () => {
    if (!image) {
      setError('Please upload an image first.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', image);
      const response = await axios.post(`${API_URL}/api/detect-deepfake`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      addToHistory({
        type: 'Deepfake Detection',
        score: response.data.fake_score,
        summary: response.data.is_deepfake ? 'Deepfake Detected' : 'Image is Real',
        icon: '🤖'
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Make sure backend is running.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '36px' }}>🤖</span>
            <h1 style={{ fontSize: '32px', fontWeight: 700 }}>Deepfake Detector</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Upload any image. Real computer vision AI will analyze pixel patterns to detect if it was AI generated.
          </p>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? 'var(--accent-cyan)' : 'var(--border)'}`,
              borderRadius: '12px', padding: '48px',
              textAlign: 'center', cursor: 'pointer',
              background: isDragActive ? 'rgba(0,212,255,0.05)' : 'var(--bg-secondary)',
              transition: 'all 0.3s ease'
            }}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div>
                <img
                  src={preview} alt="Preview"
                  style={{
                    maxHeight: '300px', maxWidth: '100%',
                    borderRadius: '8px', marginBottom: '16px'
                  }}
                />
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🖼️</div>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px' }}>
                  {isDragActive ? 'Drop image here' : 'Drag & drop image here'}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  or click to browse — JPG, PNG, WEBP up to 10MB
                </p>
              </div>
            )}
          </div>

          {preview && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button
                className="btn-primary"
                onClick={reset}
                style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
              >
                Remove
              </button>
              <button className="btn-primary" onClick={analyze} disabled={loading}>
                {loading ? 'Analyzing...' : '🔍 Detect Deepfake'}
              </button>
            </div>
          )}
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
            <p style={{ color: 'var(--text-secondary)' }}>AI is analyzing image pixels...</p>
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div className="card" style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px'
            }}>
              <ThreatScore score={result.fake_score} />
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{
                  fontSize: '28px', fontWeight: 700, marginBottom: '8px',
                  color: result.is_deepfake ? 'var(--danger)' : 'var(--success)'
                }}>
                  {result.is_deepfake ? '⚠️ DEEPFAKE DETECTED' : '✅ IMAGE IS REAL'}
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                  {result.explanation}
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span className={`badge ${result.is_deepfake ? 'badge-danger' : 'badge-success'}`}>
                    {result.is_deepfake ? '🚨 Fake' : '✅ Real'}
                  </span>
                  <span className="badge badge-warning">
                    Confidence: {result.fake_score}%
                  </span>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <PDFReport scanData={result} type="Deepfake Detection" />
                </div>
              </div>
            </div>

            {result.indicators?.length > 0 && (
              <div className="card">
                <h3 style={{ marginBottom: '16px', color: 'var(--warning)' }}>
                  🔍 What Gave It Away
                </h3>
                {result.indicators.map((indicator, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,179,71,0.08)',
                    border: '1px solid rgba(255,179,71,0.2)',
                    borderRadius: '8px', padding: '12px 16px', marginBottom: '8px',
                    fontSize: '14px', color: 'var(--text-primary)'
                  }}>
                    🔸 {indicator}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default DeepfakeDetector;