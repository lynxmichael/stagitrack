import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { alerteApi } from '../api/alerteApi';
import { Loader } from '../components/ui/Loader';
import { formatDate } from '../utils/formatDate';
import { toast } from 'react-toastify';
import {
  MdWarning, MdAccessTime, MdPerson, MdCheck, MdDelete,
  MdFilterList, MdRefresh
} from 'react-icons/md';

const TYPE_CONFIG = {
  fin_stage:  { icon: MdAccessTime, label:'Fin de stage',  color:'amber',  bg:'bg-amber-50 dark:bg-amber-900/20',   text:'text-amber-600', border:'border-amber-200 dark:border-amber-800/40' },
  absence:    { icon: MdWarning,    label:'Absence',       color:'red',    bg:'bg-red-50 dark:bg-red-900/20',       text:'text-red-500',   border:'border-red-200 dark:border-red-800/40' },
  document:   { icon: MdPerson,     label:'Document',      color:'blue',   bg:'bg-blue-50 dark:bg-blue-900/20',     text:'text-blue-600',  border:'border-blue-200 dark:border-blue-800/40' },
};
const DEFAULT_TYPE = { icon: MdWarning, label:'Alerte', color:'slate', bg:'bg-slate-50 dark:bg-slate-800', text:'text-slate-500', border:'border-slate-200 dark:border-slate-700' };

export default function Alertes() {
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await alerteApi.getAll();
      setAlertes(Array.isArray(data) ? data : data.alertes || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleResolve = async (id) => {
    await alerteApi.markAsResolved(id);
    setAlertes(a => a.filter(x => x.id !== id));
    toast.success('Alerte résolue');
  };

  const handleDelete = async (id) => {
    await alerteApi.deleteAlerte(id);
    setAlertes(a => a.filter(x => x.id !== id));
    toast.success('Alerte supprimée');
  };

  const types = ['all', ...new Set(alertes.map(a => a.type).filter(Boolean))];
  const filtered = filter === 'all' ? alertes : alertes.filter(a => a.type === filter);

  const counts = alertes.reduce((acc, a) => { acc[a.type] = (acc[a.type]||0)+1; return acc; }, {});

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            Alertes
            {alertes.length > 0 && (
              <span className="text-base bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold">
                {alertes.length}
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Notifications et alertes de suivi</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-medium">
          <MdRefresh className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </motion.div>

      {/* Stats mini */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
          <motion.div key={type} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
            className={`rounded-xl p-4 border ${cfg.bg} ${cfg.border} cursor-pointer hover:shadow-card transition`}
            onClick={() => setFilter(type)}>
            <div className="flex items-center gap-2 mb-1">
              <cfg.icon className={`text-xl ${cfg.text}`} />
              <span className={`text-xl font-bold ${cfg.text}`}>{counts[type] || 0}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{cfg.label}</p>
          </motion.div>
        ))}
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
          className="rounded-xl p-4 border bg-white/70 dark:bg-slate-800/70 border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:shadow-card transition"
          onClick={() => setFilter('all')}>
          <div className="flex items-center gap-2 mb-1">
            <MdWarning className="text-xl text-slate-500" />
            <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{alertes.length}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
        </motion.div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === t
                ? 'bg-primary-600 text-white shadow-neon'
                : 'bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:border-primary-300'
            }`}>
            {t === 'all' ? 'Toutes' : TYPE_CONFIG[t]?.label || t}
            <span className="ml-1.5 text-xs opacity-70">{t === 'all' ? alertes.length : counts[t] || 0}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-card overflow-hidden">
        {loading ? <Loader /> : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <MdCheck className="text-4xl mx-auto mb-3 text-emerald-400" />
            <p className="font-medium">Aucune alerte active</p>
            <p className="text-sm">Tout est sous contrôle 🎉</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence>
              {filtered.map((alerte, i) => {
                const cfg = TYPE_CONFIG[alerte.type] || DEFAULT_TYPE;
                return (
                  <motion.div key={alerte.id}
                    initial={{opacity:0, x:-10}}
                    animate={{opacity:1, x:0}}
                    exit={{opacity:0, height:0, marginBlock:0}}
                    transition={{delay:i*0.03}}
                    className="flex items-center gap-4 p-4 hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <cfg.icon className={`text-xl ${cfg.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">
                        {alerte.stagiaire_nom || alerte.titre || 'Alerte'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{alerte.description || alerte.message}</p>
                      {alerte.date_fin && (
                        <p className={`text-xs mt-1 font-medium ${cfg.text}`}>
                          Échéance : {formatDate(alerte.date_fin)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleResolve(alerte.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 transition text-xs font-semibold">
                        <MdCheck /> Résoudre
                      </button>
                      <button onClick={() => handleDelete(alerte.id)}
                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition">
                        <MdDelete className="text-base" />
                      </button>
                    </div>
                    {alerte.created_at && (
                      <span className="text-xs text-slate-300 dark:text-slate-600 flex-shrink-0 hidden sm:block">
                        {formatDate(alerte.created_at)}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
