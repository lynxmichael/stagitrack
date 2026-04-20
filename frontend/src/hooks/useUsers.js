import { useState } from 'react';
import { userApi } from '../api/userApi';
import { toast } from 'react-toastify';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userApi.getAll();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } finally { setLoading(false); }
  };

  const createUser = async (data) => {
    try {
      await userApi.create(data);
      toast.success('Conseiller créé');
      await fetchUsers();
      return true;
    } catch { return false; }
  };

  const updateUser = async (id, data) => {
    try {
      await userApi.update(id, data);
      toast.success('Conseiller mis à jour');
      await fetchUsers();
      return true;
    } catch { return false; }
  };

  const deleteUser = async (id) => {
    try {
      await userApi.delete(id);
      toast.success('Conseiller supprimé');
      await fetchUsers();
    } catch {}
  };

  return { users, loading, fetchUsers, createUser, updateUser, deleteUser };
};
