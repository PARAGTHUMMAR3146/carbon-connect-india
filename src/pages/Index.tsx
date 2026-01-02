import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Language } from '@/lib/translations';
import Dashboard from '@/components/Dashboard';
import AdminDashboard from '@/components/AdminDashboard';

const Index = () => {
  const navigate = useNavigate();
  const { user, role, isLoading, profile, signOut } = useAuth();
  const [lang, setLang] = useState<Language>('en');

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !role) {
    return null;
  }

  // Render admin dashboard for admin role
  if (role === 'admin') {
    return (
      <AdminDashboard 
        lang={lang}
        onToggleLang={toggleLang}
        onLogout={handleLogout}
      />
    );
  }

  // Render seller/buyer dashboard
  const userData = {
    name: profile?.full_name || '',
    phone: profile?.phone || '',
    state: profile?.state || '',
    district: profile?.district || '',
    companyName: profile?.company_name || '',
    gst: profile?.gst_number || '',
    industry: profile?.industry_type || '',
    coordinates: profile?.coordinates as { lat: number; lng: number } | undefined,
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
