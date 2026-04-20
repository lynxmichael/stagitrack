import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSchool, MdLogout } from 'react-icons/md';

// ─── Overlay de déconnexion ────────────────────────────────────
function LogoutOverlay({ user }) {
  const hour = new Date().getHours();
  const wish = hour < 12 ? 'Bonne journée' : hour < 17 ? 'Bon après-midi' : hour < 21 ? 'Bonne soirée' : 'Bonne nuit';
  const initials = `${user?.prenom?.[0] || ''}${user?.nom?.[0] || ''}`.toUpperCase();

  const dots = Array.from({ length: 14 }, (_, i) => ({
    angle: (i / 14) * 360,
    delay: i * 0.055,
    dist: 90 + (i % 3) * 20,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 55%,#0c1a2e 100%)' }}
    >
      {/* Cercles orbitaux */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="absolute w-[340px] h-[340px] rounded-full border border-white/5"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.7 }}
          className="absolute w-[520px] h-[520px] rounded-full border border-white/5"
        />
        {dots.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.65, 0], scale: [0, 1, 0] }}
            transition={{ delay: 0.32 + d.delay, duration: 1.3, ease: 'easeOut' }}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/35"
            style={{ transform: `rotate(${d.angle}deg) translateX(${d.dist}px)` }}
          />
        ))}
      </div>

      {/* Halo rouge */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.4, 1.3, 1], opacity: [0, 0.22, 0.08] }}
        transition={{ delay: 0.1, duration: 1.3 }}
        className="absolute w-[520px] h-[520px] rounded-full bg-red-500/25 blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center px-8 text-center select-none">

        {/* Avatar + badge logout */}
        <motion.div
          initial={{ scale: 0, rotate: 40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.15 }}
          className="relative mb-7"
        >
          <div className="flex items-center justify-center w-20 h-20 text-2xl font-black border shadow-xl rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border-white/10 text-white/50">
            {initials}
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.52, type: 'spring', damping: 11 }}
            className="absolute flex items-center justify-center bg-red-500 rounded-full shadow-lg -bottom-2 -right-2 w-9 h-9"
          >
            <MdLogout className="text-lg text-white" />
          </motion.div>
        </motion.div>

        {/* À bientôt */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="text-white/35 text-xs font-bold uppercase tracking-[0.22em] mb-1"
        >
          À bientôt
        </motion.p>

        {/* Nom */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.46 }}
          className="mb-1 text-3xl font-black tracking-tight text-white"
        >
          {user?.prenom}{' '}
          <span className="text-white/35">{user?.nom}</span>
        </motion.h1>

        {/* Souhait contextuel */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.54 }}
          className="text-sm text-white/30 mb-7"
        >
          {wish} 👋
        </motion.p>

        {/* Barre rouge qui se vide */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-44 h-0.5 bg-white/10 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ delay: 0.65, duration: 1.5, ease: 'easeInOut' }}
            className="h-full rounded-full bg-gradient-to-r from-red-400 to-rose-600"
          />
        </motion.div>

        {/* Logo bas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.72 }}
          className="flex items-center gap-2 mt-5"
        >
          <MdSchool className="text-lg" style={{ color: 'rgba(255,255,255,0.15)' }} />
          <span className="text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.15)' }}>StagiTrack</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Manual JWT decode ─────────────────────────────────────────
function jwtDecode(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch { return null; }
}

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { token } = await authApi.login(email, password);
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      setTimeout(() => navigate('/'), 2500);
      return { success: true, user: decoded };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Identifiants invalides');
      return { success: false };
    }
  };

  const logout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      setUser(null);
      setLoggingOut(false);
      navigate('/login');
    }, 2400);
  };

  const canAccessStageType = (typeStage) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.type_conseiller === 'les_deux') return true;
    if (user.type_conseiller === 'ecole_validation') return ['ecole', 'validation'].includes(typeStage);
    if (user.type_conseiller === 'qualification') return typeStage === 'qualification';
    return false;
  };

  const getAllowedStageTypes = () => {
    if (!user) return [];
    if (user.role === 'admin' || user.type_conseiller === 'les_deux') return ['ecole', 'validation', 'qualification'];
    if (user.type_conseiller === 'ecole_validation') return ['ecole', 'validation'];
    if (user.type_conseiller === 'qualification') return ['qualification'];
    return [];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, canAccessStageType, getAllowedStageTypes, loading }}>
      <AnimatePresence>
        {loggingOut && <LogoutOverlay user={user} />}
      </AnimatePresence>
      {children}
    </AuthContext.Provider>
  );
};