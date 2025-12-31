import React from 'react';
import { MapPin, Shield, Leaf, IndianRupee } from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { CREDIT_TYPES, CROPS } from '@/lib/mockData';

interface Listing {
  id: string;
  sellerName: string;
  location: { state: string; district: string };
  cropType: string;
  creditType: string;
  amount: number;
  pricePerTonne: number;
  verified: boolean;
  farmSize?: number;
  practices?: string[];
}

interface ListingCardProps {
  lang: Language;
  listing: Listing;
  isBuyer: boolean;
  distance?: number;
  onBuy?: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ lang, listing, isBuyer, distance, onBuy }) => {
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];
  
  const creditType = CREDIT_TYPES.find(c => c.id === listing.creditType);
  const crop = CROPS.find(c => c.id === listing.cropType);

  const getBadgeClass = () => {
    switch (creditType?.color) {
      case 'gold': return 'bg-gold-100 text-gold-600';
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      default: return 'bg-emerald-100 text-primary';
    }
  };

  return (
    <div className="listing-card group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {listing.sellerName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{listing.sellerName}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin size={14} />
              <span>{listing.location.district}, {listing.location.state}</span>
            </div>
          </div>
        </div>
        
        {listing.verified && (
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-primary rounded-full text-xs font-semibold">
            <Shield size={12} />
            {lang === 'en' ? 'Verified' : 'सत्यापित'}
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`credit-badge ${getBadgeClass()}`}>
          {creditType ? (lang === 'en' ? creditType.name : creditType.nameHi) : listing.creditType}
        </span>
        <span className="credit-badge bg-muted text-muted-foreground">
          <Leaf size={12} className="mr-1" />
          {crop ? (lang === 'en' ? crop.name : crop.nameHi) : listing.cropType}
        </span>
        {distance !== undefined && distance <= 50 && (
          <span className="credit-badge bg-blue-100 text-blue-600">
            {Math.round(distance)} km {lang === 'en' ? 'away' : 'दूर'}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-muted rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">{t('credits')}</p>
          <p className="text-lg font-bold text-foreground">{listing.amount} <span className="text-sm font-normal">{t('tonnes')}</span></p>
        </div>
        <div className="bg-muted rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">{t('price')}</p>
          <p className="text-lg font-bold text-foreground flex items-center">
            <IndianRupee size={16} />
            {listing.pricePerTonne}
            <span className="text-sm font-normal text-muted-foreground">/{t('tonne')}</span>
          </p>
        </div>
      </div>

      {/* Total & Action */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            {lang === 'en' ? 'Total Value' : 'कुल मूल्य'}
          </p>
          <p className="text-xl font-bold text-foreground flex items-center">
            <IndianRupee size={18} />
            {(listing.amount * listing.pricePerTonne).toLocaleString('en-IN')}
          </p>
        </div>
        {isBuyer && onBuy && (
          <button
            onClick={onBuy}
            className="btn-buyer py-2 px-6 text-sm"
          >
            {t('buyNow')}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
