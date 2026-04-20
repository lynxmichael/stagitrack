import api from './axiosInstance';
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats').then(r => r.data),
  getAlertes: () => api.get('/dashboard/alertes').then(r => r.data),
  getActivities: () => api.get('/dashboard/activities').then(r => r.data),
};
