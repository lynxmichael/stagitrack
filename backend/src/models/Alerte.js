const { pool } = require('../config/db');

const Alerte = {
  findAll: async ({ allowedTypes=[], type='', resolved=false } = {}) => {
    let where = ['a.resolved = ?'];
    const params = [resolved ? 1 : 0];

    if (allowedTypes.length) {
      where.push(`s.type_stage IN (${allowedTypes.map(()=>'?').join(',')})`);
      params.push(...allowedTypes);
    }
    if (type) { where.push('a.type = ?'); params.push(type); }

    const [rows] = await pool.query(
      `SELECT a.*, CONCAT(s.prenom, ' ', s.nom) as stagiaire_nom, s.type_stage, s.date_fin
       FROM alertes a
       LEFT JOIN stagiaires s ON a.stagiaire_id = s.id
       WHERE ${where.join(' AND ')}
       ORDER BY a.created_at DESC`,
      params
    );
    return rows;
  },

  create: async ({ stagiaire_id, type, titre, description }) => {
    const [r] = await pool.query(
      'INSERT INTO alertes (stagiaire_id, type, titre, description) VALUES (?,?,?,?)',
      [stagiaire_id, type, titre, description]
    );
    return r.insertId;
  },

  markResolved: async (id) => {
    await pool.query('UPDATE alertes SET resolved=1, resolved=NOW() WHERE id=?', [id]);
  },

  delete: async (id) => {
    await pool.query('DELETE FROM alertes WHERE id=?', [id]);
  },

  existsForStagiaire: async (stagiaire_id, type) => {
    const [[r]] = await pool.query(
      'SELECT COUNT(*) as n FROM alertes WHERE stagiaire_id=? AND type=? AND resolved=0', [stagiaire_id, type]
    );
    return r.n > 0;
  },

  countActive: async (allowedTypes=[]) => {
    let join = '', where = 'a.resolved=0';
    const params = [];
    if (allowedTypes.length) {
      join = 'LEFT JOIN stagiaires s ON a.stagiaire_id = s.id';
      where += ` AND s.type_stage IN (${allowedTypes.map(()=>'?').join(',')})`;
      params.push(...allowedTypes);
    }
    const [[r]] = await pool.query(`SELECT COUNT(*) as n FROM alertes a ${join} WHERE ${where}`, params);
    return r.n;
  },
};

module.exports = Alerte;
