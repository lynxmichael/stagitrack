export const getAlerteColor = (type) => ({
  fin_stage: 'amber',
  absence:   'red',
  document:  'blue',
  autre:     'slate',
}[type] || 'slate');

export const isUrgent = (alerte) => {
  if (alerte.type !== 'fin_stage') return false;
  if (!alerte.date_fin) return false;
  const days = Math.ceil((new Date(alerte.date_fin) - new Date()) / (1000*60*60*24));
  return days <= 3 && days >= 0;
};
