const { pool } = require('../config/db');

const Stagiaire = {
  findAll: async ({ search='', type_stage='', statut='', allowedTypes=[], page=1, limit=10 }) => {
    let where = ['1=1'];
    const params = [];

    if (allowedTypes.length) {
      where.push(`type_stage IN (${allowedTypes.map(()=>'?').join(',')})`);
      params.push(...allowedTypes);
    }
    if (search) {
      where.push('(nom LIKE ? OR prenom LIKE ? OR email LIKE ? OR entreprise LIKE ?)');
      const s = `%${search}%`;
      params.push(s,s,s,s);
    }
    if (type_stage && (!allowedTypes.length || allowedTypes.includes(type_stage))) {
      where.push('type_stage = ?');
      params.push(type_stage);
    }
    if (statut) { where.push('statut = ?'); params.push(statut); }

    const whereStr = where.join(' AND ');
    const offset = (parseInt(page)-1) * parseInt(limit);

    const [[{total}]] = await pool.query(`SELECT COUNT(*) as total FROM stagiaires WHERE ${whereStr}`, params);
    const [rows] = await pool.query(
      `SELECT * FROM stagiaires WHERE ${whereStr} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    return { stagiaires: rows, total, page: parseInt(page), limit: parseInt(limit) };
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM stagiaires WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const fields = ['nom','prenom','email','telephone','date_naissance','date_debut','date_fin','entreprise','tuteur','type_stage','statut','observations','conseiller_id'];
    const cols = fields.filter(f => data[f] !== undefined);
    const vals = cols.map(c => data[c]);
    const [r] = await pool.query(
      `INSERT INTO stagiaires (${cols.join(',')}) VALUES (${cols.map(()=>'?').join(',')})`, vals
    );
    return r.insertId;
  },

  update: async (id, data) => {
    const allowed = ['nom','prenom','email','telephone','date_naissance','date_debut','date_fin','entreprise','tuteur','type_stage','statut','observations'];
    const cols = Object.keys(data).filter(k => allowed.includes(k) && data[k] !== undefined);
    if (!cols.length) return false;
    await pool.query(
      `UPDATE stagiaires SET ${cols.map(c=>`${c}=?`).join(',')}, updated_at=NOW() WHERE id=?`,
      [...cols.map(c=>data[c]), id]
    );
    return true;
  },

  delete: async (id) => {
    await pool.query('DELETE FROM stagiaires WHERE id = ?', [id]);
  },

  // Stagiaires dont le stage finit bientôt (pour les alertes)
  findExpiringSoon: async (days=7) => {
    const [rows] = await pool.query(
      `SELECT * FROM stagiaires WHERE statut='en_cours' AND date_fin BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)`,
      [days]
    );
    return rows;
  },

  countByType: async (allowedTypes=[]) => {
    if (!allowedTypes.length) return [];
    const [rows] = await pool.query(
      `SELECT type_stage, COUNT(*) as count FROM stagiaires WHERE type_stage IN (${allowedTypes.map(()=>'?').join(',')}) GROUP BY type_stage`,
      allowedTypes
    );
    return rows;
  },

  countByStatus: async (allowedTypes=[]) => {
    let where = allowedTypes.length ? `WHERE type_stage IN (${allowedTypes.map(()=>'?').join(',')})` : '';
    const [rows] = await pool.query(
      `SELECT statut, COUNT(*) as count FROM stagiaires ${where} GROUP BY statut`,
      allowedTypes
    );
    return rows;
  },
};

module.exports = Stagiaire;