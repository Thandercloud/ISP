import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LanguageSelectorProps {
  portalType: 'admin' | 'customer';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ portalType }) => {
  const { currentLang, changeLanguage } = useAuth();
  const [open, setOpen] = useState(false);

  const activeLang = currentLang(portalType);

  const handleSelect = (lang: 'bn' | 'en') => {
    changeLanguage(lang, portalType);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition border border-slate-700 shadow-2xs"
      >
        <Globe className="w-3.5 h-3.5 text-indigo-400" />
        <span>{activeLang === 'bn' ? '🇧🇩 বাংলা' : '🇬🇧 English'}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white shadow-xl border border-slate-200 z-50 overflow-hidden py-1 animate-fade-in text-xs font-bold text-slate-800">
          <button
            onClick={() => handleSelect('bn')}
            className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 transition ${
              activeLang === 'bn' ? 'bg-indigo-50 text-indigo-700' : ''
            }`}
          >
            <span className="text-base">🇧🇩</span>
            <span>বাংলা</span>
          </button>
          <button
            onClick={() => handleSelect('en')}
            className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 transition ${
              activeLang === 'en' ? 'bg-indigo-50 text-indigo-700' : ''
            }`}
          >
            <span className="text-base">🇬🇧</span>
            <span>English</span>
          </button>
        </div>
      )}
    </div>
  );
};
