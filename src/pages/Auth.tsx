import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Factory, Sprout, Languages, ChevronLeft, User, Phone, MapPin, Building, FileText, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TRANSLATIONS, Language } from '@/lib/translations';
import { INDIAN_STATES, INDUSTRIES } from '@/lib/mockData';

type AuthView = 'role-selection' | 'signup' | 'login';
type Role = 'seller' | 'buyer';

const Auth = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<AuthView>('role-selection');
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('PB');
  const [district, setDistrict] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [industryType, setIndustryType] = useState('steel');

  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];
  const toggleLang = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

  // Check if user is already logged in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate('/', { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setView('signup');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    
    setIsLoading(true);
    
    try {
      const selectedState = INDIAN_STATES.find(s => s.id === state);
      const coordinates = selectedState 
        ? { lat: selectedState.lat, lng: selectedState.lng }
        : { lat: 28.6139, lng: 77.2090 };

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: role === 'seller' ? fullName : companyName,
            role: role,
          }
        }
      });

      if (error) throw error;
      
      if (data.user) {
        // Create profile
        const profileData = {
          user_id: data.user.id,
          full_name: role === 'seller' ? fullName : companyName,
          phone,
          state,
          district: district || null,
          company_name: role === 'buyer' ? companyName : null,
          gst_number: role === 'buyer' ? gstNumber : null,
          industry_type: role === 'buyer' ? industryType : null,
          coordinates,
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Continue anyway, profile can be created later
        }

        // Create user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: role,
          });

        if (roleError) {
          console.error('Role creation error:', roleError);
        }

        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.message?.includes('already registered')) {
        toast.error('This email is already registered. Please login instead.');
        setView('login');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Role Selection View
  if (view === 'role-selection') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
        <button 
          onClick={toggleLang} 
          className="absolute top-6 right-6 flex items-center bg-card px-4 py-2 rounded-full shadow-sm border border-border text-sm font-bold text-foreground hover:bg-muted transition-colors"
        >
          <Languages size={16} className="mr-2" /> {t('switchLang')}
        </button>

        <div className="max-w-4xl w-full text-center">
          <div className="inline-flex items-center justify-center p-4 bg-primary rounded-2xl mb-6 shadow-xl">
            <Leaf size={40} className="text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2">
            {t('appTitle')}
          </h1>
          <p className="text-muted-foreground text-lg mb-8">{t('appTagline')}</p>
          <h2 className="text-2xl font-bold text-foreground mb-8">{t('roleSelectTitle')}</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <button 
              onClick={() => handleRoleSelect('seller')} 
              className="bg-card rounded-3xl p-8 border-2 border-border hover:border-primary hover:shadow-xl transition-all text-left group"
            >
              <div className="inline-block p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-primary mb-4">
                <Sprout size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t('farmer')}</h3>
              <p className="text-muted-foreground mt-2">{t('farmerDesc')}</p>
            </button>

            <button 
              onClick={() => handleRoleSelect('buyer')} 
              className="bg-card rounded-3xl p-8 border-2 border-border hover:border-secondary hover:shadow-xl transition-all text-left group"
            >
              <div className="inline-block p-4 bg-navy-100 dark:bg-navy-900/30 rounded-2xl text-secondary mb-4">
                <Factory size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t('buyer')}</h3>
              <p className="text-muted-foreground mt-2">{t('buyerDesc')}</p>
            </button>
          </div>

          <p className="text-muted-foreground">
            Already have an account?{' '}
            <button 
              onClick={() => setView('login')} 
              className="text-primary font-semibold hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Login View
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl shadow-xl w-full max-w-md p-8 border border-border">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setView('role-selection')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft />
            </button>
            <h2 className="text-2xl font-bold text-foreground">Login</h2>
            <div className="w-6" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-muted-foreground" />
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-modern pl-10"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-muted-foreground" />
                <input 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-modern pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-primary-foreground shadow-lg mt-6 bg-primary hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Don't have an account?{' '}
            <button 
              onClick={() => setView('role-selection')} 
              className="text-primary font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Signup View
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-xl w-full max-w-md p-8 border border-border">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => { setView('role-selection'); setRole(null); }} 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft />
          </button>
          <h2 className="text-2xl font-bold text-foreground">{t('registerTitle')}</h2>
          <div className="w-6" />
        </div>

        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 ${
          role === 'seller' 
            ? 'bg-emerald-100 text-primary' 
            : 'bg-navy-100 text-secondary'
        }`}>
          {role === 'seller' ? <Sprout size={16} /> : <Factory size={16} />}
          {role === 'seller' ? t('farmer') : t('buyer')}
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Email & Password */}
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-muted-foreground" />
              <input 
                required 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-modern pl-10"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-muted-foreground" />
              <input 
                required 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-modern pl-10 pr-10"
                placeholder="Min 6 characters"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {role === 'seller' ? (
            <>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">{t('fullName')}</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <input 
                    required 
                    type="text" 
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="input-modern pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">{t('phone')}</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <input 
                    required 
                    type="tel" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="input-modern pl-10"
                    placeholder="+91"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-1">{t('state')}</label>
                  <select 
                    className="input-modern"
                    value={state}
                    onChange={e => setState(e.target.value)}
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s.id} value={s.id}>
                        {lang === 'en' ? s.name : s.nameHi}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-1">{t('district')}</label>
                  <input 
                    type="text" 
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="input-modern"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">{t('companyName')}</label>
                <div className="relative">
                  <Building size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <input 
                    required 
                    type="text" 
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="input-modern pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">{t('gst')}</label>
                <div className="relative">
                  <FileText size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <input 
                    required 
                    type="text" 
                    value={gstNumber}
                    onChange={e => setGstNumber(e.target.value)}
                    className="input-modern pl-10"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">{t('phone')}</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <input 
                    required 
                    type="tel" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="input-modern pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">{t('industryType')}</label>
                <select 
                  className="input-modern"
                  value={industryType}
                  onChange={e => setIndustryType(e.target.value)}
                >
                  {INDUSTRIES.map(ind => (
                    <option key={ind.id} value={ind.id}>
                      {lang === 'en' ? ind.name : ind.nameHi}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1">{t('state')}</label>
                <select 
                  className="input-modern"
                  value={state}
                  onChange={e => setState(e.target.value)}
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s.id} value={s.id}>
                      {lang === 'en' ? s.name : s.nameHi}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-primary-foreground shadow-lg mt-6 transition-all disabled:opacity-50 ${
              role === 'seller' ? 'bg-primary hover:opacity-90' : 'bg-secondary hover:opacity-90'
            }`}
          >
            {isLoading ? 'Creating Account...' : t('submit')}
          </button>
        </form>

        <p className="text-center text-muted-foreground mt-6">
          Already have an account?{' '}
          <button 
            onClick={() => setView('login')} 
            className="text-primary font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
