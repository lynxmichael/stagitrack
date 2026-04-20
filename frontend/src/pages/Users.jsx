import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUsers } from '../hooks/useUsers';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Loader } from '../components/ui/Loader';
import { MdAdd, MdEdit, MdDelete, MdPerson, MdAdminPanelSettings, MdEmail } from 'react-icons/md';

const EMPTY = { nom:'', prenom:'', email:'', password:'', role:'conseiller', type_conseiller:'les_deux', actif:true };

export default function Users() {
  const { users, loading, fetchUsers, createUser, updateUser, deleteUser } = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [delConfirm, setDelConfirm] = useState(null);

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { setForm(editing ? {...editing, password:''} : EMPTY); }, [editing]);

  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = editing ? form : form;
    const ok = editing ? await updateUser(editing.id, payload) : await createUser(payload);
    if (ok) { setShowForm(false); setEditing(null); }
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Conseillers</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{users.length} compte{users.length !== 1 ? 's' : ''}</p>
        </div>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold text-sm shadow-neon hover:opacity-90 transition">
          <MdAdd className="text-lg" /> Nouveau conseiller
        </motion.button>
      </motion.div>

      {/* Cards */}
      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {users.map((u, i) => (
            <motion.div key={u.id}
              initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              whileHover={{y:-3}}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-card p-5 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                    {u.prenom?.[0]}{u.nom?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{u.prenom} {u.nom}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MdEmail className="text-base" />{u.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(u); setShowForm(true); }}
                    className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition">
                    <MdEdit />
                  </button>
                  <button onClick={() => setDelConfirm(u.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition">
                    <MdDelete />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge type={u.role === 'admin' ? 'admin' : u.type_conseiller} />
                <Badge type={u.actif ? 'actif' : 'inactif'} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? 'Modifier le conseiller' : 'Nouveau conseiller'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[['prenom','Prénom','text'],['nom','Nom','text']].map(([k,l,t]) => (
              <div key={k}>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">{l} *</label>
                <input type={t} required value={form[k]||''} onChange={e => set(k,e.target.value)} className="glass-input" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Email *</label>
            <input type="email" required value={form.email||''} onChange={e => set('email',e.target.value)} className="glass-input" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Mot de passe{editing ? ' (laisser vide = inchangé)' : ' *'}
            </label>
            <input type="password" required={!editing} value={form.password||''} onChange={e => set('password',e.target.value)} className="glass-input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Rôle</label>
              <select value={form.role||'conseiller'} onChange={e => set('role',e.target.value)} className="glass-input">
                <option value="conseiller">Conseiller</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Type de stage</label>
              <select value={form.type_conseiller||'les_deux'} onChange={e => set('type_conseiller',e.target.value)} className="glass-input">
                <option value="ecole_validation">École & Validation</option>
                <option value="qualification">Qualification</option>
                <option value="les_deux">Tous les stages</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-11 h-6 rounded-full transition-colors relative ${form.actif ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`}
              onClick={() => set('actif', !form.actif)}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.actif ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Compte actif</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition text-sm font-medium">Annuler</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-60">
              {saving ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer le compte'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Supprimer le conseiller" size="sm">
        <p className="text-slate-600 dark:text-slate-300 mb-6">Cette action est irréversible.</p>
        <div className="flex gap-3">
          <button onClick={() => setDelConfirm(null)}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Annuler</button>
          <button onClick={async () => { await deleteUser(delConfirm); setDelConfirm(null); }}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition">Supprimer</button>
        </div>
      </Modal>
    </div>
  );
}
