import React, { useEffect, useState } from 'react';
import { habitacionApi } from '../entities/habitacion/api';
import type { HabitacionDto } from '../entities/habitacion/types';
import { ToggleFueraDeServicio } from '../features/manage-habitacion/ToggleFueraDeServicio';
import styles from './HabitacionesPage.module.css';

export const HabitacionesPage: React.FC = () => {
  const [habitaciones, setHabitaciones] = useState<HabitacionDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabitaciones = () => {
    habitacionApi.getHabitaciones()
      .then((data) => {
        setHabitaciones(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar habitaciones:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHabitaciones();
  }, []);

  const getPisoHabitaciones = (piso: number | string) => {
    const pisoTarget = String(piso);
    return habitaciones.filter((h) => {
      if (h.numero === null || h.numero === undefined) return false;
      return String(h.numero).charAt(0) === pisoTarget;
    });
  };

  const totalFueraDeServicio = habitaciones.filter((h) => h.estaFueraDeServicio).length;
  const totalOperativas = habitaciones.length - totalFueraDeServicio;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Mapa de Habitaciones</h2>
          <p style={{ color: 'var(--text-muted)' }}>Distribución en 3 niveles (15 habitaciones)</p>
        </div>

        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <span>Operativas:</span>
            <span className={styles.statValue} style={{ color: 'var(--status-success)' }}>
              {totalOperativas}
            </span>
          </div>
          <div className={styles.statCard}>
            <span>Fuera de Servicio:</span>
            <span className={styles.statValue} style={{ color: 'var(--status-danger)' }}>
              {totalFueraDeServicio}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div>Cargando mapa del hostal...</div>
      ) : (
        [3, 2, 1].map((piso) => (
          <div key={piso} className={styles.pisoSection}>
            <h3 className={styles.pisoTitle}>Piso {piso}</h3>
            <div className={styles.grid}>
              {getPisoHabitaciones(piso).map((hab) => (
                <div
                  key={hab.id ?? hab.numero}
                  className={`${styles.habCard} ${
                    hab.estaFueraDeServicio ? styles.mantenimiento : styles.libre
                  }`}
                >
                  <div className={styles.habHeader}>
                    <span className={styles.habNumero}>Hab. {String(hab.numero).padStart(3, '0')}</span>
                    <span className={styles.habTipo}>
                      {hab.estaFueraDeServicio ? 'MANTENIMIENTO' : 'DISPONIBLE'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', marginBottom: '10px' }}>
                    <div><strong>Tarifa:</strong> $10.00 USD/día</div>
                  </div>

                  <div className={styles.amaBox} style={{ marginBottom: '10px' }}>
                    {hab.amasDeLlavesNombres?.length
                      ? hab.amasDeLlavesNombres.join(', ')
                      : 'Sin ama asignada'}
                  </div>

                  {hab.numero ? (
                    <ToggleFueraDeServicio
                      habitacionId={Number(hab.numero)}
                      estaFueraDeServicio={hab.estaFueraDeServicio}
                      onSuccess={fetchHabitaciones}
                    />
                  ) : (
                    <div style={{ color: 'var(--status-danger)', fontSize: '0.85rem' }}>
                      Número de habitación no disponible
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};