import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { MdNotifications, MdDarkMode, MdLightMode, MdSearch } from 'react-icons/md';

export const Header = () => {
  const { user } = useAuth();
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDark(!dark);
  };

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <header className="sticky top-0 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{greet()},</p>
          <h2 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">
            {user?.prenom} {user?.nom}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:flex items-center">
            <MdSearch className="absolute left-3 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Rechercher un stagiaire..."
              className="glass-input pl-9 w-64"
            />
          </div>

          {/* Dark mode */}
          <motion.button
            whileTap={{ scale:0.9 }}
            onClick={toggleDark}
            className="w-10 h-10 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors"
          >
            {dark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileTap={{ scale:0.9 }}
            className="relative w-10 h-10 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors"
          >
            <MdNotifications className="text-xl" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </motion.button>

          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white font-bold text-sm shadow-neon">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
};
