import React, { useState } from 'react';
import { X, ShoppingCart, IndianRupee, MapPin, Leaf, Shield } from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { FRACTION_UNITS, CREDIT_TYPES, CROPS } from '@/lib/mockData';

interface Listing {
  id: string;
  sellerName: string;
  location: { state: string; district: string };
  cropType: string;
  creditType: string;
  amount: number;
  pricePerTonne: number;
  verified: boolean;
}

interface BuyModalProps {
  lang: Language;
  listing: Listing;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

const BuyModal: React.FC<BuyModalProps> = ({ lang, listing, onClose, onSubmit }) => {
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];
  
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');

  const selectedAmount = amount === 'custom' ? parseFloat(customAmount) : parseFloat(amount);
  const totalCost = selectedAmount ? selectedAmount * listing.pricePerTonne : 0;
  const maxAmount = listing.amount;

  const creditType = CREDIT_TYPES.find(c => c.id === listing.creditType);
  const crop = CROPS.find(c => c.id === listing.cropType);

  const handleSubmit = () => {
    if (selectedAmount > 0 && selectedAmount <= maxAmount) {
      onSubmit(selectedAmount);
    }
  };

  const availableFractions = FRACTION_UNITS.filter(f => f.value <= maxAmount);

  return (
    <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl max-w-md w-full shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="hero-buyer p-6 text-secondary-foreground relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t('buyNow')}</h2>
              <p className="text-sm opacity-80">
                {lang === 'en' ? 'Purchase carbon credits' : 'कार्बन क्रेडिट खरीदें'}
              </p>
            </div>
          </div>
        </div>

        {/* Listing Info */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
                {listing.sellerName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{listing.sellerName}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin size={14} />
                  {listing.location.district}, {listing.location.state}
                </div>
              </div>
            </div>
            {listing.verified && (
              <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-primary rounded-full text-xs font-semibold">
                <Shield size={12} />
                Verified
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">{t('creditType')}</p>
              <p className="font-semibold text-foreground text-sm">
                {creditType ? (lang === 'en' ? creditType.name : creditType.nameHi) : listing.creditType}
              </p>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">{t('cropType')}</p>
              <p className="font-semibold text-foreground text-sm">
                {crop ? (lang === 'en' ? crop.name : crop.nameHi) : listing.cropType}
              </p>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">{t('price')}</p>
              <p className="font-semibold text-foreground text-sm flex items-center justify-center">
                <IndianRupee size={12} />
                {listing.pricePerTonne}
              </p>
            </div>
          </div>
        </div>

        {/* Amount Selection */}
        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">
                {t('selectFraction')}
              </label>
              <span className="text-sm text-muted-foreground">
                Max: {maxAmount} {t('tonnes')}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              {availableFractions.slice(0, 6).map(unit => (
                <button
                  key={unit.value}
                  onClick={() => {
                    setAmount(unit.value.toString());
                    setCustomAmount('');
                  }}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    amount === unit.value.toString()
                      ? 'border-secondary bg-navy-50'
                      : 'border-border hover:border-secondary/50'
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
                max={maxAmount}
              />
            </div>
          </div>

          {/* Total Cost */}
          {totalCost > 0 && (
            <div className="bg-navy-50 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground block">
                    {lang === 'en' ? 'Total Cost' : 'कुल लागत'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {selectedAmount} × ₹{listing.pricePerTonne}
                  </span>
                </div>
                <span className="text-2xl font-bold text-foreground flex items-center">
                  <IndianRupee size={20} />
                  {totalCost.toLocaleString('en-IN')}
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
            disabled={!selectedAmount || selectedAmount > maxAmount}
            className="flex-1 btn-buyer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
