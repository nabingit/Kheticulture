import React from 'react';
import { Home, Briefcase, Plus, User, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    return <div className="min-h-screen bg-green-50">{children}</div>;
  }

  const navItems = [
    { icon: Home, label: t('home'), path: '/' },
    { icon: Briefcase, label: t('myJobs'), path: '/my-jobs' },
    ...(user.userType === 'farmer' ? [{ icon: Plus, label: t('postJob'), path: '/post-job' }] : []),
    { icon: User, label: t('profile'), path: '/profile' }
  ];

  // Different background colors based on user type
  const bgGradient = user.userType === 'farmer' 
    ? 'bg-gradient-to-br from-green-50 via-green-25 to-emerald-50' 
    : 'bg-gradient-to-br from-blue-50 via-blue-25 to-indigo-50';
  
  // Main container gradients
  const mainContainerGradient = user.userType === 'farmer'
    ? 'bg-gradient-to-br from-green-50 via-green-100 to-emerald-100'
    : 'bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100';
    
  const navBorderColor = user.userType === 'farmer' ? 'border-green-100' : 'border-blue-100';
  const activeColor = user.userType === 'farmer' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50';
  const hoverColor = user.userType === 'farmer' ? 'hover:text-green-600' : 'hover:text-blue-600';

  return (
    <div className={`min-h-screen ${bgGradient} pb-20`}>
      {/* Language Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>
      
      <main className={`max-w-md mx-auto ${mainContainerGradient} min-h-screen border-2 border-gray-300 shadow-xl`}>
        {children}
      </main>
      
      {/* Simple Scalable Bolt.new Badge */}
<a
  href="https://bolt.new"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-20 right-4 z-40 group hover:scale-110 transition-transform duration-200"
  title="Built with Bolt.new"
>
  <img 
    src="https://github.com/nabingit/KhetiImproved/blob/main/black_circle_360x360%20(1).png?raw=true" 
    alt="Built with Bolt.new" 
    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 object-contain"
    onError={(e) => {
      // Fallback if image fails to load
      e.currentTarget.outerHTML = `
        <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-shadow duration-200">
          BOLT
        </div>
      `;
    }}
  />
</a>
      
      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t ${navBorderColor} px-4 py-2 z-40`}>
        <div className="max-w-md mx-auto flex justify-around">
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                location.pathname === path
                  ? activeColor
                  : `text-gray-500 ${hoverColor}`
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}