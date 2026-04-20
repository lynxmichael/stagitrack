const dashboardService = require('../services/dashboardService');

exports.getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats(req.allowedTypes);
    res.json(stats);
  } catch (e) { next(e); }
};

exports.getAlertes = async (req, res, next) => {
  try {
    const alertes = await dashboardService.getAlertes(req.allowedTypes);
    res.json(alertes);
  } catch (e) { next(e); }
};

exports.getActivities = async (req, res, next) => {
  try {
    const activities = await dashboardService.getActivities(req.allowedTypes);
    res.json(activities);
  } catch (e) { next(e); }
};
