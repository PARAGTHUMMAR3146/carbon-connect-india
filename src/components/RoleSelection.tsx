import React from 'react';
import { Leaf, Factory, Languages, ArrowRight, Shield, Zap, Globe, Settings } from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';

interface RoleSelectionProps {
  lang: Language;
  onToggleLang: () => void;
  onSelectRole: (role: 'seller' | 'buyer' | 'admin') => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ lang, onToggleLang, onSelectRole }) => {
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];

  return (
    <div className="min-h-screen bg-background bg-pattern-dots flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-emerald">
            <Leaf className="text-primary-foreground" size={22} />
          </div>
          <span className="text-xl font-bold text-foreground">{t('appTitle')}</span>
        </div>
        <button 
          onClick={onToggleLang}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
        >
          <Languages size={18} />
          <span className="text-sm font-medium">{t('switchLang')}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-5xl w-full">
          {/* Hero Text */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 tracking-tight">
              {t('appTagline')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {lang === 'en' 
                ? 'Connect farmers and industries. Trade carbon credits seamlessly. Build a sustainable future together.'
                : 'किसानों और उद्योगों को जोड़ें। कार्बन क्रेडिट का आसानी से व्यापार करें। एक साथ टिकाऊ भविष्य बनाएं।'}
            </p>
          </div>

          {/* Role Selection Title */}
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            {t('roleSelectTitle')}
          </h2>

          {/* Role Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Farmer/Seller Card */}
            <button
              onClick={() => onSelectRole('seller')}
              className="role-card role-card-seller group text-left"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Leaf className="text-primary" size={32} />
                </div>
                <ArrowRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{t('farmer')}</h3>
              <p className="text-muted-foreground mb-6">{t('farmerDesc')}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-primary text-xs font-medium">
                  {lang === 'en' ? 'Sell Credits' : 'क्रेडिट बेचें'}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-primary text-xs font-medium">
                  {lang === 'en' ? 'Track Earnings' : 'कमाई ट्रैक करें'}
                </span>
              </div>
            </button>

            {/* Industry/Buyer Card */}
            <button
              onClick={() => onSelectRole('buyer')}
              className="role-card role-card-buyer group text-left"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-navy-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Factory className="text-secondary" size={32} />
                </div>
                <ArrowRight className="text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{t('buyer')}</h3>
              <p className="text-muted-foreground mb-6">{t('buyerDesc')}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-navy-100 text-secondary text-xs font-medium">
                  {lang === 'en' ? 'Buy Credits' : 'क्रेडिट खरीदें'}
                </span>
                <span className="px-3 py-1 rounded-full bg-navy-100 text-secondary text-xs font-medium">
                  {lang === 'en' ? 'Offset Carbon' : 'कार्बन ऑफसेट'}
                </span>
              </div>
            </button>

            {/* Admin Card */}
            <button
              onClick={() => onSelectRole('admin')}
              className="role-card group text-left hover:border-destructive hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="text-destructive" size={32} />
                </div>
                <ArrowRight className="text-muted-foreground group-hover:text-destructive group-hover:translate-x-1 transition-all" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{t('admin')}</h3>
              <p className="text-muted-foreground mb-6">{t('adminDesc')}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                  {lang === 'en' ? 'Manage Users' : 'उपयोगकर्ता प्रबंधित'}
                </span>
                <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                  {lang === 'en' ? 'Verify Credits' : 'क्रेडिट सत्यापित'}
                </span>
              </div>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              <span className="text-sm font-medium">
                {lang === 'en' ? 'Verified Credits' : 'सत्यापित क्रेडिट'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-accent" />
              <span className="text-sm font-medium">
                {lang === 'en' ? 'Instant Transfers' : 'तुरंत स्थानांतरण'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={20} className="text-secondary" />
              <span className="text-sm font-medium">
                {lang === 'en' ? 'India-wide Network' : 'भारत-व्यापी नेटवर्क'}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        © 2024 CarbonMax. {lang === 'en' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}
      </footer>
    </div>
  );
};

export default RoleSelection;
