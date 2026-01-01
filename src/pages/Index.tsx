import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import RoleSelection from '@/components/RoleSelection';
import RegistrationForm, { UserData } from '@/components/RegistrationForm';
import Dashboard from '@/components/Dashboard';
import AdminDashboard from '@/components/AdminDashboard';

type View = 'role-selection' | 'registration' | 'dashboard' | 'admin';

const Index = () => {
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<View>('role-selection');
  const [role, setRole] = useState<'seller' | 'buyer' | 'admin' | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  const handleRoleSelect = (selectedRole: 'seller' | 'buyer' | 'admin') => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      // Admin goes directly to admin dashboard (in production, would have auth)
      setView('admin');
    } else {
      setView('registration');
    }
  };

  const handleRegistrationBack = () => {
    setView('role-selection');
    setRole(null);
  };

  const handleRegistrationSubmit = (data: UserData) => {
    setUserData(data);
    setView('dashboard');
  };

  const handleLogout = () => {
    setView('role-selection');
    setRole(null);
    setUserData(null);
  };

  // Role Selection View
  if (view === 'role-selection') {
    return (
      <RoleSelection
        lang={lang}
        onToggleLang={toggleLang}
        onSelectRole={handleRoleSelect}
      />
    );
  }

  // Registration View
  if (view === 'registration' && role && role !== 'admin') {
    return (
      <RegistrationForm
        lang={lang}
        role={role}
        onBack={handleRegistrationBack}
        onSubmit={handleRegistrationSubmit}
      />
    );
  }

  // Admin Dashboard View
  if (view === 'admin') {
    return (
      <AdminDashboard
        lang={lang}
        onToggleLang={toggleLang}
        onLogout={handleLogout}
      />
    );
  }

  // Dashboard View
  if (view === 'dashboard' && role && role !== 'admin' && userData) {
    return (
      <Dashboard
        lang={lang}
        role={role}
        userData={userData}
        onToggleLang={toggleLang}
        onLogout={handleLogout}
      />
    );
  }

  return null;
};

export default Index;
