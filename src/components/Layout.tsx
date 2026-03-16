import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, Map, BarChart2, Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Daily Log', href: '/log', icon: BookOpen },
  { name: 'Timeline', href: '/timeline', icon: Calendar },
  { name: 'Roadmap', href: '/roadmap', icon: Map },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
];

export default function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-lg font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
          Journey Tracker
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        md:flex flex-col w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 
        absolute md:relative z-10 h-[calc(100vh-60px)] md:h-screen
      `}>
        <div className="hidden md:block p-6">
          <h1 className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            Journey Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Data Scientist Path</p>
        </div>

        <nav className="flex-1 px-4 py-4 md:py-0 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            {isDarkMode ? (
              <>
                <Sun className="mr-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
                Dark Mode
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-60px)] md:h-screen">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 md:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
