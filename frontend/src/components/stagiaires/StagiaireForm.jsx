import { useState, useEffect } from 'react';
import { MdSave, MdClose } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';

const FIELDS = [
  { name:'nom',             label:'Nom',                type:'text',   required:true },
  { name:'prenom',          label:'Prénom',             type:'text',   required:true },
  { name:'email',           label:'Email',              type:'email',  required:true },
  { name:'telephone',       label:'Téléphone',          type:'tel' },
  { name:'date_naissance',  label:'Date de naissance',  type:'date' },
  { name:'date_debut',      label:'Date de début',      type:'date',   required:true },
  { name:'date_fin',        label:'Date de fin',        type:'date',   required:true },
  { name:'entreprise',      label:'Entreprise / École', type:'text' },
  { name:'tuteur',          label:'Tuteur',             type:'text' },
  { name:'observations',    label:'Observations',       type:'textarea' },
];

const typeOptions = {
  ecole_validation: [
    { value:'ecole',      label:'Stage école' },
    { value:'validation', label:'Stage de validation' },
  ],
  qualification: [
    { value:'qualification', label:'Stage de qualification' },
  ],
  les_deux: [
    { value:'ecole',         label:'Stage école' },
    { value:'validation',    label:'Stage de validation' },
    { value:'qualification', label:'Stage de qualification' },
  ],
};

const statusOptions = [
  { value:'en_cours',  label:'En cours' },
  { value:'termine',   label:'Terminé' },
  { value:'abandonne', label:'Abandonné' },
  { value:'valide',    label:'Validé' },
];

export const StagiaireForm = ({ initial = {}, onSubmit, onCancel, loading }) => {
  const { user } = useAuth();
  const types = typeOptions[user?.type_conseiller] || typeOptions.les_deux;
  const [form, setForm] = useState({
    nom:'', prenom:'', email:'', telephone:'', date_naissance:'',
    date_debut:'', date_fin:'', entreprise:'', tuteur:'', observations:'',
    type_stage: types[0]?.value || 'ecole',
    statut: 'en_cours',
    ...initial,
  });

  useEffect(() => { if (initial?.id) setForm(f => ({ ...f, ...initial })); }, [initial?.id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type + Statut */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Type de stage *</label>
          <select value={form.type_stage} onChange={e => set('type_stage', e.target.value)}
            className="glass-input">
            {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Statut</label>
          <select value={form.statut} onChange={e => set('statut', e.target.value)}
            className="glass-input">
            {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Dynamic fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map(f => (
          <div key={f.name} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              {f.label}{f.required && ' *'}
            </label>
            {f.type === 'textarea' ? (
              <textarea rows={3} value={form[f.name] || ''} onChange={e => set(f.name, e.target.value)}
                className="glass-input resize-none" />
            ) : (
              <input type={f.type} required={f.required} value={form[f.name] || ''}
                onChange={e => set(f.name, e.target.value)}
                className="glass-input" />
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-medium">
          <MdClose /> Annuler
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-60">
          {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                   : <MdSave />}
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};
