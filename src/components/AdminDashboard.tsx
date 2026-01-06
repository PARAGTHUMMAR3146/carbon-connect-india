import React, { useState } from 'react';
import { 
  Users, ShieldCheck, Leaf, Clock, CheckCircle, XCircle,
  TrendingUp, IndianRupee, MapPin, Phone, Calendar, Filter,
  ChevronDown, ArrowUpRight, Search, Building, Sprout, FileCheck
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { CREDIT_TYPES, INDIAN_STATES } from '@/lib/mockData';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface AdminDashboardProps {
  lang: Language;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang, onLogout }) => {
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];
  const { 
    pendingListings, 
    allListings, 
    users, 
    stats, 
    isLoading,
    verifyListing,
    rejectListing,
  } = useAdmin();
  
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleVerify = async (listingId: string) => {
    const { error } = await verifyListing(listingId);
    if (error) {
      toast.error('Failed to verify: ' + error);
    } else {
      toast.success(lang === 'en' ? 'Listing verified successfully!' : 'लिस्टिंग सफलतापूर्वक सत्यापित!');
    }
  };

  const handleReject = async (listingId: string) => {
    const { error } = await rejectListing(listingId);
    if (error) {
      toast.error('Failed to reject: ' + error);
    } else {
      toast.success(lang === 'en' ? 'Listing rejected.' : 'लिस्टिंग अस्वीकृत।');
    }
  };

  const getCreditTypeLabel = (typeId: string) => {
    const type = CREDIT_TYPES.find(t => t.id === typeId);
    return type ? (lang === 'en' ? type.name : type.nameHi) : typeId;
  };

  const getStateLabel = (stateId: string) => {
    const state = INDIAN_STATES.find(s => s.id === stateId);
    return state ? (lang === 'en' ? state.name : state.nameHi) : stateId;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
          <CheckCircle size={12} className="mr-1" />
          {lang === 'en' ? 'Verified' : 'सत्यापित'}
        </Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">
          <Clock size={12} className="mr-1" />
          {lang === 'en' ? 'Pending' : 'लंबित'}
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200">
          <XCircle size={12} className="mr-1" />
          {lang === 'en' ? 'Rejected' : 'अस्वीकृत'}
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredListings = allListings.filter(listing => {
    const matchesSearch = 
      listing.seller_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {lang === 'en' ? 'Admin Dashboard' : 'एडमिन डैशबोर्ड'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {lang === 'en' ? 'Manage listings & users' : 'लिस्टिंग और उपयोगकर्ता प्रबंधित करें'}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium text-sm transition-colors"
          >
            {t('logout')}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-violet-100 text-violet-600">
                <Users size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
            <p className="text-xs text-muted-foreground">
              {lang === 'en' ? 'Total Users' : 'कुल उपयोगकर्ता'}
            </p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <Sprout size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalSellers}</p>
            <p className="text-xs text-muted-foreground">
              {lang === 'en' ? 'Farmers' : 'किसान'}
            </p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-navy-100 text-navy-600">
                <Building size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalBuyers}</p>
            <p className="text-xs text-muted-foreground">
              {lang === 'en' ? 'Industries' : 'उद्योग'}
            </p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                <Clock size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.pendingVerifications}</p>
            <p className="text-xs text-muted-foreground">
              {lang === 'en' ? 'Pending' : 'लंबित'}
            </p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <Leaf size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.verifiedCredits.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">
              {lang === 'en' ? 'Verified Credits' : 'सत्यापित क्रेडिट'}
            </p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gold-100 text-gold-600">
                <ArrowUpRight size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalTransactions}</p>
            <p className="text-xs text-muted-foreground">
              {lang === 'en' ? 'Transactions' : 'लेन-देन'}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="pending" className="gap-2">
                <Clock size={16} />
                {lang === 'en' ? 'Pending Verifications' : 'लंबित सत्यापन'}
                {pendingListings.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-amber-500 text-white rounded-full">
                    {pendingListings.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="all-listings" className="gap-2">
                <Leaf size={16} />
                {lang === 'en' ? 'All Listings' : 'सभी लिस्टिंग'}
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users size={16} />
                {lang === 'en' ? 'Users' : 'उपयोगकर्ता'}
              </TabsTrigger>
            </TabsList>

            {/* Search & Filters */}
            <div className="flex gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'Search...' : 'खोजें...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-modern pl-9 w-48"
                />
              </div>
              {activeTab === 'all-listings' && (
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="input-modern w-36"
                >
                  <option value="all">{lang === 'en' ? 'All Status' : 'सभी स्थिति'}</option>
                  <option value="pending">{lang === 'en' ? 'Pending' : 'लंबित'}</option>
                  <option value="verified">{lang === 'en' ? 'Verified' : 'सत्यापित'}</option>
                  <option value="rejected">{lang === 'en' ? 'Rejected' : 'अस्वीकृत'}</option>
                </select>
              )}
            </div>
          </div>

          {/* Pending Verifications Tab */}
          <TabsContent value="pending" className="space-y-4">
            {isLoading ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">{lang === 'en' ? 'Loading...' : 'लोड हो रहा है...'}</p>
              </div>
            ) : pendingListings.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-emerald-600" size={32} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {lang === 'en' ? 'All caught up!' : 'सब पूरा हो गया!'}
                </h3>
                <p className="text-muted-foreground">
                  {lang === 'en' ? 'No pending verifications at the moment.' : 'इस समय कोई लंबित सत्यापन नहीं है।'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingListings.map(listing => (
                  <div 
                    key={listing.id}
                    className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Seller Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                            {listing.seller_name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{listing.seller_name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin size={14} />
                              {listing.seller_state && getStateLabel(listing.seller_state)}
                              {listing.seller_district && `, ${listing.seller_district}`}
                            </div>
                            {listing.seller_phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Phone size={14} />
                                {listing.seller_phone}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {lang === 'en' ? 'Credit Type' : 'क्रेडिट प्रकार'}
                            </p>
                            <p className="font-semibold text-foreground">{getCreditTypeLabel(listing.credit_type)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {lang === 'en' ? 'Crop Type' : 'फसल प्रकार'}
                            </p>
                            <p className="font-semibold text-foreground capitalize">{listing.crop_type || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {lang === 'en' ? 'Amount' : 'मात्रा'}
                            </p>
                            <p className="font-semibold text-foreground">{listing.amount} {t('tonnes')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {lang === 'en' ? 'Price' : 'कीमत'}
                            </p>
                            <p className="font-semibold text-foreground flex items-center">
                              <IndianRupee size={14} />{listing.price_per_unit}/{t('tonnes').toLowerCase()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-3 lg:justify-center">
                        <button
                          onClick={() => handleVerify(listing.id)}
                          className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} />
                          {lang === 'en' ? 'Verify' : 'सत्यापित करें'}
                        </button>
                        <button
                          onClick={() => handleReject(listing.id)}
                          className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle size={18} />
                          {lang === 'en' ? 'Reject' : 'अस्वीकार करें'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {lang === 'en' ? 'Submitted on' : 'जमा किया गया'}: {new Date(listing.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* All Listings Tab */}
          <TabsContent value="all-listings">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{lang === 'en' ? 'Seller' : 'विक्रेता'}</TableHead>
                    <TableHead>{lang === 'en' ? 'Location' : 'स्थान'}</TableHead>
                    <TableHead>{lang === 'en' ? 'Credit Type' : 'क्रेडिट प्रकार'}</TableHead>
                    <TableHead>{lang === 'en' ? 'Amount' : 'मात्रा'}</TableHead>
                    <TableHead>{lang === 'en' ? 'Price' : 'कीमत'}</TableHead>
                    <TableHead>{lang === 'en' ? 'Status' : 'स्थिति'}</TableHead>
                    <TableHead>{lang === 'en' ? 'Date' : 'तारीख'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredListings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {lang === 'en' ? 'No listings found' : 'कोई लिस्टिंग नहीं मिली'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredListings.map(listing => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.seller_name}</TableCell>
                        <TableCell>{listing.location || '-'}</TableCell>
                        <TableCell>{getCreditTypeLabel(listing.credit_type)}</TableCell>
                        <TableCell>{listing.amount}</TableCell>
                        <TableCell>₹{listing.price_per_unit}</TableCell>
                        <TableCell>{getStatusBadge(listing.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(listing.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{lang === 'en' ? 'Name' : 'नाम'}</TableHead>
                    <TableHead>{lang === 'en' ? 'Role' : 'भूमिका'}</TableHead>
                    <TableHead>{lang === 'en' ? 'Phone' : 'फ़ोन'}</TableHead>
                    <TableHead>{lang === 'en' ? 'Location' : 'स्थान'}</TableHead>
                    <TableHead>{lang === 'en' ? 'Joined' : 'शामिल हुए'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {lang === 'en' ? 'No users found' : 'कोई उपयोगकर्ता नहीं मिला'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name || user.company_name || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            user.role === 'seller' 
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                              : user.role === 'admin'
                              ? 'bg-violet-100 text-violet-700 border-violet-200'
                              : 'bg-navy-100 text-navy-700 border-navy-200'
                          }>
                            {user.role === 'seller' 
                              ? (lang === 'en' ? 'Farmer' : 'किसान')
                              : user.role === 'admin'
                              ? (lang === 'en' ? 'Admin' : 'एडमिन')
                              : (lang === 'en' ? 'Industry' : 'उद्योग')
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>{user.phone || '-'}</TableCell>
                        <TableCell>
                          {user.state && getStateLabel(user.state)}
                          {user.district && `, ${user.district}`}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
