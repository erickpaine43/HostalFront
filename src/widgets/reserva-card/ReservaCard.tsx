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
  
  const parseFechaStr = (fecha?: string | Date) => {
    if (!fecha) return '';
    if (typeof fecha === 'string') return fecha.split('T')[0];
    return fecha.toISOString().split('T')[0];
  };

  const fechaEntradaStr = parseFechaStr(reserva?.fechaEntrada);
  const esModificable = 
    !reserva?.estaElClienteEnHostal && 
    !reserva?.estaCancelada && 
    Boolean(fechaEntradaStr) && 
    hoyStr <= fechaEntradaStr;

  const getStatusBadge = () => {
    if (reserva?.estaCancelada) {
      return <span className={`${styles.badge} ${styles.statusCancelada}`}>Cancelada</span>;
    }
    if (reserva?.estaElClienteEnHostal) {
      return <span className={`${styles.badge} ${styles.statusEnHostal}`}>En Hostal</span>;
    }
    return <span className={`${styles.badge} ${styles.statusPendiente}`}>Pendiente</span>;
  };
  const numHabitacion = reserva?.habitacionNumero ?? (reserva as any)?.habitacionId ?? 'S/N';
  const formatLocalDate = (fechaStr?: string | Date) => {
    if (!fechaStr) return 'N/A';
    const d = new Date(fechaStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.habitacionTag}>Hab. {numHabitacion}</span>
        {getStatusBadge()}
      </div>

      <div className={styles.infoGroup}>
        <div className={styles.row}>
          <span>Cliente:</span>
          <strong className={styles.value}>{reserva?.clienteNombre ?? 'Sin Cliente'}</strong>
        </div>
        <div className={styles.row}>
          <span>Entrada:</span>
          <span className={styles.value}>{formatLocalDate(reserva?.fechaEntrada)}</span>
        </div>
        <div className={styles.row}>
          <span>Salida:</span>
          <span className={styles.value}>{formatLocalDate(reserva?.fechaSalida)}</span>
        </div>
        <div className={styles.row}>
          <span>Importe Total:</span>
          <strong className={styles.value} style={{ color: 'var(--accent-secondary)' }}>
            ${(reserva?.importe ?? 0).toFixed(2)} USD
          </strong>
        </div>
      </div>

      {reserva?.estaCancelada && reserva?.motivoCancelacion && (
        <div className={styles.cancelInfo}>
          <strong>Motivo Cancelación:</strong> {reserva.motivoCancelacion}
        </div>
      )}

      {!reserva?.estaCancelada && (
        <div className={styles.actions}>
          {!reserva?.estaElClienteEnHostal && (
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

          {!reserva?.estaElClienteEnHostal && (
            <Button variant="danger" onClick={() => onCancelar(reserva.id)}>
              Cancelar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};