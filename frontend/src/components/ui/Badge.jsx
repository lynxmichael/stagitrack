const configs = {
  admin:             { label:'Admin',           cls:'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  ecole_validation:  { label:'École & Val.',     cls:'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  qualification:     { label:'Qualification',    cls:'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  les_deux:          { label:'Tous stages',      cls:'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' },
  en_cours:          { label:'En cours',         cls:'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  termine:           { label:'Terminé',          cls:'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  abandonne:         { label:'Abandonné',        cls:'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300' },
  valide:            { label:'Validé',           cls:'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  ecole:             { label:'Stage école',      cls:'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
  validation:        { label:'Validation',       cls:'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
  actif:             { label:'Actif',            cls:'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  inactif:           { label:'Inactif',          cls:'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
};

export const Badge = ({ type, label: override }) => {
  const c = configs[type] || { label: type || '—', cls:'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.cls}`}>
      {override || c.label}
    </span>
  );
};
