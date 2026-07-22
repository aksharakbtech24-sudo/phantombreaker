import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { STATIC_TRANSLATIONS } from './staticTranslations';
 
/**
 * useTranslated(["Home", "Phishing Analyzer", "..."])
 * Returns { t, ready } where t("Home") gives the translated string
 * (or the English original while loading / if translation is English).
 *
 * Checks the static, pre-translated dictionary FIRST (instant, zero API cost).
 * Only falls back to the live Groq /api/translate endpoint for any strings
 * NOT covered by the static dictionary (e.g. a language without a static
 * entry, or brand-new text added after the static file was built).
 *
 * Usage:
 *   const { t } = useTranslated(['Home', 'Phishing', 'Deepfake']);
 *   <span>{t('Home')}</span>
 */
export function useTranslated(englishTexts) {
  const { language, translateTexts } = useLanguage();
  const [map, setMap] = useState({});
  const [ready, setReady] = useState(true);
 
  useEffect(() => {
    let cancelled = false;
 
    // English needs no translation at all.
    if (language === 'English') {
      const identityMap = {};
      englishTexts.forEach(t => { identityMap[t] = t; });
      setMap(identityMap);
      setReady(true);
      return;
    }
 
    const staticDict = STATIC_TRANSLATIONS[language];
 
    if (staticDict) {
      // Split into what the static dictionary already covers vs. what's missing.
      const resultMap = {};
      const missing = [];
      englishTexts.forEach(text => {
        if (staticDict[text]) {
          resultMap[text] = staticDict[text];
        } else {
          missing.push(text);
        }
      });
 
      // Show the static translations immediately — no waiting on any API call.
      setMap(resultMap);
      setReady(missing.length === 0);
 
      // Only call the live API for whatever the static file doesn't cover.
      if (missing.length > 0) {
        translateTexts(missing).then(liveResult => {
          if (!cancelled) {
            setMap(prev => ({ ...prev, ...liveResult }));
            setReady(true);
          }
        });
      }
      return () => { cancelled = true; };
    }
 
    // No static dictionary for this language at all — fall back to the
    // original live-API-only behavior.
    setReady(false);
    translateTexts(englishTexts).then(result => {
      if (!cancelled) {
        setMap(result);
        setReady(true);
      }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, JSON.stringify(englishTexts)]);
 
  const t = (englishText) => map[englishText] || englishText;
 
  return { t, ready };
}