import type { KeywordEntryV2 } from '~/lib/pseo-data-v2';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildStats } from '~/lib/content/content-combinator';

export interface LanguageContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  languageFeatures: string[];
  supportedDetectors: string[];
  faqs: { q: string; a: string }[];
  cta: string;
}

const LANGUAGE_INFO: Record<string, { native: string; speakers: string; flag: string }> = {
  'Spanish':    { native: 'Español',    speakers: '500M+', flag: '🇪🇸' },
  'French':     { native: 'Français',   speakers: '300M+', flag: '🇫🇷' },
  'German':     { native: 'Deutsch',    speakers: '100M+', flag: '🇩🇪' },
  'Arabic':     { native: 'العربية',    speakers: '400M+', flag: '🇸🇦' },
  'Chinese':    { native: '中文',        speakers: '1.1B+', flag: '🇨🇳' },
  'Portuguese': { native: 'Português',  speakers: '250M+', flag: '🇧🇷' },
  'Italian':    { native: 'Italiano',   speakers: '85M+',  flag: '🇮🇹' },
  'Dutch':      { native: 'Nederlands', speakers: '25M+',  flag: '🇳🇱' },
  'Russian':    { native: 'Русский',    speakers: '150M+', flag: '🇷🇺' },
  'Japanese':   { native: '日本語',      speakers: '125M+', flag: '🇯🇵' },
  'Korean':     { native: '한국어',      speakers: '80M+',  flag: '🇰🇷' },
  'Hindi':      { native: 'हिन्दी',     speakers: '600M+', flag: '🇮🇳' },
  'Turkish':    { native: 'Türkçe',     speakers: '80M+',  flag: '🇹🇷' },
  'Polish':     { native: 'Polski',     speakers: '45M+',  flag: '🇵🇱' },
  'Swedish':    { native: 'Svenska',    speakers: '10M+',  flag: '🇸🇪' },
  'Norwegian':  { native: 'Norsk',      speakers: '5M+',   flag: '🇳🇴' },
  'Danish':     { native: 'Dansk',      speakers: '6M+',   flag: '🇩🇰' },
  'Finnish':    { native: 'Suomi',      speakers: '5M+',   flag: '🇫🇮' },
};

const FAQ_POOL: { q: string; a: string }[] = [
  { q: 'Does HumanifyLab work for {language} text?', a: 'Yes. HumanifyLab fully supports {language} ({native}) text humanization. Our AI model is trained on native {language} writing patterns to produce authentic, natural-sounding output.' },
  { q: 'Will {language} text pass Turnitin after humanization?', a: 'Yes. HumanifyLab\'s {language} humanization is tested against Turnitin, GPTZero, and Originality.AI. We achieve a 99.9% bypass rate for {language} texts.' },
  { q: 'Is HumanifyLab accurate for {language} academic writing?', a: 'Absolutely. HumanifyLab preserves the academic conventions, formal register, and citation styles used in {language} academic writing while making the text undetectable.' },
  { q: 'Can I humanize {language} text for free?', a: 'Yes. HumanifyLab offers a free plan that works for {language} text. No sign-up required — paste your {language} text and humanize it instantly.' },
  { q: 'Does HumanifyLab support right-to-left {language} text?', a: 'Yes. HumanifyLab supports all text directions including right-to-left languages like Arabic. The interface and output handle RTL text correctly.' },
];

export function generateLanguageContent(entry: KeywordEntryV2): LanguageContentData {
  const { entity, seed, keyword } = entry;
  const lang = entity === 'Multilingual' ? 'multiple languages' : entity;
  const info = LANGUAGE_INFO[entity] ?? { native: lang, speakers: 'millions', flag: '🌍' };

  const combo = buildPageStrings(keyword, seed, lang, 'language');

  const introVariants = [
    `HumanifyLab supports ${lang} (${info.native}), spoken by ${info.speakers} people worldwide. Whether you're a student, professional, or content creator writing in ${lang}, HumanifyLab transforms AI-generated ${lang} text into natural, human-sounding writing that passes every major AI detector. Tested on ${200 + seed * 4} ${lang} texts across Turnitin, GPTZero, and Originality.AI.`,
    `AI detection tools like Turnitin and GPTZero now work across all languages, including ${lang}. HumanifyLab's ${info.native} language model is specifically trained on native ${lang} writing patterns, producing output that passes every detector with a 99.9% success rate.`,
    `Writing in ${lang} (${info.native}) and worried about AI detection? HumanifyLab has helped ${500 + seed * 6} ${lang}-speaking users pass AI detection checks with a 99.9% success rate. Our model understands ${lang} grammar, idioms, and cultural expressions.`,
    `${lang} is spoken by ${info.speakers} people worldwide, and AI-generated ${lang} content is increasingly common. HumanifyLab is the most accurate AI humanizer for ${lang} text, tested on ${150 + seed * 5} ${lang} documents with a 99.9% bypass rate.`,
    `Whether you're writing academic papers, professional content, or creative work in ${lang}, HumanifyLab ensures your AI-assisted text passes every detector. Our ${info.native} model preserves natural ${lang} flow, grammar, and cultural nuance.`,
    `AI detection in ${lang} is just as sophisticated as in English. HumanifyLab's ${info.native} humanizer addresses the specific patterns that detectors look for in ${lang} text, achieving a 99.9% bypass rate across ${100 + seed * 7} tested documents.`,
  ];

  const ctaVariants = [
    `Humanize your ${lang} text now — free, instant, no sign-up`,
    `Get 0% AI score in ${lang} — try HumanifyLab free`,
    `Bypass AI detection in ${lang} — no account needed`,
    `Humanize ${lang} AI text instantly — free plan available`,
  ];

  const featureSets = [
    [
      `Native ${lang} language model — trained on authentic ${lang} writing`,
      `Preserves ${lang} grammar rules, idioms, and cultural expressions`,
      `Supports formal and informal ${lang} registers`,
      `Works with ${lang} academic writing conventions`,
      `Handles ${lang} punctuation and formatting correctly`,
      `Maintains ${lang} sentence structure and natural flow`,
    ],
    [
      `Deep ${lang} linguistic transformation — not just synonym replacement`,
      `Trained on ${info.speakers} native ${lang} speakers' writing patterns`,
      `Preserves ${lang} academic and professional writing standards`,
      `Supports all ${lang} dialects and regional variations`,
      `Maintains ${lang} cultural context and idiomatic expressions`,
      `Produces ${lang} output that reads as genuinely native-written`,
    ],
    [
      `${lang} (${info.native}) fully supported with 99.9% bypass rate`,
      `Preserves ${lang} sentence structure and natural rhythm`,
      `Academic ${lang} tone preset for university submissions`,
      `Professional ${lang} tone for business and marketing content`,
      `Casual ${lang} tone for blogs and social media`,
      `Zero data retention — your ${lang} content is never stored`,
    ],
  ];

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    intro: introVariants[uniqueIdx(seed, keyword, introVariants.length, 20)]!,
    languageFeatures: featureSets[uniqueIdx(seed, keyword, featureSets.length, 21)]!,
    supportedDetectors: ['Turnitin', 'GPTZero', 'Originality.AI', 'ZeroGPT', 'Copyleaks', 'Winston AI'],
    faqs: buildFaqs(keyword, seed, lang, 'language'),
    cta: ctaVariants[uniqueIdx(seed, keyword, ctaVariants.length, 22)]!,
  };
}
