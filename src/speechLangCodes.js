// Maps site language names to BCP-47 speech codes for the Web Speech API.
// Browser/OS voice availability varies — if a specific voice isn't installed,
// the browser falls back to its default voice but still attempts the
// correct language pronunciation rules where possible.
export const SPEECH_LANG_CODES = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Bengali: 'bn-IN',
  Telugu: 'te-IN',
  Marathi: 'mr-IN',
  Tamil: 'ta-IN',
  Urdu: 'ur-IN',
  Gujarati: 'gu-IN',
  Kannada: 'kn-IN',
  Odia: 'or-IN',
  Malayalam: 'ml-IN',
  Punjabi: 'pa-IN',
  Assamese: 'as-IN',
  Maithili: 'hi-IN',   // no dedicated browser voice — falls back to Hindi pronunciation rules
  Sanskrit: 'hi-IN',
  Nepali: 'ne-NP',
  Konkani: 'mr-IN',
  Sindhi: 'ur-IN',
  Dogri: 'hi-IN',
  Manipuri: 'hi-IN',
  Bodo: 'hi-IN',
  Santali: 'hi-IN',
  Kashmiri: 'ur-IN',
};
 
export function speechLangCode(language) {
  return SPEECH_LANG_CODES[language] || 'en-IN';
}