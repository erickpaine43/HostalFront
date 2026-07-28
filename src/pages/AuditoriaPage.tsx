import React, { useEffect, useState } from 'react';
import { reportesAndTrazasApi } from '../entities/traza/api';
import type { TrazaDto } from '../entities/traza/types';
import styles from './AuditoriaPage.module.css';

export const AuditoriaPage: React.FC = () => {
  const [trazas, setTrazas] = useState<TrazaDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    reportesAndTrazasApi.getTrazas()
      .then((data) => {
        if (isMounted) {
          setTrazas(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error al cargar trazas de auditoría:', err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const renderOperacionBadge = (operacion: string) => {
    const op = operacion.toLowerCase();
    if (op.includes('delete') || op.includes('eliminar') || op.includes('cancel')) {
      return <span className={`${styles.badge} ${styles.badgeDelete}`}>{operacion}</span>;
    }
    if (op.includes('update') || op.includes('modificar') || op.includes('checkin')) {
      return <span className={`${styles.badge} ${styles.badgeUpdate}`}>{operacion}</span>;
    }
    return <span className={`${styles.badge} ${styles.badgeInsert}`}>{operacion}</span>;
  };

  return (
    <div className={styles.container}>
      <div>
        <h2>Trazas de Auditoría</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Registro histórico de cambios y operaciones realizadas en la base de datos
        </p>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: 20 }}>Cargando registros de auditoría...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Operación</th>
                <th>Tabla Afectada</th>
                <th>ID Registro</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {trazas.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No hay registros de auditoría disponibles.
                  </td>
                </tr>
              ) : (
                trazas.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.fechaHora).toLocaleString()}</td>
                    <td>{renderOperacionBadge(t.operacion)}</td>
                    <td><code style={{ color: 'var(--accent-secondary)' }}>{t.tablaAfectada}</code></td>
                    <td>#{t.registroId}</td>
                    <td>{t.detalles}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};