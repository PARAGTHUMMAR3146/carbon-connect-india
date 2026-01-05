import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '@/lib/translations';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/components/Dashboard';
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
  if (!user || !profile || !role) {
    return null;
  }

  // Build userData from profile
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
