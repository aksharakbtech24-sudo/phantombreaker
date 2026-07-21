import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
 
const API_URL = 'https://phantombreaker-backend-xleo.onrender.com';
 
// All 22 official Indian languages + English
export const LANGUAGES = [
  'English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu',
  'Gujarati', 'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Assamese',
  'Maithili', 'Sanskrit', 'Nepali', 'Konkani', 'Sindhi', 'Dogri',
  'Manipuri', 'Bodo', 'Santali', 'Kashmiri'
];
 
const LanguageContext = createContext(null);
 
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('English');
  // cache shape: { [language]: { [englishText]: translatedText } }
  const [cache, setCache] = useState({ English: {} });
  const [translating, setTranslating] = useState(false);
 
  /**
   * Pass an array of English UI strings. Returns a map of English -> translated
   * for the current language, fetching only the ones not already cached.
   */
  const translateTexts = useCallback(async (texts) => {
    if (language === 'English') {
      const map = {};
      texts.forEach(t => { map[t] = t; });
      return map;
    }
 
    const existing = cache[language] || {};
    const missing = texts.filter(t => !(t in existing));
 
    if (missing.length === 0) {
      return existing;
    }
 
    setTranslating(true);
    try {
      const response = await axios.post(`${API_URL}/api/translate`, {
        texts: missing,
        target_language: language
      });
      const translated = response.data.translations;
 
      const updated = { ...existing };
      missing.forEach((original, i) => {
        updated[original] = translated[i] || original;
      });
 
      setCache(prev => ({ ...prev, [language]: updated }));
      return updated;
    } catch (err) {
      console.error('Translation failed:', err);
      // Fallback: show original English text rather than breaking the page
      const fallback = { ...existing };
      missing.forEach(t => { fallback[t] = t; });
      return fallback;
    } finally {
      setTranslating(false);
    }
  }, [language, cache]);
 
  return (
    <LanguageContext.Provider value={{ language, setLanguage, translateTexts, translating }}>
      {children}
    </LanguageContext.Provider>
  );
}
 
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}