import api from './axiosInstance';
export const userApi = {
  getAll: () => api.get('/users').then(r => r.data),
  getById: (id) => api.get(`/users/${id}`).then(r => r.data),
  create: (d) => api.post('/users', d).then(r => r.data),
  update: (id, d) => api.put(`/users/${id}`, d).then(r => r.data),
  delete: (id) => api.delete(`/users/${id}`).then(r => r.data),
};
