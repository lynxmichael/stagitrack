const cron = require('node-cron');
const Stagiaire = require('../models/Stagiaire');
const alerteService = require('../services/alerteService');
const logger = require('../config/logger');

/**
 * Tâche CRON — lancée chaque jour à 08h00
 * Crée automatiquement des alertes pour les stages qui finissent dans <= 7 jours
 */
const startAlerteJob = () => {
  cron.schedule('0 8 * * *', async () => {
    logger.info('🕐 CRON alerteJob: vérification des fins de stage...');
    try {
      const expiring = await Stagiaire.findExpiringSoon(7);
      let created = 0;
      for (const s of expiring) {
        await alerteService.createIfNotExists(
          s.id,
          'fin_stage',
          `Fin de stage imminente – ${s.prenom} ${s.nom}`,
          `Le stage se termine le ${new Date(s.date_fin).toLocaleDateString('fr-FR')}`
        );
        created++;
      }
      logger.info(`✅ alerteJob: ${created} alerte(s) créée(s)`);
    } catch (err) {
      logger.error('❌ alerteJob erreur: ' + err.message);
    }
  }, { timezone: 'Africa/Abidjan' });

  logger.info('⏰ alerteJob planifié (tous les jours à 08h00)');
};

module.exports = { startAlerteJob };
