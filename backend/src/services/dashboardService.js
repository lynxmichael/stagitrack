const Stagiaire = require('../models/Stagiaire');
const Alerte = require('../models/Alerte');
const User = require('../models/User');
const { pool } = require('../config/db');

module.exports = {
  getStats: async (allowedTypes) => {
    const byStatus = await Stagiaire.countByStatus(allowedTypes);
    const byType   = await Stagiaire.countByType(allowedTypes);
    const alertesActives = await Alerte.countActive(allowedTypes);

    const statusMap = byStatus.reduce((a, r) => { a[r.statut] = r.count; return a; }, {});
    const typeMap   = byType.reduce((a, r) => { a[r.type_stage] = r.count; return a; }, {});
    const total = byStatus.reduce((s, r) => s + r.count, 0);

    return {
      total,
      en_cours:        statusMap.en_cours  || 0,
      termines:        statusMap.termine   || 0,
      valides:         statusMap.valide    || 0,
      abandonnes:      statusMap.abandonne || 0,
      alertes_actives: alertesActives,
      par_type:        typeMap,
      ...typeMap,
    };
  },

  getAlertes: async (allowedTypes) => {
    return Alerte.findAll({ allowedTypes, resolved: false });
  },

  getActivities: async (allowedTypes) => {
    const [rows] = await pool.query(
      `SELECT 'stagiaire' as type, CONCAT(prenom,' ',nom) as label, statut, created_at
       FROM stagiaires
       WHERE type_stage IN (${allowedTypes.map(()=>'?').join(',')})
       ORDER BY created_at DESC LIMIT 10`,
      allowedTypes.length ? allowedTypes : ['ecole','validation','qualification']
    );
    return rows;
  },
};
