import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../shared/ui/Button/Button';
import { Modal } from '../shared/ui/Modal/Modal';
import { ReservaCard } from '../widgets/reserva-card/ReservaCard';
import { ReservaForm } from '../features/manage-reserva/ReservaForm';
import { CancelarReservaModal } from '../features/manage-reserva/CancelarReservaModal';
import { CambiarHabitacionModal } from '../features/manage-reserva/CambiarHabitacionModal';
import { reservaApi } from '../entities/reserva/api';
import type { ReservaDto } from '../entities/reserva/types';
import styles from './ReservasPage.module.css';

export const ReservasPage: React.FC = () => {
  const [reservas, setReservas] = useState<ReservaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [cancelarReservaId, setCancelarReservaId] = useState<number | null>(null);
  const [cambiarHabitacionReserva, setCambiarHabitacionReserva] = useState<ReservaDto | null>(null);
  const [editarReserva, setEditarReserva] = useState<ReservaDto | null>(null);


  const loadReservas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reservaApi.getReservas();
      setReservas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar reservaciones:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    reservaApi.getReservas()
      .then((data) => {
        if (isMounted) {
          setReservas(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error al cargar reservaciones:', err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCheckin = async (id: number) => {
    try {
      await reservaApi.checkinReserva(id);
      await loadReservas();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al registrar llegada');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Gestión de Reservaciones</h2>
          <p style={{ color: 'var(--text-muted)' }}>Mínimo 3 días de estancia por reserva</p>
        </div>
        <Button onClick={() => setIsCrearModalOpen(true)}>+ Nueva Reserva</Button>
      </div>

      {loading ? (
        <div>Cargando reservaciones...</div>
      ) : reservas.length === 0 ? (
        <div className={styles.empty}>No hay reservas registradas en el sistema.</div>
      ) : (
        <div className={styles.grid}>
          {reservas.map((reserva) => (
            <ReservaCard
              key={reserva.id}
              reserva={reserva}
              onCheckin={handleCheckin}
              onCancelar={(id) => setCancelarReservaId(id)}
              onEditar={(reservaObj) => setEditarReserva(reservaObj)}
              onCambiarHabitacion={(id) => {
                const encontrada = reservas.find((r) => r.id === id);
                if (encontrada) setCambiarHabitacionReserva(encontrada);
              }}
            />
          ))}
        </div>
      )}

     
      <Modal
        isOpen={isCrearModalOpen}
        onClose={() => setIsCrearModalOpen(false)}
        title="Crear Nueva Reservación"
      >
        <ReservaForm
          onSuccess={() => {
            setIsCrearModalOpen(false);
            loadReservas();
          }}
          onCancel={() => setIsCrearModalOpen(false)}
        />
      </Modal>

      
      {editarReserva && (
        <Modal
          isOpen={Boolean(editarReserva)}
          onClose={() => setEditarReserva(null)}
          title={`Modificar Reservación #${editarReserva.id}`}
        >
          <ReservaForm
            reservaInicial={editarReserva}
            onSuccess={() => {
              setEditarReserva(null);
              loadReservas();
            }}
            onCancel={() => setEditarReserva(null)}
          />
        </Modal>
      )}

      
      <CancelarReservaModal
        isOpen={cancelarReservaId !== null}
        reservaId={cancelarReservaId}
        onClose={() => setCancelarReservaId(null)}
        onSuccess={loadReservas}
      />

     
      {cambiarHabitacionReserva && (
        <CambiarHabitacionModal
          reservaId={cambiarHabitacionReserva.id}
          habitacionActualId={cambiarHabitacionReserva.habitacionNumero?.toString() || ''}
          fechaInicio={cambiarHabitacionReserva.fechaEntrada}
          fechaFin={cambiarHabitacionReserva.fechaSalida}
          onClose={() => setCambiarHabitacionReserva(null)}
          onSuccess={() => {
            setCambiarHabitacionReserva(null);
            loadReservas();
          }}
        />
      )}
    </div>
  );
};