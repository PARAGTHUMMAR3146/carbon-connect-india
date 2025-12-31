import React, { useState } from 'react';
import { X, Zap, IndianRupee } from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { CREDIT_TYPES, FRACTION_UNITS, BASE_CARBON_PRICE } from '@/lib/mockData';

interface QuickListModalProps {
  lang: Language;
  onClose: () => void;
  onSubmit: (amount: number, price: number, creditType: string) => void;
}

const QuickListModal: React.FC<QuickListModalProps> = ({ lang, onClose, onSubmit }) => {
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];
  
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [price, setPrice] = useState<string>(BASE_CARBON_PRICE.toString());
  const [creditType, setCreditType] = useState('verra');

  const selectedAmount = amount === 'custom' ? parseFloat(customAmount) : parseFloat(amount);
  const totalValue = selectedAmount && parseFloat(price) ? selectedAmount * parseFloat(price) : 0;

  const handleSubmit = () => {
    if (selectedAmount > 0 && parseFloat(price) > 0) {
      onSubmit(selectedAmount, parseFloat(price), creditType);
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl max-w-md w-full shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="hero-seller p-6 text-primary-foreground relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t('directList')}</h2>
              <p className="text-sm opacity-80">
                {lang === 'en' ? 'List your credits instantly' : 'अपने क्रेडिट तुरंत सूचीबद्ध करें'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Credit Type */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              {t('creditType')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CREDIT_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setCreditType(type.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    creditType === type.id
                      ? 'border-primary bg-emerald-50'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-medium text-sm text-foreground">
                    {lang === 'en' ? type.name : type.nameHi}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              {t('enterAmount')} ({t('selectFraction')})
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {FRACTION_UNITS.slice(0, 6).map(unit => (
                <button
                  key={unit.value}
                  onClick={() => {
                    setAmount(unit.value.toString());
                    setCustomAmount('');
                  }}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    amount === unit.value.toString()
                      ? 'border-primary bg-emerald-50'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-bold text-foreground">{unit.value}</span>
                  <span className="text-xs text-muted-foreground block">tonnes</span>
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder={lang === 'en' ? 'Or enter custom amount' : 'या कस्टम मात्रा दर्ज करें'}
                value={customAmount}
                onChange={e => {
                  setCustomAmount(e.target.value);
                  setAmount('custom');
                }}
                className="input-modern"
                step="0.01"
                min="0.01"
              />
            </div>
          </div>

          {/* Price per tonne */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              {t('enterPrice')}
            </label>
            <div className="relative">
              <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="input-modern pl-12"
                min="100"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {lang === 'en' ? 'Market rate: ' : 'बाजार दर: '}₹{BASE_CARBON_PRICE}/tonne
            </p>
          </div>

          {/* Total Value */}
          {totalValue > 0 && (
            <div className="bg-muted rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {lang === 'en' ? 'Total Value' : 'कुल मूल्य'}
                </span>
                <span className="text-2xl font-bold text-foreground flex items-center">
                  <IndianRupee size={20} />
                  {totalValue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedAmount || !parseFloat(price)}
            className="flex-1 btn-seller disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickListModal;
