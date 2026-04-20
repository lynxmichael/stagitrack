import { useState } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { alerteApi } from '../api/alerteApi';
import { toast } from 'react-toastify';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, alertesRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getAlertes()
      ]);
      setStats(statsRes);
      setAlertes(Array.isArray(alertesRes) ? alertesRes : alertesRes.alertes || []);
    } finally { setLoading(false); }
  };

  const resolveAlerte = async (id) => {
    try {
      await alerteApi.markAsResolved(id);
      toast.success('Alerte résolue');
      fetchDashboardData();
    } catch {}
  };

  return { stats, alertes, loading, fetchDashboardData, resolveAlerte };
};
