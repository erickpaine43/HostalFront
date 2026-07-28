import React, { useState } from 'react';
import styles from './DesasignarHabitacionModal.module.css';
import { habitacionApi } from '../../entities/habitacion/api';

interface HabitacionAsignada {
  numero: number;
}

interface DesasignarHabitacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amaDeLlavesId: number;
  amaDeLlavesNombre: string;
  habitacionesAsignadas: HabitacionAsignada[];
}

export const DesasignarHabitacionModal: React.FC<DesasignarHabitacionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amaDeLlavesId,
  amaDeLlavesNombre,
  habitacionesAsignadas,
}) => {
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<string>('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitacionSeleccionada) return;

    setLoading(true);
    try {
      const mensaje = await habitacionApi.desasignarAmaDeLlaves(
        Number(habitacionSeleccionada),
        amaDeLlavesId
      );
      alert(mensaje.replace(/^["']|["']$/g, '').trim());
      onSuccess();
      onClose();
    } catch (error: unknown) {
      let errorMsg = 'No se pudo desasignar la habitación.';
      if (error instanceof Error) {
        errorMsg = error.message.replace(/^["']|["']$/g, '').trim();
      }
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>🔑 Desasignar Habitación</h3>
        <p>Personal: <strong>{amaDeLlavesNombre}</strong></p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Seleccionar Habitación</label>
            <select
              value={habitacionSeleccionada}
              onChange={(e) => setHabitacionSeleccionada(e.target.value)}
              required
              className={styles.selectInput}
            >
              <option value="" disabled>
                -- Seleccione una habitación --
              </option>
              {habitacionesAsignadas.map((hab) => (
                <option key={hab.numero} value={hab.numero}>
                  Habitación {hab.numero}
                </option>
              ))}
            </select>
          </div>
          <p className={styles.helperText}>
            Selecciona la habitación que deseas desasignar de este personal.
          </p>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.btnCancel} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSubmit} disabled={loading || !habitacionSeleccionada}>
              {loading ? 'Procesando...' : 'Desasignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};