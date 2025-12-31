import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { BASE_CARBON_PRICE } from '@/lib/mockData';

interface PriceTickerProps {
  lang: 'en' | 'hi';
}

const PriceTicker: React.FC<PriceTickerProps> = ({ lang }) => {
  const [currentPrice, setCurrentPrice] = useState(BASE_CARBON_PRICE);
  const [previousPrice, setPreviousPrice] = useState(BASE_CARBON_PRICE);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousPrice(currentPrice);
      const variation = (Math.random() - 0.5) * 20;
      const newPrice = Math.max(700, Math.min(900, currentPrice + variation));
      setCurrentPrice(Math.round(newPrice));
      setPriceChange(Math.round(newPrice - currentPrice));
    }, 5000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  const isUp = priceChange >= 0;

  return (
    <div className="price-ticker text-primary-foreground py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 price-ticker-content">
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs font-medium opacity-80">LIVE</span>
          </div>

          {/* Price display */}
          <div className="flex items-center gap-3">
            <Activity size={16} className="opacity-70" />
            <span className="text-xs font-medium opacity-70">
              {lang === 'en' ? 'Carbon Price' : 'कार्बन मूल्य'}
            </span>
            <span className="text-lg font-bold">₹{currentPrice}</span>
            <span className="text-xs opacity-70">/tonne</span>
            
            {/* Change indicator */}
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              isUp ? 'bg-emerald-500/30' : 'bg-red-500/30'
            }`}>
              {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isUp ? '+' : ''}{priceChange}
            </div>
          </div>

          {/* Separator */}
          <div className="h-4 w-px bg-white/20" />

          {/* Market info */}
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="opacity-70">24h High: </span>
              <span className="font-semibold">₹892</span>
            </div>
            <div>
              <span className="opacity-70">24h Low: </span>
              <span className="font-semibold">₹756</span>
            </div>
            <div>
              <span className="opacity-70">Volume: </span>
              <span className="font-semibold">12,450 tonnes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;
