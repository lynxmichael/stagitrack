import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { MdEmail, MdLock, MdSchool, MdVisibility, MdVisibilityOff, MdCheckCircle } from 'react-icons/md';
import { ToastContainer } from 'react-toastify';

const ROLE_LABELS = {
  admin: { label: 'Administrateur', color: 'from-violet-500 to-purple-600' },
  conseiller: { label: 'Conseiller de stage', color: 'from-primary-500 to-accent-600' },
};

const TYPE_LABELS = {
  ecole_validation: 'École & Validation',
  qualification: 'Qualification',
  les_deux: 'Tous les stages',
};

function WelcomeOverlay({ user }) {
  const role = ROLE_LABELS[user?.role] || ROLE_LABELS.conseiller;
  const typeLabel = user?.type_conseiller ? TYPE_LABELS[user.type_conseiller] : null;
  const initials = `${user?.prenom?.[0] || ''}${user?.nom?.[0] || ''}`.toUpperCase();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const particles = Array.from({ length: 18 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 0.8,
    dur: Math.random() * 1.5 + 1.5,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0c2340 100%)' }}
    >
      {/* Particules flottantes */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [-10, 10, -10], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Halos animés */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-600/20 to-accent-600/20 blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center text-center px-8">

        {/* Check animé */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-2xl text-3xl font-black text-white`}>
              {initials}
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.45, type: 'spring', damping: 12 }}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg"
            >
              <MdCheckCircle className="text-white text-lg" />
            </motion.div>
          </div>
        </motion.div>

        {/* Salutation */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-white/50 text-base font-medium tracking-widest uppercase mb-1"
        >
          {greeting} 👋
        </motion.p>

        {/* Nom */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-4xl font-black text-white mb-2 tracking-tight"
        >
          {user?.prenom} <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">{user?.nom}</span>
        </motion.h1>

        {/* Rôle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex items-center gap-2 mb-6"
        >
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${role.color} shadow-lg`}>
            {role.label}
          </span>
          {typeLabel && (
            <span className="px-3 py-1.5 rounded-full text-xs font-medium text-white/70 bg-white/10 border border-white/15">
              {typeLabel}
            </span>
          )}
        </motion.div>

        {/* Barre de chargement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="w-48 h-1 bg-white/10 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.7, duration: 1.6, ease: 'easeInOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${role.color}`}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="text-white/30 text-xs mt-3 tracking-wide"
        >
          Chargement de votre espace…
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [welcomeUser, setWelcomeUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    if (result?.success) {
      setWelcomeUser(result.user);
    }
    setLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {welcomeUser && <WelcomeOverlay user={welcomeUser} />}
      </AnimatePresence>

    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0c2340 100%)' }}>

      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[{t:'-top-20',l:'-left-20',s:'w-96 h-96',c:'from-primary-600/30 to-accent-600/30',d:0},
          {t:'-bottom-20',l:'-right-20',s:'w-80 h-80',c:'from-accent-600/20 to-primary-600/20',d:2},
          {t:'top-1/2',l:'left-1/2',s:'w-64 h-64',c:'from-emerald-500/10 to-primary-600/10',d:4}].map((b,i) => (
          <motion.div key={i}
            animate={{ scale:[1,1.1,1], rotate:[0,180,360] }}
            transition={{ duration:15+i*5, repeat:Infinity, ease:'linear', delay:b.d }}
            className={`absolute ${b.t} ${b.l} ${b.s} rounded-full bg-gradient-to-br ${b.c} blur-3xl`} />
        ))}
      </div>

      <motion.div
        initial={{ opacity:0, y:30 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              animate={{ y:[0,-6,0] }}
              transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-neon mb-4"
            >
              <MdSchool className="text-white text-3xl" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-1">StagiTrack</h1>
            <p className="text-white/60 text-sm">Connectez-vous à votre espace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Adresse email</label>
              <div className="relative">
                <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  value={form.email}
                  onChange={e => setForm({...form, email:e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 transition text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Mot de passe</label>
              <div className="relative">
                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({...form, password:e.target.value})}
                  className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 transition text-sm"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition">
                  {showPwd ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale:1.01 }}
              whileTap={{ scale:0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 shadow-neon transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : 'Se connecter'}
            </motion.button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white/50 text-xs font-medium mb-2 text-center">Comptes de démonstration</p>
            <div className="space-y-1">
              {[
                {label:'Admin', email:'admin@stagitrack.fr'},
                {label:'École & Val.', email:'conseiller1@stagitrack.fr'},
                {label:'Qualification', email:'conseiller2@stagitrack.fr'},
              ].map(c => (
                <button key={c.email} onClick={() => setForm({ email:c.email, password:'password123' })}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-xs text-white/60 hover:text-white/90 flex justify-between">
                  <span className="font-medium">{c.label}</span>
                  <span className="opacity-60">{c.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © 2025 StagiTrack · Gestion des stagiaires
        </p>
      </motion.div>
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />
    </div>
    </>
  );
}