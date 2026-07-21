import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
 
/**
 * useTranslated(["Home", "Phishing Analyzer", "..."])
 * Returns { t, ready } where t("Home") gives the translated string
 * (or the English original while loading / if translation is English).
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
 