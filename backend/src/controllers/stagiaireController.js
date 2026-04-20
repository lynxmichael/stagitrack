const stagiaireService = require('../services/stagiaireService');
const path = require('path');
const fs   = require('fs');

exports.getAll = async (req, res, next) => {
  try {
    const result = await stagiaireService.getAll(req.query, req.allowedTypes);
    res.json(result);
  } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const s = await stagiaireService.getById(req.params.id, req.allowedTypes);
    res.json(s);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const s = await stagiaireService.create(req.body, req.user.id);
    res.status(201).json(s);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const s = await stagiaireService.update(req.params.id, req.body, req.allowedTypes);
    res.json(s);
  } catch (e) { next(e); }
};

exports.delete = async (req, res, next) => {
  try {
    await stagiaireService.delete(req.params.id, req.allowedTypes);
    res.json({ message: 'Stagiaire supprimé' });
  } catch (e) { next(e); }
};

exports.exportExcel = async (req, res, next) => {
  try {
    const { pool } = require('../config/db');
    const allowedTypes = req.allowedTypes;
    let where = allowedTypes.length ? `WHERE type_stage IN (${allowedTypes.map(()=>'?').join(',')})` : '';
    const [rows] = await pool.query(`SELECT * FROM stagiaires ${where}`, allowedTypes);

    // CSV simple (pas de dépendance xlsx nécessaire côté backend)
    const headers = ['ID','Nom','Prénom','Email','Type stage','Statut','Date début','Date fin','Entreprise'];
    const csvLines = [
      headers.join(';'),
      ...rows.map(r => [r.id,r.nom,r.prenom,r.email,r.type_stage,r.statut,r.date_debut,r.date_fin,r.entreprise||''].join(';'))
    ];
    const csv = '\uFEFF' + csvLines.join('\r\n'); // BOM pour Excel

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="stagiaires.csv"');
    res.send(csv);
  } catch (e) { next(e); }
};
