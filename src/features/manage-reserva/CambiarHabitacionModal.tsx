import React, { useEffect, useState } from 'react';
import { reportesAndTrazasApi } from '../../entities/traza/api';
import { reservaApi } from '../../entities/reserva/api';
import type { HabitacionDto } from '../../entities/habitacion/types';
import styles from './CambiarHabitacionModal.module.css';

interface CambiarHabitacionModalProps {
  reservaId: number;
  habitacionActualId?: string | number; 
  fechaInicio: string;
  fechaFin: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CambiarHabitacionModal: React.FC<CambiarHabitacionModalProps> = ({
  reservaId,
  habitacionActualId,
  fechaInicio,
  fechaFin,
  onClose,
  onSuccess,
}) => {
  const [habitaciones, setHabitaciones] = useState<HabitacionDto[]>([]);
  const [selectedHab, setSelectedHab] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    reportesAndTrazasApi
      .getHabitacionesDisponibles(fechaInicio, fechaFin)
      .then((data) => {
        if (isMounted) {
          setHabitaciones(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('No se pudieron cargar las habitaciones disponibles.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fechaInicio, fechaFin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHab) return;

    setSubmitting(true);
    setError(null);

    try {
      await reservaApi.cambiarHabitacion(reservaId, Number(selectedHab));
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al reasignar habitación');
      }
    } finally {
      setSubmitting(false);
    }
  };
  const displayHabitacionActual = habitacionActualId 
    ? String(habitacionActualId) 
    : 'N/A';

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Cambiar Habitación</h3>
        <p className={styles.subtitle}>
          Habitación actual: <strong>{displayHabitacionActual}</strong>
        </p>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div>Buscando habitaciones libres...</div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              Nueva Habitación Disponible:
              <select
                className={styles.select}
                value={selectedHab}
                onChange={(e) => setSelectedHab(e.target.value)}
                required
              >
                <option value="">-- Seleccionar --</option>
                {habitaciones.map((h, idx) => {
                  const num = h?.numero ?? h?.id;
                  return (
                    <option key={num ?? idx} value={num ?? ''}>
                      Hab. {num ? String(num) : 'S/N'}
                    </option>
                  );
                })}
              </select>
            </label>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting || !selectedHab}
              >
                {submitting ? 'Guardando...' : 'Confirmar Cambio'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};