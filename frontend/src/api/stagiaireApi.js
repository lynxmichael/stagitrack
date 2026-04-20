import api from './axiosInstance';
export const stagiaireApi = {
  getAll: (p={}) => api.get('/stagiaires', { params: p }).then(r => r.data),
  getById: (id) => api.get(`/stagiaires/${id}`).then(r => r.data),
  create: (d) => api.post('/stagiaires', d).then(r => r.data),
  update: (id, d) => api.put(`/stagiaires/${id}`, d).then(r => r.data),
  delete: (id) => api.delete(`/stagiaires/${id}`).then(r => r.data),
  exportPdf: (id) => api.get(`/stagiaires/${id}/export/pdf`, { responseType:'blob' }).then(r => r.data),
  exportExcel: (p={}) => api.get('/stagiaires/export/excel', { params:p, responseType:'blob' }).then(r => r.data),
};
