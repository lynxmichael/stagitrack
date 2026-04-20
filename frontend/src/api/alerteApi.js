import api from './axiosInstance';
export const alerteApi = {
  getAll: (p={}) => api.get('/alertes', { params:p }).then(r => r.data),
  markAsResolved: (id) => api.patch(`/alertes/${id}/resolve`).then(r => r.data),
  deleteAlerte: (id) => api.delete(`/alertes/${id}`).then(r => r.data),
};
