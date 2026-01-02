import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Building, FileText, ChevronLeft, Leaf, Factory, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { INDIAN_STATES, INDUSTRIES } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { z } from 'zod';

type AuthMode = 'login' | 'signup';
type SelectedRole = 'seller' | 'buyer' | 'admin';

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function Auth() {
  const navigate = useNavigate();
  const { user, signIn, signUp, isLoading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<SelectedRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    state: '',
    district: '',
    companyName: '',
    gstNumber: '',
    industryType: '',
  });

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const validateForm = (): boolean => {
    try {
      emailSchema.parse(formData.email);
      passwordSchema.parse(formData.password);
      
      if (mode === 'signup') {
        if (!selectedRole) {
          toast.error('Please select a role');
          return false;
        }
        if (selectedRole === 'seller' && !formData.fullName) {
          toast.error('Please enter your full name');
          return false;
        }
        if (selectedRole === 'buyer' && !formData.companyName) {
          toast.error('Please enter your company name');
          return false;
        }
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      if (mode === 'login') {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
          navigate('/');
        }
      } else {
        const profileData = {
          full_name: selectedRole === 'seller' ? formData.fullName : formData.companyName,
          phone: formData.phone || null,
          state: formData.state || null,
          district: formData.district || null,
          company_name: selectedRole === 'buyer' ? formData.companyName : null,
          gst_number: formData.gstNumber || null,
          industry_type: formData.industryType || null,
          coordinates: null,
        };

        const { error } = await signUp(formData.email, formData.password, selectedRole!, profileData);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created successfully!');
          navigate('/');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleColors = {
    seller: 'emerald',
    buyer: 'navy',
    admin: 'gold',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card-elevated p-8 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-primary rounded-2xl mb-4">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">CarbonMax</h1>
            <p className="text-muted-foreground mt-2">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </p>
          </div>

          {/* Role Selection (Signup only) */}
          {mode === 'signup' && !selectedRole && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-center text-muted-foreground mb-4">
                Select your role
              </p>
              
              <button
                onClick={() => setSelectedRole('seller')}
                className="w-full p-4 rounded-xl border-2 border-border hover:border-emerald-500 hover:bg-emerald-500/5 transition-all flex items-center gap-4"
              >
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <Leaf className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Farmer / Seller</p>
                  <p className="text-sm text-muted-foreground">Sell carbon credits</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole('buyer')}
                className="w-full p-4 rounded-xl border-2 border-border hover:border-navy-500 hover:bg-navy-500/5 transition-all flex items-center gap-4"
              >
                <div className="p-3 rounded-xl bg-navy-500/10">
                  <Factory className="h-6 w-6 text-navy-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Industry / Buyer</p>
                  <p className="text-sm text-muted-foreground">Buy carbon credits</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole('admin')}
                className="w-full p-4 rounded-xl border-2 border-border hover:border-gold-500 hover:bg-gold-500/5 transition-all flex items-center gap-4"
              >
                <div className="p-3 rounded-xl bg-gold-500/10">
                  <Shield className="h-6 w-6 text-gold-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Administrator</p>
                  <p className="text-sm text-muted-foreground">Platform management</p>
                </div>
              </button>

              <div className="pt-4 text-center">
                <button
                  onClick={() => setMode('login')}
                  className="text-sm text-primary hover:underline"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          )}

          {/* Auth Form */}
          {(mode === 'login' || selectedRole) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && selectedRole && (
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Change role
                </button>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Signup-specific fields */}
              {mode === 'signup' && selectedRole === 'seller' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        className="pl-10"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">State</label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => setFormData({ ...formData, state: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state.id} value={state.name}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {mode === 'signup' && selectedRole === 'buyer' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Company Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter company name"
                        className="pl-10"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">GST Number</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter GST number"
                        className="pl-10"
                        value={formData.gstNumber}
                        onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Industry Type</label>
                    <Select
                      value={formData.industryType}
                      onValueChange={(value) => setFormData({ ...formData, industryType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry.id} value={industry.name}>
                            {industry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {mode === 'signup' && selectedRole === 'admin' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      className="pl-10"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </Button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setSelectedRole(null);
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  {mode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
