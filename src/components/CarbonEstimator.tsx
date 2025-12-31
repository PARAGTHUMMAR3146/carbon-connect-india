import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Leaf, Droplets, TreeDeciduous, Sparkles, CheckCircle, IndianRupee } from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { CROPS, SOIL_TYPES, FARMING_PRACTICES, RESIDUE_MANAGEMENT, IRRIGATION_TYPES, calculateCarbonCredits, BASE_CARBON_PRICE } from '@/lib/mockData';

interface CarbonEstimatorProps {
  lang: Language;
  onClose: () => void;
  onComplete: (credits: number, earnings: number) => void;
}

const CarbonEstimator: React.FC<CarbonEstimatorProps> = ({ lang, onClose, onComplete }) => {
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];
  
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState({
    landSize: 5,
    cropType: 'rice',
    soilType: 'alluvial',
    practices: [] as string[],
    residueManagement: 'no_burn',
    irrigationType: 'canal',
  });

  const [result, setResult] = useState<{ credits: number; earnings: number } | null>(null);

  const togglePractice = (id: string) => {
    setFormData(prev => ({
      ...prev,
      practices: prev.practices.includes(id)
        ? prev.practices.filter(p => p !== id)
        : [...prev.practices, id],
    }));
  };

  const handleCalculate = () => {
    const { credits, earnings } = calculateCarbonCredits(formData);
    setResult({ credits, earnings });
    setStep(5);
  };

  const handleConfirm = () => {
    if (result) {
      onComplete(result.credits, result.earnings);
    }
  };

  const progressWidth = `${(step / totalSteps) * 100}%`;

  return (
    <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl max-w-lg w-full shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="hero-seller p-6 text-primary-foreground relative overflow-hidden">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Leaf size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t('estimateWizard')}</h2>
              <p className="text-sm opacity-80">{t('step')} {Math.min(step, 4)} / {totalSteps}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Step 1: Land & Crop */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <TreeDeciduous size={18} className="text-primary" />
                  {t('landSize')}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="100"
                  step="0.5"
                  value={formData.landSize}
                  onChange={e => setFormData({ ...formData, landSize: parseFloat(e.target.value) })}
                  className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-muted-foreground">0.5 ha</span>
                  <span className="text-2xl font-bold text-primary">{formData.landSize} ha</span>
                  <span className="text-sm text-muted-foreground">100 ha</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Leaf size={18} className="text-primary" />
                  {t('cropType')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {CROPS.map(crop => (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, cropType: crop.id })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.cropType === crop.id
                          ? 'border-primary bg-emerald-50'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium text-foreground">
                        {lang === 'en' ? crop.name : crop.nameHi}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Soil Type */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  {t('soilType')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {SOIL_TYPES.map(soil => (
                    <button
                      key={soil.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, soilType: soil.id })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.soilType === soil.id
                          ? 'border-primary bg-emerald-50'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium text-foreground">
                        {lang === 'en' ? soil.name : soil.nameHi}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Farming Practices */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Sparkles size={18} className="text-primary" />
                  {t('farmingPractices')}
                  <span className="text-xs text-muted-foreground font-normal">
                    ({lang === 'en' ? 'Select all that apply' : 'सभी लागू चुनें'})
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {FARMING_PRACTICES.map(practice => (
                    <button
                      key={practice.id}
                      type="button"
                      onClick={() => togglePractice(practice.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.practices.includes(practice.id)
                          ? 'border-primary bg-emerald-50'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground text-sm">
                          {lang === 'en' ? practice.name : practice.nameHi}
                        </span>
                        {formData.practices.includes(practice.id) && (
                          <CheckCircle size={18} className="text-primary" />
                        )}
                      </div>
                      <span className="text-xs text-primary font-semibold">
                        +{Math.round((practice.bonus - 1) * 100)}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Residue & Irrigation */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  {t('residueManagement')}
                </label>
                <div className="space-y-2">
                  {RESIDUE_MANAGEMENT.map(rm => (
                    <button
                      key={rm.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, residueManagement: rm.id })}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                        formData.residueManagement === rm.id
                          ? 'border-primary bg-emerald-50'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium text-foreground">
                        {lang === 'en' ? rm.name : rm.nameHi}
                      </span>
                      <span className={`text-sm font-bold ${rm.multiplier >= 1 ? 'text-primary' : 'text-destructive'}`}>
                        {rm.multiplier >= 1 ? '+' : ''}{Math.round((rm.multiplier - 1) * 100)}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Droplets size={18} className="text-primary" />
                  {t('irrigationType')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {IRRIGATION_TYPES.map(irr => (
                    <button
                      key={irr.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, irrigationType: irr.id })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.irrigationType === irr.id
                          ? 'border-primary bg-emerald-50'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium text-foreground text-sm">
                        {lang === 'en' ? irr.name : irr.nameHi}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Results */}
          {step === 5 && result && (
            <div className="text-center animate-fade-in py-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{t('congratulations')}</h3>
              
              <div className="bg-muted rounded-2xl p-6 mt-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('estimatedCredits')}</p>
                  <p className="text-4xl font-extrabold text-primary">
                    {result.credits.toFixed(2)}
                    <span className="text-lg font-normal text-muted-foreground ml-2">tonnes CO₂</span>
                  </p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('estimatedEarnings')}</p>
                  <p className="text-4xl font-extrabold text-gradient-gold flex items-center justify-center gap-1">
                    <IndianRupee size={32} />
                    {result.earnings.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    @ ₹{BASE_CARBON_PRICE}/{lang === 'en' ? 'tonne' : 'टन'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3">
          {step > 1 && step <= 4 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 rounded-xl border border-border font-semibold text-muted-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft size={18} />
              {t('back')}
            </button>
          )}
          
          {step < 4 && (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 btn-seller flex items-center justify-center gap-2"
            >
              {t('next')}
              <ChevronRight size={18} />
            </button>
          )}
          
          {step === 4 && (
            <button
              onClick={handleCalculate}
              className="flex-1 btn-seller flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              {t('calculate')}
            </button>
          )}
          
          {step === 5 && (
            <button
              onClick={handleConfirm}
              className="flex-1 btn-seller flex items-center justify-center gap-2"
            >
              {t('listNow')}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarbonEstimator;
