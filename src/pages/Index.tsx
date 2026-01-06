import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '@/lib/translations';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/components/Dashboard';
import AdminDashboard from '@/components/AdminDashboard';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, role, isLoading, signOut } = useAuth();
  const [lang, setLang] = useState<Language>('en');

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

  // Missing profile or role - show a helpful message
  if (!profile || !role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card rounded-3xl shadow-xl p-8 max-w-md text-center border border-border">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Loader2 size={32} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            {lang === 'en' ? 'Profile Setup Incomplete' : 'प्रोफ़ाइल सेटअप अधूरा'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {lang === 'en' 
              ? 'Your account is missing some information. Please sign out and register again.'
              : 'आपके खाते में कुछ जानकारी गायब है। कृपया साइन आउट करें और फिर से पंजीकरण करें।'
            }
          </p>
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
          >
            {lang === 'en' ? 'Sign Out & Register Again' : 'साइन आउट करें और फिर से पंजीकरण करें'}
          </button>
        </div>
      </div>
    );
  }

  // Show admin dashboard for admins
  if (role === 'admin') {
    return (
      <AdminDashboard
        lang={lang}
        onLogout={handleLogout}
      />
    );
  }

  // Build userData from profile for seller/buyer
  const userData = {
    name: profile.full_name || '',
    phone: profile.phone || '',
    state: profile.state || 'PB',
    district: profile.district || '',
    companyName: profile.company_name || '',
    gst: profile.gst_number || '',
    industry: profile.industry_type || 'steel',
    coordinates: profile.coordinates || { lat: 28.6139, lng: 77.2090 },
  };

  return (
    <Dashboard
      lang={lang}
      role={role as 'seller' | 'buyer'}
      userData={userData}
      onToggleLang={toggleLang}
      onLogout={handleLogout}
    />
  );
};

export default Index;
