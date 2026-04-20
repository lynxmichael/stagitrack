import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { formatDate, daysLeft } from '../../utils/formatDate';
import { MdEdit, MdDelete, MdVisibility, MdAccessTime } from 'react-icons/md';

export const StagiaireTable = ({ stagiaires = [], onEdit, onDelete, onView }) => {
  if (!stagiaires.length) return (
    <div className="text-center py-16 text-slate-400">
      <MdVisibility className="text-4xl mx-auto mb-3 opacity-40" />
      <p className="font-medium">Aucun stagiaire trouvé</p>
      <p className="text-sm mt-1">Ajustez vos filtres ou créez un nouveau stagiaire</p>
    </div>
  );

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200/60 dark:border-slate-700/60">
            {['Stagiaire','Type','Entreprise','Période','Statut','Fin dans','Actions'].map(h => (
              <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {stagiaires.map((s, i) => {
            const jours = daysLeft(s.date_fin);
            const isUrgent = jours !== null && jours <= 7 && jours >= 0;
            return (
              <motion.tr key={s.id}
                initial={{ opacity:0, y:5 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:i*0.04 }}
                className="group hover:bg-primary-50/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {/* Nom */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {s.prenom?.[0]}{s.nom?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">{s.prenom} {s.nom}</p>
                      <p className="text-xs text-slate-400 truncate max-w-32">{s.email}</p>
                    </div>
                  </div>
                </td>
                {/* Type */}
                <td className="py-3.5 px-4"><Badge type={s.type_stage} /></td>
                {/* Entreprise */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-32 truncate">{s.entreprise || '—'}</td>
                {/* Période */}
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  <span>{formatDate(s.date_debut)}</span>
                  <span className="text-slate-300 dark:text-slate-600 mx-1">→</span>
                  <span>{formatDate(s.date_fin)}</span>
                </td>
                {/* Statut */}
                <td className="py-3.5 px-4"><Badge type={s.statut} /></td>
                {/* Jours restants */}
                <td className="py-3.5 px-4">
                  {s.statut === 'en_cours' && jours !== null ? (
                    <span className={`flex items-center gap-1 text-xs font-semibold ${
                      isUrgent ? 'text-red-500' : jours <= 30 ? 'text-amber-500' : 'text-slate-400'
                    }`}>
                      <MdAccessTime className={isUrgent ? 'animate-pulse' : ''} />
                      {jours > 0 ? `${jours}j` : jours === 0 ? "Auj." : 'Dépassé'}
                    </span>
                  ) : <span className="text-slate-300 dark:text-slate-600">—</span>}
                </td>
                {/* Actions */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onView?.(s)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-slate-500 hover:text-primary-600 flex items-center justify-center transition">
                      <MdVisibility className="text-base" />
                    </button>
                    <button onClick={() => onEdit?.(s)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-slate-500 hover:text-amber-600 flex items-center justify-center transition">
                      <MdEdit className="text-base" />
                    </button>
                    <button onClick={() => onDelete?.(s.id)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-500 flex items-center justify-center transition">
                      <MdDelete className="text-base" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
