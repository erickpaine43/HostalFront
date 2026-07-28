import React, { useState } from 'react';
import { habitacionApi } from '../../entities/habitacion/api';
import type { AmaDeLlavesDto } from '../../entities/amaDeLlaves/types';
import styles from './ManageHabitacion.module.css';

interface AsignarAmaDeLlavesSelectorProps {
  habitacionId: number;
  amaDeLlavesActualId?: number | null;
  amasDeLlaves: AmaDeLlavesDto[];
  onSuccess?: () => void;
}

export const AsignarAmaDeLlavesSelector: React.FC<AsignarAmaDeLlavesSelectorProps> = ({
  habitacionId,
  amaDeLlavesActualId,
  amasDeLlaves,
  onSuccess,
}) => {
  const [selectedAmaId, setSelectedAmaId] = useState<string>(
    amaDeLlavesActualId ? String(amaDeLlavesActualId) : ''
  );
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAmaId(value);
    setUpdating(true);

    try {
      const newAmaId = value ? Number(value) : null;

      if (newAmaId !== null) {
        await habitacionApi.asignarAmaDeLlaves(habitacionId, newAmaId);
      } else if (amaDeLlavesActualId) {
        await habitacionApi.desasignarAmaDeLlaves(habitacionId, amaDeLlavesActualId);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al reasignar ama de llaves:', error);
      setSelectedAmaId(amaDeLlavesActualId ? String(amaDeLlavesActualId) : '');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      className={styles.select}
      value={selectedAmaId}
      onChange={handleChange}
      disabled={updating}
    >
      <option value="">-- Sin Asignar --</option>
      {amasDeLlaves.map((ama) => (
        <option key={ama.id} value={ama.id}>
          {ama.nombreApellidos}
        </option>
      ))}
    </select>
  );
};