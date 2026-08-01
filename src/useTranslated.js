import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { STATIC_TRANSLATIONS } from './staticTranslations';

/**
 * useTranslated(["Home", "Phishing Analyzer", "..."])
 * Returns { t, ready } where t("Home") gives the translated string.
 *
 * Checks the static dictionary FIRST.
 * Any missing keys get requested via live API, but existing static translations
 * are NEVER overwritten with fallback English.
 */
export function useTranslated(englishTexts) {
  const { language, translateTexts } = useLanguage();
  const [map, setMap] = useState({});
  const [ready, setReady] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (language === 'English') {
      const identityMap = {};
      englishTexts.forEach(t => { identityMap[t] = t; });
      setMap(identityMap);
      setReady(true);
      return;
    }

    const staticDict = STATIC_TRANSLATIONS[language] || {};
    const resultMap = {};
    const missing = [];

    englishTexts.forEach(text => {
      if (staticDict[text]) {
        resultMap[text] = staticDict[text];
      } else {
        resultMap[text] = text;
        missing.push(text);
      }
    });

    setMap(resultMap);
    setReady(true);

    if (missing.length > 0) {
      translateTexts(missing).then(liveResult => {
        if (!cancelled && liveResult) {
          setMap(prev => {
            const updated = { ...prev };
            missing.forEach(m => {
              if (liveResult[m] && liveResult[m] !== m) {
                updated[m] = liveResult[m];
              }
            });
            return updated;
          });
        }
      });
    }

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, JSON.stringify(englishTexts)]);

  const t = (englishText) => {
    if (language === 'English') return englishText;
    const staticDict = STATIC_TRANSLATIONS[language];
    if (staticDict && staticDict[englishText]) {
      return staticDict[englishText];
    }
    return map[englishText] || englishText;
  };

  return { t, ready };
}