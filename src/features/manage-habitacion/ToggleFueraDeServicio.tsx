import React, { useState } from 'react';
import { habitacionApi } from '../../entities/habitacion/api';
import styles from './ManageHabitacion.module.css';

interface ToggleFueraDeServicioProps {
  habitacionId: number;
  estaFueraDeServicio: boolean;
  onSuccess?: () => void;
}

export const ToggleFueraDeServicio: React.FC<ToggleFueraDeServicioProps> = ({
  habitacionId,
  estaFueraDeServicio,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);

    try {
      await habitacionApi.toggleFueraDeServicio(habitacionId, true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error('Error al cambiar el estado de la habitación:', error);
      
      let errorMessage = 'No se pudo actualizar el estado de la habitación.';
      
      if (error instanceof Error) {
        errorMessage = error.message.replace(/^["']|["']$/g, '').trim();
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.toggleBtn} ${
        estaFueraDeServicio ? styles.operativa : styles.fueraServicio
      }`}
      onClick={handleToggle}
      disabled={loading}
    >
      {loading
        ? 'Actualizando...'
        : estaFueraDeServicio
        ? 'Habilitar'
        : 'Poner Fuera de Servicio'}
    </button>
  );
};