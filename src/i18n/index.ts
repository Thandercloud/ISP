import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from '../locales/en';
import { bn } from '../locales/bn';

const resources = {
  en: { translation: en },
  bn: { translation: bn }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('spades_lang_admin') || 'bn', // Default to Bangla as requested
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

// Helper to convert western digits (0-9) to Bangla digits (০-৯)
export const toBanglaDigits = (str: string | number): string => {
  if (str === undefined || str === null) return '';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.toString().replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit)]);
};

// Helper to format currency in ৳ with locale digits
export const formatCurrency = (amount: number, lang: string = 'bn'): string => {
  const formatted = amount.toLocaleString();
  if (lang === 'bn') {
    return `৳${toBanglaDigits(formatted)}`;
  }
  return `৳${formatted}`;
};

// Helper to format numbers in locale digits
export const formatNumber = (num: number | string, lang: string = 'bn'): string => {
  const formatted = num.toLocaleString();
  if (lang === 'bn') {
    return toBanglaDigits(formatted);
  }
  return formatted.toString();
};

// Helper to format dates for Bangla/English
export const formatDate = (dateStr: string, lang: string = 'bn'): string => {
  if (!dateStr) return '';
  if (lang === 'bn') {
    const monthNamesBn: { [key: string]: string } = {
      'Jan': 'জানুয়ারি', 'Feb': 'ফেব্রুয়ারি', 'Mar': 'মার্চ', 'Apr': 'এপ্রিল',
      'May': 'মে', 'Jun': 'জুন', 'Jul': 'জুলাই', 'Aug': 'আগস্ট',
      'Sep': 'সেপ্টেম্বর', 'Oct': 'অক্টোবর', 'Nov': 'নভেম্বর', 'Dec': 'ডিসেম্বর'
    };
    let res = dateStr;
    Object.keys(monthNamesBn).forEach((m) => {
      res = res.replace(m, monthNamesBn[m]);
    });
    return toBanglaDigits(res);
  }
  return dateStr;
};
