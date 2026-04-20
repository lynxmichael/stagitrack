require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/db');
const { startAlerteJob } = require('./jobs/alerteJob');
const logger = require('./config/logger');
const fs = require('fs');

const PORT = process.env.PORT || 5000;

// Créer les dossiers nécessaires
['logs', 'uploads'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const start = async () => {
  await testConnection();
  startAlerteJob();

  app.listen(PORT, () => {
    logger.info(`🚀 StagiTrack API démarrée sur http://localhost:${PORT}`);
    logger.info(`🌍 Environnement : ${process.env.NODE_ENV || 'development'}`);
    logger.info(`📦 Frontend autorisé : ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
};

start().catch(err => {
  logger.error('Erreur fatale au démarrage: ' + err.message);
  process.exit(1);
});
