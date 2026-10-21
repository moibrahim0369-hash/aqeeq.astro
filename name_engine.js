/* AQEQ ASTRO · Core Name Numbers Engine v1.0.0
 * CommonJS + browser global. Calculation only; no interpretation texts.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AqeqNameEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const MASTER_NUMBERS = new Set([11, 22, 33]);
  const MASTER_ROOTS = Object.freeze({ 11: 2, 22: 4, 33: 6 });
  const ARABIC_VALUES = Object.freeze({
    'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,
    'ي':1,'ك':2,'ل':3,'م':4,'ن':5,'س':6,'ع':7,'ف':8,'ص':9,
    'ق':1,'ر':2,'ش':3,'ت':4,'ث':5,'خ':6,'ذ':7,'ض':8,'ظ':9,'غ':1
  });
  const LATIN_VALUES = Object.freeze({
    A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
    J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
    S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
  });
  const ARABIC_VOWELS = new Set(['ا','و','ي']);
  const LATIN_VOWELS = new Set(['A','E','I','O','U']);
  // Declared normalization choices: ة→ه; standalone ء is ignored.
  const ARABIC_NORMALIZATION = Object.freeze({
    'أ':'ا','إ':'ا','آ':'ا','ٱ':'ا','ى':'ي','ئ':'ي','ؤ':'و','ة':'ه'
  });

  function stripArabicDiacritics(value) {
    return value.normalize('NFC').replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  }
  function normalizeName(name, language) {
    if (typeof name !== 'string') throw new TypeError('name must be a string');
    const requested = language || 'auto';
    if (!['auto','arabic','latin'].includes(requested)) throw new RangeError('language must be "auto", "arabic", or "latin"');
    const cleaned = stripArabicDiacritics(name).trim();
    const hasArabic = /[\u0600-\u06FF]/.test(cleaned);
    const hasLatin = /[A-Za-z]/.test(cleaned);
    let resolved = requested;
    if (requested === 'auto') {
      if (hasArabic && hasLatin) throw new Error('Mixed Arabic/Latin names require an explicit language');
      if (hasArabic) resolved = 'arabic';
      else if (hasLatin) resolved = 'latin';
      else throw new Error('No supported Arabic or Latin letters found');
    }
    const normalizedName = [...cleaned].map(ch => resolved === 'arabic' ? (ARABIC_NORMALIZATION[ch] || ch) : ch.toUpperCase()).join('');
    return { originalName: name, normalizedName, language: resolved };
  }
  function digitSum(value) {
    return String(Math.abs(value)).split('').reduce((sum, digit) => sum + Number(digit), 0);
  }
  function reduceNumber(value) {
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) throw new TypeError('value must be a non-negative integer');
    let current = value;
    while (current > 9 && !MASTER_NUMBERS.has(current)) current = digitSum(current);
    const isMaster = MASTER_NUMBERS.has(current);
    return { value: current, root: isMaster ? MASTER_ROOTS[current] : current, isMaster };
  }
  function getLetterProfile(normalizedName, language) {
    const values = language === 'arabic' ? ARABIC_VALUES : LATIN_VALUES;
    const vowels = language === 'arabic' ? ARABIC_VOWELS : LATIN_VOWELS;
    const letters = [];
    for (const ch of [...normalizedName]) {
      if (Object.prototype.hasOwnProperty.call(values, ch)) letters.push({ letter: ch, value: values[ch], isVowel: vowels.has(ch) });
    }
    return letters;
  }
  function reduceToSingleDigit(value) {
    let current = Math.abs(Number(value) || 0);
    while (current > 9) current = digitSum(current);
    return current;
  }
  function summarizeGroup(letters, singleDigitOnly) {
    if (!letters.length) return { rawTotal: null, value: null, root: null, isMaster: false, letterCount: 0, status: 'no_matching_letters' };
    const rawTotal = letters.reduce((sum, item) => sum + item.value, 0);
    if (singleDigitOnly) {
      const value = reduceToSingleDigit(rawTotal);
      return { rawTotal, value, root: value, isMaster: false, letterCount: letters.length, status: 'ok' };
    }
    return { rawTotal, ...reduceNumber(rawTotal), letterCount: letters.length, status: 'ok' };
  }
  function calculateNameNumbers(name, options) {
    const opts = options || {};
    const normalized = normalizeName(name, opts.language || 'auto');
    const profile = getLetterProfile(normalized.normalizedName, normalized.language);
    const vowels = profile.filter(item => item.isVowel);
    const consonants = profile.filter(item => !item.isVowel);
    // Arabic spellings often omit short vowels. If no vowel letters are written,
    // use the whole name as a documented fallback for Soul Urge so the result
    // remains a valid single digit instead of becoming unavailable.
    const soulLetters = vowels.length ? vowels : profile;
    const soulUrge = summarizeGroup(soulLetters, true);
    if (!vowels.length && profile.length) soulUrge.status = 'fallback_to_full_name_no_written_vowels';
    return {
      engine: 'AQEQ ASTRO · Core Name Numbers', version: '1.1.0',
      language: normalized.language, originalName: normalized.originalName, normalizedName: normalized.normalizedName,
      soulUrge, expression: summarizeGroup(profile), personality: summarizeGroup(consonants),
      diagnostics: {
        supportedLetterCount: profile.length,
        ignoredCharacterCount: [...normalized.normalizedName].length - profile.length,
        masterNumbers: [11,22,33], latinYPolicy: 'consonant',
        arabicNormalizationPolicy: 'أ/إ/آ/ٱ→ا; ى/ئ→ي; ؤ→و; ة→ه; ء ignored'
      }
    };
  }
  return Object.freeze({ version:'1.1.0', MASTER_NUMBERS:Object.freeze([11,22,33]), ARABIC_VALUES, LATIN_VALUES, normalizeName, reduceNumber, calculateNameNumbers });
});
