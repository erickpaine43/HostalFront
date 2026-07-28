import React, { useEffect, useState, useCallback } from 'react';
import { amaDeLlavesApi } from '../entities/amaDeLlaves/api';
import type { AmaDeLlavesDto } from '../entities/amaDeLlaves/types';
import { AmaForm } from '../features/manage-ama/AmaForm';
import { AsignarHabitacionModal } from '../features/manage-ama/AsignarHabitacionModal';
import { DesasignarHabitacionModal } from '../features/manage-ama/DesasignarHabitacionModal';
import styles from '../pages/AmasDeLlavesPage.module.css';

export const AmasDeLlavesPage: React.FC = () => {
  const [amas, setAmas] = useState<AmaDeLlavesDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAma, setSelectedAma] = useState<AmaDeLlavesDto | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetAma, setTargetAma] = useState<AmaDeLlavesDto | null>(null);
  const [isDesasignarModalOpen, setIsDesasignarModalOpen] = useState(false);
  const [targetAmaDesasignar, setTargetAmaDesasignar] = useState<AmaDeLlavesDto | null>(null);

  const fetchAmas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await amaDeLlavesApi.getAmasDeLlaves();
      setAmas(data || []);
    } catch (err) {
      console.error('Error al cargar amas de llaves:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const data = await amaDeLlavesApi.getAmasDeLlaves();
        setAmas(data || []);
      } catch (err) {
        console.error('Error al cargar amas de llaves:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleOpenCreate = () => {
    setSelectedAma(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (ama: AmaDeLlavesDto) => {
    setSelectedAma(ama);
    setIsFormOpen(true);
  };

  const handleOpenAssign = (ama: AmaDeLlavesDto) => {
    setTargetAma(ama);
    setIsAssignModalOpen(true);
  };

  const handleOpenDesasignar = (ama: AmaDeLlavesDto) => {
    setTargetAmaDesasignar(ama);
    setIsDesasignarModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return;
    try {
      await amaDeLlavesApi.eliminarAmaDeLlaves(id);
      setAmas((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('No se pudo eliminar el registro.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div>
          <h2>Personal de Limpieza (Amas de Llaves)</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Directorio del personal encargado del mantenimiento del hostal
          </p>
        </div>
        <button className={styles.addButton} onClick={handleOpenCreate}>
          + Nueva Ama de Llaves
        </button>
      </div>

      {loading ? (
        <div>Cargando información del personal...</div>
      ) : amas.length === 0 ? (
        <div style={{ color: 'var(--text-muted)' }}>No hay amas de llaves registradas.</div>
      ) : (
        <div className={styles.grid}>
          {amas.map((ama) => {
            const tieneHabitaciones = ama.habitacionesAsignadas && ama.habitacionesAsignadas.length > 0;

            return (
              <div key={ama.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span>🧹</span>
                  <span>{ama.nombreApellidos}</span>
                </div>

                <div className={styles.cardBody}>
                  <div>
                    <span className={styles.label}>Carnet Identidad: </span>
                    <strong>{ama.ci}</strong>
                  </div>
                  <div>
                    <span className={styles.label}>Teléfono: </span>
                    <strong>{ama.numeroTelefono || 'N/A'}</strong>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.assignBtn} onClick={() => handleOpenAssign(ama)}>
                    Asignar Habitación
                  </button>
                  <button
                    onClick={() => handleOpenDesasignar(ama)}
                    disabled={!tieneHabitaciones}
                    className={`${styles.btnDesasignar} ${!tieneHabitaciones ? styles.disabled : ''}`}
                  >
                    Desasignar Habitación
                  </button>
                  <button className={styles.editBtn} onClick={() => handleOpenEdit(ama)}>
                    Editar
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(ama.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isFormOpen && (
        <AmaForm
          initialData={selectedAma}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchAmas();
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {isAssignModalOpen && targetAma && (
        <AsignarHabitacionModal
          ama={targetAma}
          onClose={() => setIsAssignModalOpen(false)}
          onSuccess={() => {
            setIsAssignModalOpen(false);
            fetchAmas();
          }}
        />
      )}

      {isDesasignarModalOpen && targetAmaDesasignar && (
        <DesasignarHabitacionModal
          isOpen={isDesasignarModalOpen}
          onClose={() => {
            setIsDesasignarModalOpen(false);
            setTargetAmaDesasignar(null);
          }}
          onSuccess={() => {
            setIsDesasignarModalOpen(false);
            setTargetAmaDesasignar(null);
            fetchAmas();
          }}
          amaDeLlavesId={targetAmaDesasignar.id}
          amaDeLlavesNombre={targetAmaDesasignar.nombreApellidos}
          habitacionesAsignadas={targetAmaDesasignar.habitacionesAsignadas || []}
        />
      )}
    </div>
  );
};