import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useStagiaires } from '../hooks/useStagiaires';
import { useAuth } from '../hooks/useAuth';
import { StagiaireTable } from '../components/stagiaires/StagiaireTable';
import { StagiaireForm } from '../components/stagiaires/StagiaireForm';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Loader } from '../components/ui/Loader';
import { Pagination } from '../components/ui/Pagination';
import { MdAdd, MdSearch, MdFilterList, MdDownload } from 'react-icons/md';
import { stagiaireApi } from '../api/stagiaireApi';
import { toast } from 'react-toastify';

export default function Stagiaires() {
  const { stagiaires, loading, pagination, fetchStagiaires, createStagiaire, updateStagiaire, deleteStagiaire } = useStagiaires();
  const { getAllowedStageTypes } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ search:'', type_stage:'', statut:'', page:1, limit:10 });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const allowed = getAllowedStageTypes();

  useEffect(() => { fetchStagiaires(filters); }, [filters.page, filters.type_stage, filters.statut]);

  // Debounce automatique sur la recherche texte
  const debounceRef = useRef(null);
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setFilters(f => ({ ...f, search: value, page: 1 }));
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchStagiaires({ ...filters, search: value, page: 1 });
    }, 350);
  }, [filters]);

  const handleSubmit = async (data) => {
    setSaving(true);
    const ok = editing
      ? await updateStagiaire(editing.id, data)
      : await createStagiaire(data);
    if (ok) { setShowForm(false); setEditing(null); fetchStagiaires(filters); }
    setSaving(false);
  };

  const [viewingStagiaire, setViewingStagiaire] = useState(null);
  const handleView = (s) => { setViewingStagiaire(s); };
  const handleEdit = (s) => { setEditing(s); setShowForm(true); };
  const handleDelete = (id) => { setDeleteConfirm(id); };
  const confirmDelete = async () => {
    if (deleteConfirm) { await deleteStagiaire(deleteConfirm); setDeleteConfirm(null); }
  };

  const handleExport = async () => {
    try {
      const blob = await stagiaireApi.exportExcel(filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='stagiaires.xlsx'; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Export échoué'); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Stagiaires</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {pagination.total} stagiaire{pagination.total !== 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition border rounded-xl border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            <MdDownload /> Export Excel
          </button>
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold text-sm shadow-neon hover:opacity-90 transition">
            <MdAdd className="text-lg" /> Nouveau stagiaire
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="p-4 border bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border-slate-200/60 dark:border-slate-700/60 shadow-card">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <MdSearch className="absolute text-lg -translate-y-1/2 left-3 top-1/2 text-slate-400" />
            <input type="text" placeholder="Nom, prénom, email, entreprise…"
              value={filters.search}
              onChange={handleSearchChange}
              className="glass-input pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <MdFilterList className="text-slate-400" />
              <select value={filters.type_stage} onChange={e => setFilters(f => ({...f, type_stage: e.target.value, page:1}))}
                className="w-auto px-3 py-2 text-sm glass-input">
                <option value="">Tous les types</option>
                {allowed.map(t => (
                  <option key={t} value={t}>
                    {t === 'ecole' ? 'Stage école' : t === 'validation' ? 'Validation' : 'Qualification'}
                  </option>
                ))}
              </select>
            </div>
            <select value={filters.statut} onChange={e => setFilters(f => ({...f, statut: e.target.value, page:1}))}
              className="w-auto px-3 py-2 text-sm glass-input">
              <option value="">Tous statuts</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
              <option value="abandonne">Abandonné</option>
              <option value="valide">Validé</option>
            </select>
          </div>
        </div>
        {/* Active filters */}
        {(filters.type_stage || filters.statut) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.type_stage && <Badge type={filters.type_stage} />}
            {filters.statut && <Badge type={filters.statut} />}
            <button onClick={() => setFilters(f => ({...f, type_stage:'', statut:'', page:1}))}
              className="text-xs transition text-slate-400 hover:text-red-500">× Effacer</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden border bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border-slate-200/60 dark:border-slate-700/60 shadow-card">
        {loading ? <Loader /> : (
          <>
            <StagiaireTable stagiaires={stagiaires} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
            <div className="px-4 pb-4">
              <Pagination page={filters.page} total={pagination.total} limit={filters.limit}
                onChange={p => setFilters(f => ({...f, page:p}))} />
            </div>
          </>
        )}
      </div>

      {/* Form Modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? 'Modifier le stagiaire' : 'Nouveau stagiaire'} size="lg">
        <StagiaireForm initial={editing} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditing(null); }} loading={saving} />
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!viewingStagiaire} onClose={() => setViewingStagiaire(null)}
        title="Fiche stagiaire" size="lg">
        {viewingStagiaire && (() => {
          const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';
          const fmtDt = (d) => d ? new Date(d).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';
          return (
            <div className="space-y-5">

              {/* Avatar + identité + badges */}
              <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 text-2xl font-bold text-white rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 shadow-neon">
                  {viewingStagiaire.prenom?.[0]}{viewingStagiaire.nom?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-bold text-slate-800 dark:text-white">
                    {viewingStagiaire.prenom} {viewingStagiaire.nom}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{viewingStagiaire.email || '—'}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{viewingStagiaire.telephone || '—'}</p>
                </div>
                <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
                  <Badge type={viewingStagiaire.statut} />
                  <Badge type={viewingStagiaire.type_stage} />
                </div>
              </div>

              {/* Section : Informations personnelles */}
              <div>
                <p className="mb-3 text-xs font-bold tracking-widest uppercase text-slate-400">Informations personnelles</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Date de naissance', value: fmt(viewingStagiaire.date_naissance) },
                    { label: 'Téléphone',          value: viewingStagiaire.telephone || '—' },
                    { label: 'Email',              value: viewingStagiaire.email || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                      <p className="mb-1 text-xs font-semibold tracking-wide uppercase text-slate-400">{label}</p>
                      <p className="text-sm font-medium truncate text-slate-700 dark:text-slate-200">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section : Informations du stage */}
              <div>
                <p className="mb-3 text-xs font-bold tracking-widest uppercase text-slate-400">Stage</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Entreprise',    value: viewingStagiaire.entreprise || '—' },
                    { label: 'Tuteur',        value: viewingStagiaire.tuteur || '—' },
                    { label: 'Date de début', value: fmt(viewingStagiaire.date_debut) },
                    { label: 'Date de fin',   value: fmt(viewingStagiaire.date_fin) },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                      <p className="mb-1 text-xs font-semibold tracking-wide uppercase text-slate-400">{label}</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section : Observations */}
              {viewingStagiaire.observations && (
                <div>
                  <p className="mb-3 text-xs font-bold tracking-widest uppercase text-slate-400">Observations</p>
                  <div className="p-4 border bg-amber-50 dark:bg-amber-900/10 border-amber-200/60 dark:border-amber-800/30 rounded-xl">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                      {viewingStagiaire.observations}
                    </p>
                  </div>
                </div>
              )}

              {/* Section : Métadonnées */}
              <div className="flex gap-4 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400">
                  <span className="font-semibold">Créé le :</span> {fmtDt(viewingStagiaire.created_at)}
                </p>
                {viewingStagiaire.updated_at && (
                  <p className="text-xs text-slate-400">
                    <span className="font-semibold">Modifié le :</span> {fmtDt(viewingStagiaire.updated_at)}
                  </p>
                )}
              </div>

              {/* Boutons action */}
              <div className="flex gap-3 pt-1">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setViewingStagiaire(null); handleEdit(viewingStagiaire); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold text-sm shadow-neon hover:opacity-90 transition">
                  ✏️ Modifier
                </motion.button>
                <button onClick={() => setViewingStagiaire(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-medium">
                  Fermer
                </button>
              </div>

            </div>
          );
        })()}
      </Modal>


      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmer la suppression" size="sm">
        <p className="mb-6 text-slate-600 dark:text-slate-300">Êtes-vous sûr de vouloir supprimer ce stagiaire ? Cette action est irréversible.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition text-sm font-medium">
            Annuler
          </button>
          <button onClick={confirmDelete}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition">
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  );
}