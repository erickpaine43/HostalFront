import React from 'react';
import { Button } from '../../shared/ui/Button/Button';
import type { ReservaDto } from '../../entities/reserva/types';
import styles from './ReservaCard.module.css';

interface ReservaCardProps {
  reserva: ReservaDto;
  onCheckin: (id: number) => void;
  onCancelar: (id: number) => void;
  onCambiarHabitacion: (id: number) => void;
  onEditar: (reserva: ReservaDto) => void; 
}

export const ReservaCard: React.FC<ReservaCardProps> = ({
  reserva,
  onCheckin,
  onCancelar,
  onCambiarHabitacion,
  onEditar,
}) => {
  const hoyStr = new Date().toISOString().split('T')[0];
  const fechaEntradaStr = reserva.fechaEntrada.split('T')[0];

 
  const esModificable = !reserva.estaElClienteEnHostal && !reserva.estaCancelada && hoyStr <= fechaEntradaStr;

  const getStatusBadge = () => {
    if (reserva.estaCancelada) {
      return <span className={`${styles.badge} ${styles.statusCancelada}`}>Cancelada</span>;
    }
    if (reserva.estaElClienteEnHostal) {
      return <span className={`${styles.badge} ${styles.statusEnHostal}`}>En Hostal</span>;
    }
    return <span className={`${styles.badge} ${styles.statusPendiente}`}>Pendiente</span>;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.habitacionTag}>Hab. {reserva.habitacionNumero}</span>
        {getStatusBadge()}
      </div>

      <div className={styles.infoGroup}>
        <div className={styles.row}>
          <span>Cliente:</span>
          <strong className={styles.value}>{reserva.clienteNombre}</strong>
        </div>
        <div className={styles.row}>
          <span>Entrada:</span>
          <span className={styles.value}>{new Date(reserva.fechaEntrada).toLocaleDateString()}</span>
        </div>
        <div className={styles.row}>
          <span>Salida:</span>
          <span className={styles.value}>{new Date(reserva.fechaSalida).toLocaleDateString()}</span>
        </div>
        <div className={styles.row}>
          <span>Importe Total:</span>
          <strong className={styles.value} style={{ color: 'var(--accent-secondary)' }}>
            ${(reserva.importe ?? 0).toFixed(2)} USD
          </strong>
        </div>
      </div>

      {reserva.estaCancelada && reserva.motivoCancelacion && (
        <div className={styles.cancelInfo}>
          <strong>Motivo Cancelación:</strong> {reserva.motivoCancelacion}
        </div>
      )}

      {!reserva.estaCancelada && (
        <div className={styles.actions}>
          {!reserva.estaElClienteEnHostal && (
            <Button variant="primary" onClick={() => onCheckin(reserva.id)}>
              Llegada (Check-in)
            </Button>
          )}

          
          {esModificable && (
            <Button variant="secondary" onClick={() => onEditar(reserva)}>
              Modificar
            </Button>
          )}

          {esModificable && (
            <Button variant="secondary" onClick={() => onCambiarHabitacion(reserva.id)}>
              Cambiar Habitación
            </Button>
          )}

          {!reserva.estaElClienteEnHostal && (
            <Button variant="danger" onClick={() => onCancelar(reserva.id)}>
              Cancelar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};