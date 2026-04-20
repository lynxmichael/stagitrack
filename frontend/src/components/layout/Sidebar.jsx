import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../ui/Badge';
import { MdDashboard, MdPeople, MdSchool, MdWarning, MdLogout, MdAdminPanelSettings } from 'react-icons/md';

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to:'/', label:'Tableau de bord', icon: MdDashboard, exact: true },
    { to:'/stagiaires', label:'Stagiaires', icon: MdSchool },
    { to:'/alertes', label:'Alertes', icon: MdWarning },
    { to:'/users', label:'Conseillers', icon: MdPeople, adminOnly: true },
  ];

  const filtered = navItems.filter(i => !i.adminOnly || user?.role === 'admin');

  const typeLabel = {
    ecole_validation: 'École & Validation',
    qualification: 'Qualification',
    les_deux: 'Tous les stages',
  };

  return (
    <motion.aside
      initial={{ x:-30, opacity:0 }}
      animate={{ x:0, opacity:1 }}
      transition={{ duration:0.4 }}
      className="fixed top-0 left-0 z-30 flex flex-col h-screen border-r w-72 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-card"
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 shadow-neon">
            <MdSchool className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight text-transparent bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text">
              StagiTrack
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Gestion des stages</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white rounded-full w-9 h-9 bg-gradient-to-br from-primary-400 to-accent-500">
            {user?.prenom?.[0]?.toUpperCase()}{user?.nom?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-100">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs truncate text-slate-500 dark:text-slate-400">
              {user?.role === 'admin' ? 'Administrateur' : typeLabel[user?.type_conseiller] || 'Conseiller'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge type={user?.role === 'admin' ? 'admin' : user?.type_conseiller} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-xs font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">Navigation</p>
        {filtered.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500/15 to-accent-500/15 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/40 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`text-xl flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
                {item.to === '/alertes' && (
                  <span className="w-2 h-2 ml-auto bg-red-500 rounded-full animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60">
        <button
          onClick={logout}
          className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-red-500 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <MdLogout className="text-xl" />
          <span>Déconnexion</span>
        </button>
      </div>
    </motion.aside>
  );
};