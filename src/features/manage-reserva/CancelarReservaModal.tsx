import React, { useState, type FormEvent } from 'react';
import { Modal } from '../../shared/ui/Modal/Modal';
import { Button } from '../../shared/ui/Button/Button';
import { Input } from '../../shared/ui/Input/Input';
import { reservaApi } from '../../entities/reserva/api';
import styles from './CancelarReservaModal.module.css';

interface CancelarReservaModalProps {
  isOpen: boolean;
  reservaId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CancelarReservaModal: React.FC<CancelarReservaModalProps> = ({
  isOpen,
  reservaId,
  onClose,
  onSuccess,
}) => {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!reservaId || !motivo.trim()) {
      setError('Debe ingresar un motivo de cancelación.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await reservaApi.cancelarReserva(reservaId, { Motivo: motivo });
      setMotivo('');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cancelar la reserva.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancelar Reservación">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.warningBanner}>
           Esta acción registrará la fecha actual como fecha de cancelación y liberará la habitación asignada.
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <Input
          label="Motivo de la Cancelación"
          placeholder="Ej: Cliente canceló viaje por vía telefónica"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          required
        />

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Atrás
          </Button>
          <Button type="submit" variant="danger" isLoading={loading}>
            Confirmar Cancelación
          </Button>
        </div>
      </form>
    </Modal>
  );
};