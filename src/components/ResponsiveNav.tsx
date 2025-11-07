import { Home, Package, ShoppingCart, ChefHat, User } from 'lucide-react';

interface ResponsiveNavProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  notificationCount?: number;
}

export function ResponsiveNav({ activeScreen, onNavigate, notificationCount = 0 }: ResponsiveNavProps) {
  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'inventory', label: 'Inventaire', icon: Package },
    { id: 'lists', label: 'Listes', icon: ShoppingCart },
    { id: 'recipes', label: 'Recettes', icon: ChefHat },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 z-50 transition-colors shadow-sm">
        <div className="flex justify-around items-center px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            const showBadge = item.id === 'inventory' && notificationCount > 0;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center gap-1 transition-colors min-w-[70px] py-2 relative"
              >
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
                {showBadge && (
                  <span className="absolute top-0 right-5 w-5 h-5 bg-red-400 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
                <span
                  className={`text-xs transition-colors ${
                    isActive ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex-col transition-colors z-40">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl text-emerald-500 text-center">Kitch'In</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">Gestion de cuisine</p>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            const showBadge = item.id === 'inventory' && notificationCount > 0;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                  isActive 
                    ? 'bg-emerald-500 text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {showBadge && (
                  <span className="absolute top-2 left-8 w-5 h-5 bg-red-400 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => onNavigate('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeScreen === 'profile'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profil</span>
          </button>
        </div>
      </nav>
    </>
  );
}