import React, { useState } from 'react';
import { reservaApi } from '../../entities/reserva/api';
import styles from './CheckInModal.module.css';

interface CheckInButtonProps {
  reservaId: number;
  nombreCliente?: string;
  numeroHabitacion?: string | number;
  onSuccess?: () => void;
  disabled?: boolean;
}

export const CheckInButton: React.FC<CheckInButtonProps> = ({
  reservaId,
  nombreCliente,
  numeroHabitacion,
  onSuccess,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setError(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (submitting) return;
    setIsOpen(false);
  };

  const handleConfirmCheckIn = async () => {
    setSubmitting(true);
    setError(null);

    try {
      await reservaApi.checkinReserva(reservaId);
      setIsOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al registrar el Check-In.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.checkInTriggerBtn}
        onClick={handleOpen}
        disabled={disabled}
      >
        Check-In
      </button>

      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.title}>Confirmar Check-In</h3>
            <p className={styles.description}>
              ¿Deseas registrar la entrada oficial del cliente al hostal?
            </p>

            {(nombreCliente || numeroHabitacion) && (
              <div className={styles.details}>
                {nombreCliente && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Cliente:</span>
                    <span className={styles.detailValue}>{nombreCliente}</span>
                  </div>
                )}
                {numeroHabitacion && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Habitación:</span>
                    <span className={styles.detailValue}>
                      Hab. {numeroHabitacion}
                    </span>
                  </div>
                )}
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.cancelBtn}`}
                onClick={handleClose}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.confirmBtn}`}
                onClick={handleConfirmCheckIn}
                disabled={submitting}
              >
                {submitting ? 'Procesando...' : 'Confirmar Entrada'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};