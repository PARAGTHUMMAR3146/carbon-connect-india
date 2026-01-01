import React, { useState, useMemo } from 'react';
import { 
  Users, TrendingUp, Shield, FileCheck, Settings, Search, 
  IndianRupee, ArrowUpRight, ArrowDownLeft, CheckCircle, 
  XCircle, Clock, Eye, Download, Filter, RefreshCw,
  UserCheck, UserX, FileBarChart, AlertTriangle, Leaf,
  Menu, Languages, LogOut, BarChart3, Activity
} from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { 
  MOCK_USERS, MOCK_TRANSACTIONS, MOCK_PENDING_VERIFICATIONS,
  PLATFORM_STATS, CREDIT_TYPES, CROPS, FARMING_PRACTICES
} from '@/lib/mockData';
import PriceTicker from './PriceTicker';
import PriceChart from './PriceChart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminDashboardProps {
  lang: Language;
  onToggleLang: () => void;
  onLogout: () => void;
}

type AdminTab = 'overview' | 'users' | 'verification' | 'transactions' | 'compliance';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang, onToggleLang, onLogout }) => {
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];
  
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'seller' | 'buyer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'completed' | 'pending' | 'processing'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  // State for data management
  const [users, setUsers] = useState(MOCK_USERS);
  const [verifications, setVerifications] = useState(MOCK_PENDING_VERIFICATIONS);
  const [transactions] = useState(MOCK_TRANSACTIONS);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter users
  const filteredUsers = useMemo(() => {
    let filtered = [...users];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      );
    }
    if (userFilter !== 'all') {
      filtered = filtered.filter(u => u.role === userFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => u.status === statusFilter);
    }
    return filtered;
  }, [users, searchQuery, userFilter, statusFilter]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (transactionFilter === 'all') return transactions;
    return transactions.filter(t => t.status === transactionFilter);
  }, [transactions, transactionFilter]);

  // Handlers
  const handleUserStatusToggle = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        showNotification(`User ${u.name} ${newStatus === 'active' ? 'activated' : 'suspended'}`);
        return { ...u, status: newStatus } as typeof u;
      }
      return u;
    }));
  };

  const handleVerificationAction = (verificationId: string, action: 'approve' | 'reject') => {
    setVerifications(prev => prev.filter(v => v.id !== verificationId));
    showNotification(`Verification ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
  };

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    showNotification('Report exported successfully');
  };

  const navItems = [
    { id: 'overview' as AdminTab, label: t('overview'), icon: BarChart3 },
    { id: 'users' as AdminTab, label: t('userManagement'), icon: Users },
    { id: 'verification' as AdminTab, label: t('creditVerification'), icon: Shield },
    { id: 'transactions' as AdminTab, label: t('transactions'), icon: Activity },
    { id: 'compliance' as AdminTab, label: t('complianceReports'), icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-foreground text-background px-6 py-4 rounded-xl shadow-xl notification-enter flex items-center gap-3">
          <CheckCircle size={20} className="text-primary" />
          {notification}
        </div>
      )}

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative z-50 w-72 h-screen bg-card border-r border-border flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive flex items-center justify-center">
            <Shield className="text-destructive-foreground" size={22} />
          </div>
          <div>
            <span className="text-xl font-bold text-foreground">{t('appTitle')}</span>
            <p className="text-xs text-muted-foreground">{t('admin')}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`nav-item w-full ${
                activeTab === item.id 
                  ? 'bg-destructive text-destructive-foreground shadow-lg' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <button 
            onClick={onToggleLang}
            className="nav-item w-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Languages size={20} />
            <span>{t('switchLang')}</span>
          </button>
          <button 
            onClick={onLogout}
            className="nav-item w-full text-destructive hover:bg-destructive/10"
          >
            <LogOut size={20} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
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
            <h1 className="text-xl font-bold text-foreground">{navItems.find(n => n.id === activeTab)?.label}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
              <RefreshCw size={20} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto page-enter">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="stat-card bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-muted-foreground text-sm">{t('totalUsers')}</span>
                      <div className="p-2 rounded-lg bg-primary/20 text-primary">
                        <Users size={18} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{PLATFORM_STATS.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-primary mt-1">+{PLATFORM_STATS.monthlyGrowth}% this month</p>
                  </div>

                  <div className="stat-card bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-muted-foreground text-sm">{t('totalSellers')}</span>
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-primary">
                        <Leaf size={18} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{PLATFORM_STATS.totalSellers.toLocaleString()}</p>
                  </div>

                  <div className="stat-card bg-gradient-to-br from-secondary/10 to-secondary/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-muted-foreground text-sm">{t('totalBuyers')}</span>
                      <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
                        <TrendingUp size={18} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{PLATFORM_STATS.totalBuyers.toLocaleString()}</p>
                  </div>

                  <div className="stat-card bg-gradient-to-br from-accent/10 to-accent/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-muted-foreground text-sm">{t('pendingVerifications')}</span>
                      <div className="p-2 rounded-lg bg-accent/20 text-accent">
                        <AlertTriangle size={18} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{verifications.length}</p>
                  </div>
                </div>

                {/* Volume Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
                    <p className="text-sm opacity-80 mb-1">{t('totalVolume')}</p>
                    <p className="text-3xl font-bold flex items-center">
                      <IndianRupee size={24} />
                      {(PLATFORM_STATS.totalVolume / 10000000).toFixed(2)} Cr
                    </p>
                    <p className="text-xs opacity-70 mt-2">{PLATFORM_STATS.totalCreditsTraded.toLocaleString()} {t('tonnes')} traded</p>
                  </div>

                  <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-6 text-secondary-foreground">
                    <p className="text-sm opacity-80 mb-1">{t('platformRevenue')}</p>
                    <p className="text-3xl font-bold flex items-center">
                      <IndianRupee size={24} />
                      {(PLATFORM_STATS.platformRevenue / 100000).toFixed(2)} L
                    </p>
                    <p className="text-xs opacity-70 mt-2">2.5% platform fee</p>
                  </div>

                  <div className="bg-gradient-to-br from-accent to-accent/80 rounded-2xl p-6 text-accent-foreground">
                    <p className="text-sm opacity-80 mb-1">{t('activeListings')}</p>
                    <p className="text-3xl font-bold">{PLATFORM_STATS.activeListings}</p>
                    <p className="text-xs opacity-70 mt-2">Across all credit types</p>
                  </div>
                </div>

                {/* Price Chart */}
                <PriceChart lang={lang} />

                {/* Recent Transactions */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground">{t('recentTransactions')}</h3>
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
                              ? 'bg-secondary/20 text-secondary' 
                              : 'bg-primary/20 text-primary'
                          }`}>
                            {txn.type === 'BUY' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{txn.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {txn.buyerName} ← {txn.sellerName}
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
                              ? 'bg-primary/20 text-primary' 
                              : txn.status === 'pending'
                              ? 'bg-accent/20 text-accent'
                              : 'bg-secondary/20 text-secondary'
                          }`}>
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t('searchUsers')}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="input-modern pl-10 w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={userFilter}
                      onChange={e => setUserFilter(e.target.value as any)}
                      className="input-modern"
                    >
                      <option value="all">All Roles</option>
                      <option value="seller">Sellers</option>
                      <option value="buyer">Buyers</option>
                    </select>
                    <select 
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value as any)}
                      className="input-modern"
                    >
                      <option value="all">All Status</option>
                      <option value="active">{t('active')}</option>
                      <option value="suspended">{t('suspended')}</option>
                    </select>
                    <button 
                      onClick={() => exportToCSV(filteredUsers, 'users_report')}
                      className="btn-gold flex items-center gap-2"
                    >
                      <Download size={18} />
                      {t('exportToCSV')}
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-bold">{t('fullName')}</TableHead>
                        <TableHead className="font-bold">{t('type')}</TableHead>
                        <TableHead className="font-bold">{t('state')}</TableHead>
                        <TableHead className="font-bold">{t('creditsTraded')}</TableHead>
                        <TableHead className="font-bold">{t('totalVolume')}</TableHead>
                        <TableHead className="font-bold">{t('userStatus')}</TableHead>
                        <TableHead className="font-bold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map(user => (
                        <TableRow key={user.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                                user.role === 'seller' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                              }`}>
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.role === 'seller' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                            }`}>
                              {user.role === 'seller' ? t('farmer') : t('buyer')}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.state}</TableCell>
                          <TableCell className="font-semibold">{user.creditsTraded.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold flex items-center">
                            <IndianRupee size={14} />{user.totalVolume.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.status === 'active' 
                                ? 'bg-primary/20 text-primary' 
                                : 'bg-destructive/20 text-destructive'
                            }`}>
                              {user.status === 'active' ? t('active') : t('suspended')}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                                <Eye size={18} />
                              </button>
                              <button 
                                onClick={() => handleUserStatusToggle(user.id)}
                                className={`p-2 rounded-lg ${
                                  user.status === 'active' 
                                    ? 'hover:bg-destructive/10 text-destructive' 
                                    : 'hover:bg-primary/10 text-primary'
                                }`}
                              >
                                {user.status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      {t('noDataFound')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Credit Verification Tab */}
            {activeTab === 'verification' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    {verifications.length} {t('pendingVerifications')}
                  </p>
                </div>

                {verifications.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-12 text-center">
                    <CheckCircle size={48} className="mx-auto text-primary mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">All Caught Up!</h3>
                    <p className="text-muted-foreground">No pending verifications at this time.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {verifications.map(verification => (
                      <div key={verification.id} className="bg-card rounded-2xl border border-border p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center font-bold">
                              {verification.sellerName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground">{verification.sellerName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {verification.location.district}, {verification.location.state}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center gap-1">
                              <Clock size={14} />
                              {t('pending')}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="bg-muted rounded-xl p-4">
                            <p className="text-xs text-muted-foreground mb-1">{t('landSize')}</p>
                            <p className="font-bold text-foreground">{verification.farmSize} ha</p>
                          </div>
                          <div className="bg-muted rounded-xl p-4">
                            <p className="text-xs text-muted-foreground mb-1">{t('cropType')}</p>
                            <p className="font-bold text-foreground">
                              {CROPS.find(c => c.id === verification.cropType)?.name || verification.cropType}
                            </p>
                          </div>
                          <div className="bg-muted rounded-xl p-4">
                            <p className="text-xs text-muted-foreground mb-1">{t('estimatedCredits')}</p>
                            <p className="font-bold text-primary">{verification.estimatedCredits} {t('tonnes')}</p>
                          </div>
                          <div className="bg-muted rounded-xl p-4">
                            <p className="text-xs text-muted-foreground mb-1">{t('farmingPractices')}</p>
                            <p className="font-bold text-foreground">
                              {verification.practices.map(p => 
                                FARMING_PRACTICES.find(fp => fp.id === p)?.name || p
                              ).join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <p className="text-sm font-semibold text-muted-foreground mb-2">{t('documentVerification')}</p>
                          <div className="flex flex-wrap gap-2">
                            {verification.documents.map((doc, i) => (
                              <span key={i} className="px-3 py-1 bg-muted rounded-lg text-sm flex items-center gap-2">
                                <FileCheck size={14} className="text-primary" />
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-border">
                          <button 
                            onClick={() => handleVerificationAction(verification.id, 'approve')}
                            className="btn-seller flex items-center gap-2"
                          >
                            <CheckCircle size={18} />
                            {t('approveCredits')}
                          </button>
                          <button 
                            onClick={() => handleVerificationAction(verification.id, 'reject')}
                            className="px-6 py-3 rounded-xl font-semibold border border-destructive text-destructive hover:bg-destructive/10 flex items-center gap-2"
                          >
                            <XCircle size={18} />
                            {t('rejectCredits')}
                          </button>
                          <button className="px-6 py-3 rounded-xl font-semibold border border-border text-muted-foreground hover:bg-muted flex items-center gap-2 ml-auto">
                            <Eye size={18} />
                            {t('viewDetails')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex gap-2">
                    {(['all', 'completed', 'pending', 'processing'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => setTransactionFilter(status)}
                        className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                          transactionFilter === status
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => exportToCSV(filteredTransactions, 'transactions_report')}
                    className="btn-gold flex items-center gap-2"
                  >
                    <Download size={18} />
                    {t('exportToCSV')}
                  </button>
                </div>

                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-bold">{t('transactionId')}</TableHead>
                        <TableHead className="font-bold">{t('type')}</TableHead>
                        <TableHead className="font-bold">{t('creditType')}</TableHead>
                        <TableHead className="font-bold">{t('amount')}</TableHead>
                        <TableHead className="font-bold">{t('price')}</TableHead>
                        <TableHead className="font-bold">{t('buyer')} / {t('farmer')}</TableHead>
                        <TableHead className="font-bold">{t('status')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map(txn => (
                        <TableRow key={txn.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono font-semibold">{txn.id}</TableCell>
                          <TableCell>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              txn.type === 'BUY' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'
                            }`}>
                              {txn.type}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`credit-badge ${
                              txn.creditType === 'verra' ? 'credit-badge-verra' :
                              txn.creditType === 'gold' ? 'credit-badge-gold-standard' : 'credit-badge-cdm'
                            }`}>
                              {CREDIT_TYPES.find(c => c.id === txn.creditType)?.name}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold">{txn.amount} {t('tonnes')}</TableCell>
                          <TableCell className="font-semibold flex items-center">
                            <IndianRupee size={14} />{txn.totalValue.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-foreground font-medium">{txn.buyerName}</p>
                              <p className="text-sm text-muted-foreground">{txn.sellerName}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              txn.status === 'completed' 
                                ? 'bg-primary/20 text-primary' 
                                : txn.status === 'pending'
                                ? 'bg-accent/20 text-accent'
                                : 'bg-secondary/20 text-secondary'
                            }`}>
                              {txn.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Compliance Reports Tab */}
            {activeTab === 'compliance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Transaction Summary Report */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-primary/20 text-primary">
                        <FileBarChart size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">Transaction Summary</h3>
                        <p className="text-sm text-muted-foreground">Complete transaction history</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Total Transactions</span>
                        <span className="font-bold">{transactions.length}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Completed</span>
                        <span className="font-bold text-primary">{transactions.filter(t => t.status === 'completed').length}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Total Value</span>
                        <span className="font-bold flex items-center"><IndianRupee size={14} />{transactions.reduce((sum, t) => sum + t.totalValue, 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => exportToCSV(transactions, 'transactions_compliance')}
                        className="btn-seller flex-1 flex items-center justify-center gap-2"
                      >
                        <Download size={18} />
                        {t('exportToCSV')}
                      </button>
                    </div>
                  </div>

                  {/* User Activity Report */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-secondary/20 text-secondary">
                        <Users size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">User Activity Report</h3>
                        <p className="text-sm text-muted-foreground">User statistics and activity</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Total Users</span>
                        <span className="font-bold">{users.length}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Active Users</span>
                        <span className="font-bold text-primary">{users.filter(u => u.status === 'active').length}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Verified Users</span>
                        <span className="font-bold">{users.filter(u => u.verified).length}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => exportToCSV(users, 'users_compliance')}
                        className="btn-buyer flex-1 flex items-center justify-center gap-2"
                      >
                        <Download size={18} />
                        {t('exportToCSV')}
                      </button>
                    </div>
                  </div>

                  {/* Carbon Credit Report */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-accent/20 text-accent">
                        <Leaf size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">Carbon Credit Ledger</h3>
                        <p className="text-sm text-muted-foreground">Credit issuance and transfers</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Total Credits Issued</span>
                        <span className="font-bold">{PLATFORM_STATS.totalCreditsTraded.toLocaleString()} {t('tonnes')}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Pending Verification</span>
                        <span className="font-bold text-accent">{verifications.reduce((sum, v) => sum + v.estimatedCredits, 0).toFixed(2)} {t('tonnes')}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Active Listings</span>
                        <span className="font-bold">{PLATFORM_STATS.activeListings}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="btn-gold flex-1 flex items-center justify-center gap-2">
                        <Download size={18} />
                        {t('generateReport')}
                      </button>
                    </div>
                  </div>

                  {/* Regulatory Compliance */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-destructive/20 text-destructive">
                        <Shield size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">Regulatory Compliance</h3>
                        <p className="text-sm text-muted-foreground">SEBI & IBBI compliance status</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between p-3 bg-muted rounded-lg items-center">
                        <span className="text-muted-foreground">KYC Verified</span>
                        <span className="flex items-center gap-2 text-primary font-bold">
                          <CheckCircle size={16} /> 98%
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg items-center">
                        <span className="text-muted-foreground">AML Checks</span>
                        <span className="flex items-center gap-2 text-primary font-bold">
                          <CheckCircle size={16} /> Passed
                        </span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg items-center">
                        <span className="text-muted-foreground">Last Audit</span>
                        <span className="font-bold">Jan 15, 2024</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-6 py-3 rounded-xl font-semibold border border-border text-foreground hover:bg-muted flex-1 flex items-center justify-center gap-2">
                        <Download size={18} />
                        {t('downloadReport')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;