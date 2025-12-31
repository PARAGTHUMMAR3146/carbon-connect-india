import React, { useState } from 'react';
import { ChevronLeft, User, Phone, MapPin, Building, FileText, Factory, Leaf } from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { INDIAN_STATES, INDUSTRIES } from '@/lib/mockData';

interface RegistrationFormProps {
  lang: Language;
  role: 'seller' | 'buyer';
  onBack: () => void;
  onSubmit: (data: UserData) => void;
}

export interface UserData {
  name: string;
  phone: string;
  state: string;
  district: string;
  companyName: string;
  gst: string;
  industry: string;
  coordinates: { lat: number; lng: number };
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ lang, role, onBack, onSubmit }) => {
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];
  
  const [formData, setFormData] = useState<UserData>({
    name: '',
    phone: '',
    state: 'PB',
    district: '',
    companyName: '',
    gst: '',
    industry: 'steel',
    coordinates: { lat: 31.1471, lng: 75.3412 },
  });

  const handleStateChange = (stateId: string) => {
    const state = INDIAN_STATES.find(s => s.id === stateId);
    setFormData({
      ...formData,
      state: stateId,
      coordinates: state ? { lat: state.lat, lng: state.lng } : formData.coordinates,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isSeller = role === 'seller';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className={`${isSeller ? 'hero-seller' : 'hero-buyer'} rounded-t-3xl p-6 text-primary-foreground`}>
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-sm opacity-80 hover:opacity-100 mb-4"
          >
            <ChevronLeft size={18} />
            {t('back')}
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              {isSeller ? <Leaf size={28} /> : <Factory size={28} />}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('registerTitle')}</h1>
              <p className="text-sm opacity-80">
                {isSeller ? t('farmer') : t('buyer')}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form 
          onSubmit={handleSubmit}
          className="bg-card rounded-b-3xl border border-t-0 border-border p-6 space-y-5"
        >
          {isSeller ? (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('fullName')}
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="input-modern pl-12"
                    placeholder={lang === 'en' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('phone')}
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="input-modern pl-12"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('state')}
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={formData.state}
                    onChange={e => handleStateChange(e.target.value)}
                    className="input-modern pl-12 appearance-none cursor-pointer"
                  >
                    {INDIAN_STATES.map(state => (
                      <option key={state.id} value={state.id}>
                        {lang === 'en' ? state.name : state.nameHi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('district')}
                </label>
                <input
                  required
                  type="text"
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  className="input-modern"
                  placeholder={lang === 'en' ? 'Enter your district' : 'अपना जिला दर्ज करें'}
                />
              </div>
            </>
          ) : (
            <>
              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('companyName')}
                </label>
                <div className="relative">
                  <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    required
                    type="text"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    className="input-modern pl-12"
                    placeholder={lang === 'en' ? 'Enter company name' : 'कंपनी का नाम दर्ज करें'}
                  />
                </div>
              </div>

              {/* GST Number */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('gst')}
                </label>
                <div className="relative">
                  <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    required
                    type="text"
                    value={formData.gst}
                    onChange={e => setFormData({ ...formData, gst: e.target.value })}
                    className="input-modern pl-12"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
              </div>

              {/* Industry Type */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('industryType')}
                </label>
                <select
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  className="input-modern appearance-none cursor-pointer"
                >
                  {INDUSTRIES.map(ind => (
                    <option key={ind.id} value={ind.id}>
                      {lang === 'en' ? ind.name : ind.nameHi}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('state')}
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={formData.state}
                    onChange={e => handleStateChange(e.target.value)}
                    className="input-modern pl-12 appearance-none cursor-pointer"
                  >
                    {INDIAN_STATES.map(state => (
                      <option key={state.id} value={state.id}>
                        {lang === 'en' ? state.name : state.nameHi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
              isSeller 
                ? 'btn-seller' 
                : 'btn-buyer'
            }`}
          >
            {t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
