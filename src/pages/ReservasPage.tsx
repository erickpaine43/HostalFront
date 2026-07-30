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
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [cancelarReservaId, setCancelarReservaId] = useState<number | null>(null);
  const [cambiarHabitacionReserva, setCambiarHabitacionReserva] = useState<ReservaDto | null>(null);
  const [editarReserva, setEditarReserva] = useState<ReservaDto | null>(null);

  const loadReservas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await reservaApi.getReservas(page, pageSize);
      setReservas(response?.datos || []);
      setTotalPages(response?.totalPaginas || 1);
      setTotalItems(response?.total || 0);
    } catch (err) {
      console.error('Error al cargar reservaciones:', err);
      setReservas([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadReservas();
  }, [loadReservas]);

  const handleCheckin = async (id: number) => {
    try {
      await reservaApi.checkinReserva(id);
      await loadReservas();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al registrar llegada');
    }
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
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
        <>
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

          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Mostrando {reservas.length} de {totalItems} reservas
            </div>

            <div className={styles.paginationControls}>
              <button
                type="button"
                className={styles.paginationButton}
                onClick={handlePrevious}
                disabled={page === 1}
              >
                Anterior
              </button>

              <span className={styles.paginationText}>
                Página {page} de {totalPages}
              </span>

              <button
                type="button"
                className={styles.paginationButton}
                onClick={handleNext}
                disabled={page === totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
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
          habitacionActualId={cambiarHabitacionReserva.habitacionNumero ?? 
            cambiarHabitacionReserva.habitacionId ?? 'N/A'}
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