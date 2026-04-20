import { useState } from 'react';
import { stagiaireApi } from '../api/stagiaireApi';
import { toast } from 'react-toastify';

export const useStagiaires = () => {
  const [stagiaires, setStagiaires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });

  const fetchStagiaires = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await stagiaireApi.getAll(filters);
      // Support both array and paginated response
      if (Array.isArray(data)) {
        setStagiaires(data);
      } else {
        setStagiaires(data.stagiaires || data.data || []);
        if (data.total) setPagination(p => ({ ...p, total: data.total }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createStagiaire = async (data) => {
    try {
      await stagiaireApi.create(data);
      toast.success('Stagiaire créé avec succès');
      return true;
    } catch { return false; }
  };

  const updateStagiaire = async (id, data) => {
    try {
      await stagiaireApi.update(id, data);
      toast.success('Stagiaire mis à jour');
      return true;
    } catch { return false; }
  };

  const deleteStagiaire = async (id) => {
    try {
      await stagiaireApi.delete(id);
      toast.success('Stagiaire supprimé');
      await fetchStagiaires();
    } catch {}
  };

  return { stagiaires, loading, pagination, fetchStagiaires, createStagiaire, updateStagiaire, deleteStagiaire };
};
