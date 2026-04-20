import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useForm } from 'react-hook-form';
import { useStagiaires } from '../../hooks/useStagiaires';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';

export const StagiaireFormModal = ({ isOpen, onClose, stagiaire, onSuccess }) => {
  const { createStagiaire, updateStagiaire } = useStagiaires();
  const { getAllowedStageTypes } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const allowedTypes = getAllowedStageTypes();

  useEffect(() => {
    if (stagiaire) {
      reset({
        ...stagiaire,
        date_debut: stagiaire.date_debut?.split('T')[0],
        date_fin: stagiaire.date_fin?.split('T')[0]
      });
    } else {
      reset({ type_stage: allowedTypes[0] || 'ecole', statut: 'actif' });
    }
  }, [stagiaire, reset]);

  const onSubmit = async (data) => {
    let success;
    if (stagiaire) {
      success = await updateStagiaire(stagiaire.id, data);
    } else {
      success = await createStagiaire(data);
    }
    if (success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={stagiaire ? 'Modifier le stagiaire' : 'Nouveau stagiaire'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input {...register('nom', { required: true })} placeholder="Nom" className="glass-input" />
          <input {...register('prenom', { required: true })} placeholder="Prénom" className="glass-input" />
        </div>
        <input {...register('email')} placeholder="Email" type="email" className="w-full glass-input" />
        <input {...register('telephone')} placeholder="Téléphone" className="w-full glass-input" />
        <select {...register('type_stage')} className="w-full glass-input">
          {allowedTypes.includes('ecole') && <option value="ecole">Stage École</option>}
          {allowedTypes.includes('validation') && <option value="validation">Stage Validation</option>}
          {allowedTypes.includes('qualification') && <option value="qualification">Stage Qualification</option>}
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input {...register('date_debut')} type="date" className="glass-input" />
          <input {...register('date_fin')} type="date" className="glass-input" />
        </div>
        <select {...register('statut')} className="w-full glass-input">
          <option value="actif">Actif</option>
          <option value="en_attente">En attente</option>
          <option value="termine">Terminé</option>
        </select>
        <Button type="submit" className="w-full">{stagiaire ? 'Mettre à jour' : 'Créer'}</Button>
      </form>
    </Modal>
  );
};