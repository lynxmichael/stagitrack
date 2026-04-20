const { pool } = require('../config/db');

const User = {
  findAll: async () => {
    const [rows] = await pool.query(
      'SELECT id, nom, prenom, email, role, type_conseiller, actif, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id, nom, prenom, email, role, type_conseiller, actif, created_at FROM users WHERE id = ?', [id]
    );
    return rows[0];
  },

  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  create: async ({ nom, prenom, email, password_hash, role = 'conseiller', type_conseiller = 'les_deux', actif = true }) => {
    const [result] = await pool.query(
      'INSERT INTO users (nom, prenom, email, password_hash, role, type_conseiller, actif) VALUES (?,?,?,?,?,?,?)',
      [nom, prenom, email, password_hash, role, type_conseiller, actif]
    );
    return result.insertId;
  },

  update: async (id, fields) => {
    const allowed = ['nom','prenom','email','password_hash','role','type_conseiller','actif'];
    const sets = Object.keys(fields).filter(k => allowed.includes(k) && fields[k] !== undefined);
    if (!sets.length) return false;
    const sql = `UPDATE users SET ${sets.map(k => `${k}=?`).join(',')} WHERE id=?`;
    await pool.query(sql, [...sets.map(k => fields[k]), id]);
    return true;
  },

  delete: async (id) => {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  },

  count: async () => {
    const [[r]] = await pool.query('SELECT COUNT(*) as n FROM users');
    return r.n;
  },
};

module.exports = User;
