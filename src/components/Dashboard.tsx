import React, { useState, useMemo } from 'react';
import { 
  Menu, Search, Wallet, TrendingUp, Leaf, IndianRupee, ArrowUpRight, 
  ArrowDownLeft, ShoppingCart, MapPin, Filter, CheckCircle, Clock, 
  Zap, FileBarChart
} from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { UserData } from './RegistrationForm';
import { 
  MOCK_LISTINGS, MOCK_TRANSACTIONS, CREDIT_TYPES, 
  calculateDistance, INDIAN_STATES, BASE_CARBON_PRICE 
} from '@/lib/mockData';
import Sidebar from './Sidebar';
import PriceTicker from './PriceTicker';
import PriceChart from './PriceChart';
import ListingCard from './ListingCard';
import CarbonEstimator from './CarbonEstimator';
import QuickListModal from './QuickListModal';
import BuyModal from './BuyModal';
import ReportsModal from './ReportsModal';

interface DashboardProps {
  lang: Language;
  role: 'seller' | 'buyer';
  userData: UserData;
  onToggleLang: () => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ lang, role, userData, onToggleLang, onLogout }) => {
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];
  
  // UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  
  // Modal State
  const [showEstimator, setShowEstimator] = useState(false);
  const [showQuickList, setShowQuickList] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [selectedListing, setSelectedListing] = useState<typeof MOCK_LISTINGS[0] | null>(null);
  
  // Filter State
  const [filterNearby, setFilterNearby] = useState(false);
  const [filterCreditType, setFilterCreditType] = useState('all');
  
  // Wallet State
  const [sellerWallet, setSellerWallet] = useState({ credits: 0, cash: 0, projected: 0 });
  const [buyerWallet, setBuyerWallet] = useState({ credits: 120, cash: 500000 });
  
  // Data State
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);

  const isSeller = role === 'seller';
  const displayName = isSeller ? userData.name : userData.companyName;
  const userState = INDIAN_STATES.find(s => s.id === userData.state);

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    let filtered = [...listings];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l => 
        l.sellerName.toLowerCase().includes(query) ||
        l.location.state.toLowerCase().includes(query) ||
        l.location.district.toLowerCase().includes(query)
      );
    }
    
    // Credit type filter
    if (filterCreditType !== 'all') {
      filtered = filtered.filter(l => l.creditType === filterCreditType);
    }
    
    // Distance filter (for buyers)
    if (filterNearby && userState) {
      filtered = filtered.filter(l => {
        const state = INDIAN_STATES.find(s => s.name === l.location.state);
        if (!state) return false;
        const distance = calculateDistance(
          userState.lat, userState.lng,
          state.lat, state.lng
        );
        return distance <= 50;
      });
    }
    
    return filtered.map(l => {
      if (userState) {
        const state = INDIAN_STATES.find(s => s.name === l.location.state);
        const distance = state 
          ? calculateDistance(userState.lat, userState.lng, state.lat, state.lng)
          : undefined;
        return { ...l, distance };
      }
      return l;
    });
  }, [listings, searchQuery, filterCreditType, filterNearby, userState]);

  // Handlers
  const showNotificationMessage = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEstimatorComplete = (credits: number, earnings: number) => {
    setSellerWallet(prev => ({
      ...prev,
      credits: prev.credits + credits,
      projected: prev.projected + earnings,
    }));
    
    const newListing = {
      id: `LST${Date.now()}`,
      sellerId: 'SELF',
      sellerName: userData.name || 'You',
      location: { 
        state: userState?.name || 'Punjab', 
        district: userData.district,
        lat: userData.coordinates.lat,
        lng: userData.coordinates.lng,
      },
      cropType: 'rice',
      creditType: 'verra',
      amount: credits,
      pricePerTonne: BASE_CARBON_PRICE,
      verified: true,
      createdAt: new Date().toISOString().split('T')[0],
      farmSize: 10,
      practices: ['organic'],
    };
    
    setListings(prev => [newListing, ...prev]);
    setShowEstimator(false);
    showNotificationMessage(t('listingSuccess'));
  };

  const handleQuickList = (amount: number, price: number, creditType: string) => {
    setSellerWallet(prev => ({
      ...prev,
      credits: prev.credits + amount,
      projected: prev.projected + (amount * price),
    }));
    
    const newListing = {
      id: `LST${Date.now()}`,
      sellerId: 'SELF',
      sellerName: userData.name || 'You',
      location: { 
        state: userState?.name || 'Punjab', 
        district: userData.district,
        lat: userData.coordinates.lat,
        lng: userData.coordinates.lng,
      },
      cropType: 'mixed',
      creditType,
      amount,
      pricePerTonne: price,
      verified: true,
      createdAt: new Date().toISOString().split('T')[0],
      farmSize: 0,
      practices: [],
    };
    
    setListings(prev => [newListing, ...prev]);
    setShowQuickList(false);
    showNotificationMessage(t('listingSuccess'));
  };

  const handleBuy = (amount: number) => {
    if (!selectedListing) return;
    
    const totalCost = amount * selectedListing.pricePerTonne;
    
    if (buyerWallet.cash < totalCost) {
      showNotificationMessage(t('insufficientFunds'));
      return;
    }
    
    setBuyerWallet(prev => ({
      credits: prev.credits + amount,
      cash: prev.cash - totalCost,
    }));
    
    // Update or remove listing
    if (amount >= selectedListing.amount) {
      setListings(prev => prev.filter(l => l.id !== selectedListing.id));
    } else {
      setListings(prev => prev.map(l => 
        l.id === selectedListing.id 
          ? { ...l, amount: l.amount - amount }
          : l
      ));
    }
    
    // Add transaction
    const newTransaction = {
      id: `TXN${Date.now()}`,
      type: 'BUY',
      creditType: selectedListing.creditType,
      amount,
      pricePerTonne: selectedListing.pricePerTonne,
      totalValue: totalCost,
      buyerName: userData.companyName,
      sellerName: selectedListing.sellerName,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setShowBuyModal(false);
    setSelectedListing(null);
    showNotificationMessage(t('purchaseSuccess'));
  };

  const openBuyModal = (listing: typeof MOCK_LISTINGS[0]) => {
    setSelectedListing(listing);
    setShowBuyModal(true);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar
        lang={lang}
        role={role}
        activeTab={activeTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onTabChange={setActiveTab}
        onToggleLang={onToggleLang}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Price Ticker */}
        <PriceTicker lang={lang} />

        {/* Header */}
        <header className="bg-card border-b border-border px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
            >
              <Menu size={24} />
            </button>
            
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-modern pl-10 w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-foreground">{displayName}</p>
              <p className="text-sm text-muted-foreground">
                {userState ? (lang === 'en' ? userState.name : userState.nameHi) : ''}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              isSeller ? 'bg-emerald-100 text-primary' : 'bg-navy-100 text-secondary'
            }`}>
              {displayName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto page-enter">
            
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Hero Card */}
                <div className={`${isSeller ? 'hero-seller' : 'hero-buyer'} rounded-3xl p-6 lg:p-8 text-primary-foreground relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 opacity-10 -mt-10 -mr-10">
                    <Leaf size={300} />
                  </div>
                  
                  <div className="relative z-10">
                    <h1 className="text-2xl lg:text-3xl font-bold mb-6">
                      {t('welcome')}, {displayName}!
                    </h1>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div>
                        <p className="text-sm opacity-80 mb-1">{t('totalCredits')}</p>
                        <p className="text-3xl lg:text-4xl font-extrabold">
                          {isSeller ? sellerWallet.credits.toFixed(2) : buyerWallet.credits.toFixed(2)}
                          <span className="text-lg font-normal opacity-70 ml-2">{t('tonnes')}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-80 mb-1">
                          {isSeller ? t('projectedIncome') : t('availableFunds')}
                        </p>
                        <p className="text-3xl lg:text-4xl font-extrabold flex items-center">
                          <IndianRupee size={28} />
                          {isSeller 
                            ? sellerWallet.projected.toLocaleString('en-IN')
                            : buyerWallet.cash.toLocaleString('en-IN')
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {isSeller ? (
                        <>
                          <button 
                            onClick={() => setShowEstimator(true)}
                            className="bg-primary-foreground text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
                          >
                            <Leaf size={20} />
                            {t('getEstimate')}
                          </button>
                          <button 
                            onClick={() => setShowQuickList(true)}
                            className="bg-white/20 border border-white/30 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/30 transition-colors"
                          >
                            <Zap size={20} />
                            {t('directList')}
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => setActiveTab('marketplace')}
                          className="bg-primary-foreground text-secondary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
                        >
                          <ShoppingCart size={20} />
                          {t('buyNow')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="stat-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-muted-foreground text-sm">{t('activeListings')}</span>
                      <div className={`p-2 rounded-lg ${isSeller ? 'bg-emerald-100 text-primary' : 'bg-navy-100 text-secondary'}`}>
                        <TrendingUp size={18} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{listings.length}</p>
                  </div>
                  
                  <div className="stat-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-muted-foreground text-sm">{t('transactions')}</span>
                      <div className="p-2 rounded-lg bg-gold-100 text-gold-600">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
                  </div>
                  
                  <div className="stat-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-muted-foreground text-sm">{lang === 'en' ? 'Completed' : 'पूर्ण'}</span>
                      <div className="p-2 rounded-lg bg-emerald-100 text-primary">
                        <CheckCircle size={18} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {transactions.filter(t => t.status === 'completed').length}
                    </p>
                  </div>
                  
                  <div className="stat-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-muted-foreground text-sm">{lang === 'en' ? 'Pending' : 'लंबित'}</span>
                      <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                        <Clock size={18} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {transactions.filter(t => t.status !== 'completed').length}
                    </p>
                  </div>
                </div>

                {/* Price Chart */}
                <PriceChart lang={lang} />

                {/* Recent Activity */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground">{t('recentActivity')}</h3>
                    <button 
                      onClick={() => setActiveTab('transactions')}
                      className="text-sm text-primary font-medium hover:underline"
                    >
                      {t('viewAll')}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {transactions.slice(0, 4).map(txn => (
                      <div key={txn.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            txn.type === 'BUY' 
                              ? 'bg-navy-100 text-secondary' 
                              : 'bg-emerald-100 text-primary'
                          }`}>
                            {txn.type === 'BUY' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{txn.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {txn.amount} {t('tonnes')} • {CREDIT_TYPES.find(c => c.id === txn.creditType)?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground flex items-center justify-end">
                            <IndianRupee size={14} />
                            {txn.totalValue.toLocaleString('en-IN')}
                          </p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            txn.status === 'completed' 
                              ? 'bg-emerald-100 text-primary' 
                              : 'bg-orange-100 text-orange-600'
                          }`}>
                            {txn.status === 'completed' ? t('completed') : t('processing')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Marketplace / My Listings Tab */}
            {(activeTab === 'marketplace' || activeTab === 'my-listings') && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    {isSeller ? t('myListings') : t('marketplace')}
                  </h2>
                  
                  <div className="flex flex-wrap gap-2">
                    {!isSeller && (
                      <button
                        onClick={() => setFilterNearby(!filterNearby)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                          filterNearby 
                            ? 'border-secondary bg-navy-50 text-secondary' 
                            : 'border-border text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        <MapPin size={16} />
                        {t('filterByDistance')}
                      </button>
                    )}
                    
                    <select
                      value={filterCreditType}
                      onChange={e => setFilterCreditType(e.target.value)}
                      className="input-modern py-2 px-4"
                    >
                      <option value="all">{t('filterByType')}</option>
                      {CREDIT_TYPES.map(type => (
                        <option key={type.id} value={type.id}>
                          {lang === 'en' ? type.name : type.nameHi}
                        </option>
                      ))}
                    </select>
                    
                    {isSeller && (
                      <button
                        onClick={() => setShowQuickList(true)}
                        className="btn-seller py-2 flex items-center gap-2"
                      >
                        <Zap size={16} />
                        {t('directList')}
                      </button>
                    )}
                  </div>
                </div>

                {/* Listings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map(listing => (
                    <ListingCard
                      key={listing.id}
                      lang={lang}
                      listing={listing}
                      isBuyer={!isSeller}
                      distance={(listing as any).distance}
                      onBuy={!isSeller ? () => openBuyModal(listing) : undefined}
                    />
                  ))}
                </div>
                
                {filteredListings.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Filter size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {lang === 'en' ? 'No listings found' : 'कोई लिस्टिंग नहीं मिली'}
                    </h3>
                    <p className="text-muted-foreground">
                      {lang === 'en' ? 'Try adjusting your filters' : 'अपने फ़िल्टर समायोजित करने का प्रयास करें'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Wallet Tab */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">{t('wallet')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`${isSeller ? 'hero-seller' : 'hero-buyer'} rounded-2xl p-6 text-primary-foreground`}>
                    <div className="flex items-center gap-3 mb-4">
                      <Wallet size={24} />
                      <span className="font-semibold">{t('creditBalance')}</span>
                    </div>
                    <p className="text-4xl font-extrabold">
                      {isSeller ? sellerWallet.credits.toFixed(2) : buyerWallet.credits.toFixed(2)}
                      <span className="text-lg font-normal opacity-70 ml-2">{t('tonnes')}</span>
                    </p>
                  </div>
                  
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <IndianRupee size={24} className="text-foreground" />
                      <span className="font-semibold text-foreground">{t('walletBalance')}</span>
                    </div>
                    <p className="text-4xl font-extrabold text-foreground flex items-center">
                      <IndianRupee size={32} />
                      {isSeller 
                        ? sellerWallet.cash.toLocaleString('en-IN')
                        : buyerWallet.cash.toLocaleString('en-IN')
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">{t('transactions')}</h2>
                  <button
                    onClick={() => setShowReports(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors"
                  >
                    <FileBarChart size={18} />
                    {t('downloadReport')}
                  </button>
                </div>
                
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-4 font-semibold text-muted-foreground">{t('transactionId')}</th>
                          <th className="text-left p-4 font-semibold text-muted-foreground">{t('date')}</th>
                          <th className="text-left p-4 font-semibold text-muted-foreground">{t('type')}</th>
                          <th className="text-left p-4 font-semibold text-muted-foreground">{t('creditType')}</th>
                          <th className="text-right p-4 font-semibold text-muted-foreground">{t('amount')}</th>
                          <th className="text-right p-4 font-semibold text-muted-foreground">{lang === 'en' ? 'Value' : 'मूल्य'}</th>
                          <th className="text-center p-4 font-semibold text-muted-foreground">{t('status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(txn => (
                          <tr key={txn.id} className="border-t border-border hover:bg-muted/50">
                            <td className="p-4 font-medium text-foreground">{txn.id}</td>
                            <td className="p-4 text-muted-foreground">
                              {new Date(txn.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                txn.type === 'BUY' 
                                  ? 'bg-navy-100 text-secondary' 
                                  : 'bg-emerald-100 text-primary'
                              }`}>
                                {txn.type === 'BUY' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                                {txn.type}
                              </span>
                            </td>
                            <td className="p-4 text-muted-foreground">
                              {CREDIT_TYPES.find(c => c.id === txn.creditType)?.name}
                            </td>
                            <td className="p-4 text-right font-medium text-foreground">
                              {txn.amount} {t('tonnes')}
                            </td>
                            <td className="p-4 text-right font-bold text-foreground">
                              ₹{txn.totalValue.toLocaleString('en-IN')}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                txn.status === 'completed' 
                                  ? 'bg-emerald-100 text-primary' 
                                  : txn.status === 'processing'
                                  ? 'bg-blue-100 text-blue-600'
                                  : 'bg-orange-100 text-orange-600'
                              }`}>
                                {txn.status === 'completed' ? t('completed') : 
                                 txn.status === 'processing' ? t('processing') : t('pending')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">{t('reports')}</h2>
                <div className="bg-card rounded-2xl border border-border p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <FileBarChart size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{t('generateReport')}</h3>
                  <p className="text-muted-foreground mb-6">
                    {lang === 'en' 
                      ? 'Generate and download detailed transaction reports'
                      : 'विस्तृत लेन-देन रिपोर्ट बनाएं और डाउनलोड करें'}
                  </p>
                  <button
                    onClick={() => setShowReports(true)}
                    className={isSeller ? 'btn-seller' : 'btn-buyer'}
                  >
                    {t('generateReport')}
                  </button>
                </div>
              </div>
            )}

            {/* Support Tab */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">{t('support')}</h2>
                <div className="bg-card rounded-2xl border border-border p-8 text-center">
                  <p className="text-muted-foreground">
                    {lang === 'en' 
                      ? 'Contact our support team for assistance'
                      : 'सहायता के लिए हमारी सहायता टीम से संपर्क करें'}
                  </p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">{t('settings')}</h2>
                <div className="bg-card rounded-2xl border border-border p-8 text-center">
                  <p className="text-muted-foreground">
                    {lang === 'en' 
                      ? 'Manage your account settings'
                      : 'अपनी खाता सेटिंग प्रबंधित करें'}
                  </p>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-foreground text-background px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 notification-enter">
          <CheckCircle size={20} className="text-emerald-400" />
          {notification}
        </div>
      )}

      {/* Modals */}
      {showEstimator && (
        <CarbonEstimator
          lang={lang}
          onClose={() => setShowEstimator(false)}
          onComplete={handleEstimatorComplete}
        />
      )}

      {showQuickList && (
        <QuickListModal
          lang={lang}
          onClose={() => setShowQuickList(false)}
          onSubmit={handleQuickList}
        />
      )}

      {showBuyModal && selectedListing && (
        <BuyModal
          lang={lang}
          listing={selectedListing}
          onClose={() => { setShowBuyModal(false); setSelectedListing(null); }}
          onSubmit={handleBuy}
        />
      )}

      {showReports && (
        <ReportsModal
          lang={lang}
          transactions={transactions}
          onClose={() => setShowReports(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
