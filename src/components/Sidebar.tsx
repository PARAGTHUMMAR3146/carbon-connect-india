import React from 'react';
import { 
  LayoutDashboard, ShoppingCart, ListChecks, Wallet, 
  History, FileBarChart, HelpCircle, Settings, LogOut,
  Leaf, Factory, Languages, X
} from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/translations';

interface SidebarProps {
  lang: Language;
  role: 'seller' | 'buyer';
  activeTab: string;
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  onToggleLang: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  lang,
  role,
  activeTab,
  isOpen,
  onClose,
  onTabChange,
  onToggleLang,
  onLogout,
}) => {
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];

  const isSeller = role === 'seller';

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    isSeller 
      ? { id: 'my-listings', label: t('myListings'), icon: ListChecks }
      : { id: 'marketplace', label: t('marketplace'), icon: ShoppingCart },
    { id: 'wallet', label: t('wallet'), icon: Wallet },
    { id: 'transactions', label: t('transactions'), icon: History },
    { id: 'reports', label: t('reports'), icon: FileBarChart },
  ];

  const handleTabClick = (id: string) => {
    onTabChange(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-50 w-72 h-screen bg-card border-r border-border
        flex flex-col transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isSeller ? 'bg-primary shadow-emerald' : 'bg-secondary shadow-navy'
              }`}>
                {isSeller 
                  ? <Leaf className="text-primary-foreground" size={20} /> 
                  : <Factory className="text-secondary-foreground" size={20} />
                }
              </div>
              <span className={`text-xl font-bold ${isSeller ? 'text-primary' : 'text-secondary'}`}>
                {t('appTitle')}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`nav-item w-full ${
                activeTab === item.id
                  ? isSeller ? 'nav-item-active-seller' : 'nav-item-active-buyer'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}

          <div className="h-px bg-border my-4" />

          <button
            onClick={() => handleTabClick('support')}
            className={`nav-item w-full ${
              activeTab === 'support'
                ? isSeller ? 'nav-item-active-seller' : 'nav-item-active-buyer'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <HelpCircle size={20} />
            <span>{t('support')}</span>
          </button>

          <button
            onClick={() => handleTabClick('settings')}
            className={`nav-item w-full ${
              activeTab === 'settings'
                ? isSeller ? 'nav-item-active-seller' : 'nav-item-active-buyer'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Settings size={20} />
            <span>{t('settings')}</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={onToggleLang}
            className="w-full py-2.5 px-4 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Languages size={18} />
            {t('switchLang')}
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <LogOut size={18} />
            {t('logout')}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
