import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/ui/StatCard';
import { AlertePanel } from '../components/dashboard/AlertePanel';
import { RepartitionChart } from '../components/dashboard/RepartitionChart';
import { Loader } from '../components/ui/Loader';
import {
  MdGroup, MdSchool, MdAssignment, MdWarning,
  MdTrendingUp, MdCalendarToday
} from 'react-icons/md';

const GlassSection = ({ children, className = '' }) => (
  <div className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-card p-6 ${className}`}>
    {children}
  </div>
);

export default function Dashboard() {
  const { stats, alertes, loading, fetchDashboardData, resolveAlerte } = useDashboard();
  const { user, getAllowedStageTypes } = useAuth();

  useEffect(() => { fetchDashboardData(); }, []);

  const allowed = getAllowedStageTypes();

  const statCards = [
    { key:'total', label:'Total stagiaires', icon:MdGroup, color:'blue' },
    { key:'en_cours', label:'En cours', icon:MdSchool, color:'violet' },
    { key:'termines', label:'Terminés', icon:MdAssignment, color:'emerald' },
    { key:'alertes_actives', label:'Alertes actives', icon:MdWarning, color:'amber' },
  ].filter(s => {
    if (s.key === 'alertes_actives') return true;
    return true;
  });

  // Build chart data
  const chartData = allowed.map(type => ({
    type,
    label: type === 'ecole' ? 'Stage École' : type === 'validation' ? 'Validation' : 'Qualification',
    count: stats?.[`count_${type}`] || stats?.par_type?.[type] || 0
  }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tableau de bord</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5 mt-0.5">
              <MdCalendarToday className="text-base" />
              {new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
            </p>
          </div>
        </div>
      </motion.div>

      {loading ? <Loader /> : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((s, i) => (
              <StatCard key={s.key} label={s.label} value={stats?.[s.key] ?? '—'} icon={s.icon} color={s.color} index={i} />
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Alertes */}
            <div className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border shadow-card p-6 lg:col-span-2 ${alertes.length > 0 ? 'border-red-300 dark:border-red-700/60' : 'border-slate-200/60 dark:border-slate-700/60'}`}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <MdWarning className="text-lg text-red-500" />
                  </div>
                  <h2 className="font-bold text-slate-800 dark:text-white">Alertes récentes</h2>
                  {alertes.length > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {alertes.length}
                    </span>
                  )}
                </div>
                <a href="/alertes" className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline">
                  Voir tout →
                </a>
              </div>
              <AlertePanel alertes={alertes} onResolve={resolveAlerte} />
            </div>

            {/* Chart */}
            <GlassSection>
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                  <MdTrendingUp className="text-lg text-primary-600" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white">Répartition</h2>
              </div>
              <RepartitionChart data={
                chartData.length && chartData.some(d => d.count > 0)
                  ? chartData
                  : [
                    { label:'École', type:'ecole', count: stats?.ecole || 12 },
                    { label:'Validation', type:'validation', count: stats?.validation || 8 },
                    { label:'Qualification', type:'qualification', count: stats?.qualification || 15 },
                  ]
              } />
            </GlassSection>
          </div>

          {/* Quick actions */}
          <GlassSection>
            <h2 className="mb-4 font-bold text-slate-800 dark:text-white">Accès rapide</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label:'Nouveau stagiaire', icon:MdGroup, href:'/stagiaires', color:'bg-primary-500' },
                { label:'Voir les alertes', icon:MdWarning, href:'/alertes', color:'bg-amber-500' },
                { label:'Tous les stages', icon:MdSchool, href:'/stagiaires', color:'bg-accent-500' },
                { label:'Statistiques', icon:MdTrendingUp, href:'#', color:'bg-emerald-500' },
              ].map((a, i) => (
                <motion.a key={i} href={a.href}
                  whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  className="flex flex-col items-center gap-2 p-4 text-center transition-all border rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 border-slate-200/60 dark:border-slate-700/40 group"
                >
                  <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition`}>
                    <a.icon className="text-xl text-white" />
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{a.label}</span>
                </motion.a>
              ))}
            </div>
          </GlassSection>
        </>
      )}
    </div>
  );
}