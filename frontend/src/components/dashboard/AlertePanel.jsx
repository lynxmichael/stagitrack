import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { MdWarning, MdAccessTime, MdCheck, MdPerson } from 'react-icons/md';
import { formatDate } from '../../utils/formatDate';

const typeIcons = { fin_stage: MdAccessTime, absence: MdWarning, document: MdPerson };
const typeColors = {
  fin_stage: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
  absence:   'text-red-500 bg-red-50 dark:bg-red-900/20',
  document:  'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
};

export const AlertePanel = ({ alertes = [], onResolve }) => (
  <div className="space-y-3">
    {alertes.length === 0 ? (
      <div className="text-center py-8 text-slate-400 text-sm">
        <MdCheck className="text-3xl mx-auto mb-2 text-emerald-400" />
        Aucune alerte active
      </div>
    ) : (
      <AnimatePresence>
        {alertes.slice(0,6).map((alerte, i) => {
          const Icon = typeIcons[alerte.type] || MdWarning;
          return (
            <motion.div
              key={alerte.id}
              initial={{ opacity:0, x:-10 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:10 }}
              transition={{ delay:i*0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40 hover:border-primary-200 dark:hover:border-primary-700 transition-colors group"
            >
              <div className={`p-2 rounded-lg flex-shrink-0 ${typeColors[alerte.type] || 'text-slate-400 bg-slate-100'}`}>
                <Icon className="text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {alerte.stagiaire_nom || alerte.message}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {alerte.description || alerte.type}
                </p>
                {alerte.date_fin && (
                  <p className="text-xs text-amber-600 mt-1">Fin: {formatDate(alerte.date_fin)}</p>
                )}
              </div>
              <button
                onClick={() => onResolve?.(alerte.id)}
                className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 transition-all text-xs flex-shrink-0"
              >
                <MdCheck />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    )}
  </div>
);
