import { motion } from 'framer-motion';

export const StatCard = ({ label, value, icon: Icon, color = 'blue', trend, index = 0 }) => {
  const colors = {
    blue:   { bg:'from-blue-500 to-blue-600',   light:'bg-blue-50 dark:bg-blue-900/20',   icon:'text-blue-600 dark:text-blue-400',   border:'border-blue-200/60 dark:border-blue-800/40' },
    violet: { bg:'from-violet-500 to-violet-600', light:'bg-violet-50 dark:bg-violet-900/20', icon:'text-violet-600 dark:text-violet-400', border:'border-violet-200/60 dark:border-violet-800/40' },
    emerald:{ bg:'from-emerald-500 to-emerald-600', light:'bg-emerald-50 dark:bg-emerald-900/20', icon:'text-emerald-600 dark:text-emerald-400', border:'border-emerald-200/60 dark:border-emerald-800/40' },
    amber:  { bg:'from-amber-500 to-amber-600',  light:'bg-amber-50 dark:bg-amber-900/20',  icon:'text-amber-600 dark:text-amber-400',  border:'border-amber-200/60 dark:border-amber-800/40' },
  };
  const c = colors[color] || colors.blue;

  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y:-3, transition:{ duration:0.2 } }}
      className={`relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-5 border ${c.border} shadow-card overflow-hidden group`}
    >
      {/* Background gradient blob */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${c.bg} opacity-10 group-hover:opacity-20 transition-opacity`} />

      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value ?? '—'}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% ce mois
            </p>
          )}
        </div>
        <div className={`${c.light} ${c.icon} p-3 rounded-xl`}>
          <Icon className="text-2xl" />
        </div>
      </div>
    </motion.div>
  );
};
