import React, { useState, useEffect } from 'react';
import { reportesAndTrazasApi } from '../entities/traza/api';
import { amaDeLlavesApi } from '../entities/amaDeLlaves/api';
import type { ClienteActivoReporteDto } from '../entities/traza/types';
import type { HabitacionDto } from '../entities/habitacion/types';
import type { AmaDeLlavesDto } from '../entities/amaDeLlaves/types';
import styles from './ReportesPage.module.css';

type TabType = 'clientes-activos' | 'ama-habitaciones' | 'disponibles';

export const ReportesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('clientes-activos');

  const [fechaCliente, setFechaCliente] = useState<string>(() =>
    new Date().toISOString().split('T')[0]
  );
  const [clientesActivos, setClientesActivos] = useState<ClienteActivoReporteDto[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

  const [amas, setAmas] = useState<AmaDeLlavesDto[]>([]);
  const [selectedAmaId, setSelectedAmaId] = useState<string>('');
  const [habsAma, setHabsAma] = useState<HabitacionDto[]>([]);
  const [loadingHabsAma, setLoadingHabsAma] = useState(false);

  const [fechaInicio, setFechaInicio] = useState<string>(() =>
    new Date().toISOString().split('T')[0]
  );
  const [fechaFin, setFechaFin] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [disponibles, setDisponibles] = useState<HabitacionDto[]>([]);
  const [loadingDisp, setLoadingDisp] = useState(false);

  useEffect(() => {
    amaDeLlavesApi.getAmasDeLlaves().then((data) => setAmas(data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeTab !== 'clientes-activos' || !fechaCliente) return;

    let isMounted = true;

    const fetchClientes = async () => {
      setLoadingClientes(true);
      try {
        const data = await reportesAndTrazasApi.getClientesActivosPorDia(fechaCliente);
        if (isMounted) setClientesActivos(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoadingClientes(false);
      }
    };

    fetchClientes();

    return () => {
      isMounted = false;
    };
  }, [activeTab, fechaCliente]);

  const handleSelectAma = (amaIdStr: string) => {
    setSelectedAmaId(amaIdStr);
    if (!amaIdStr) {
      setHabsAma([]);
      return;
    }
    setLoadingHabsAma(true);
    reportesAndTrazasApi
      .getHabitacionesPorAmaDeLlaves(Number(amaIdStr))
      .then((data) => setHabsAma(data || []))
      .catch(console.error)
      .finally(() => setLoadingHabsAma(false));
  };


  useEffect(() => {
    if (activeTab !== 'disponibles' || !fechaInicio || !fechaFin) return;

    let isMounted = true;

    const fetchDisponibles = async () => {
      setLoadingDisp(true);
      try {
        const data = await reportesAndTrazasApi.getHabitacionesDisponibles(fechaInicio, fechaFin);
        if (isMounted) setDisponibles(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoadingDisp(false);
      }
    };

    fetchDisponibles();

    return () => {
      isMounted = false;
    };
  }, [activeTab, fechaInicio, fechaFin]);

  return (
    <div className={styles.container}>
      <div>
        <h2>Reportes Operativos</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Consultas en tiempo real del Hostal Isla Azul
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-glass)' }}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'clientes-activos' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('clientes-activos')}
        >
          Clientes Activos por Día
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'ama-habitaciones' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('ama-habitaciones')}
        >
          Habitaciones por Ama de Llaves
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'disponibles' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('disponibles')}
        >
          Disponibilidad por Período
        </button>
      </div>

      {activeTab === 'clientes-activos' && (
        <div className={styles.card}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Seleccionar Fecha:</label>
            <input
              type="date"
              className={styles.inputDate}
              value={fechaCliente}
              onChange={(e) => setFechaCliente(e.target.value)}
            />
          </div>

          {loadingClientes ? (
            <div>Consultando clientes en hostal...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Habitación</th>
                </tr>
              </thead>
              <tbody>
                {clientesActivos.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No hay clientes alojados en la fecha seleccionada.
                    </td>
                  </tr>
                ) : (
                  clientesActivos.map((c, i) => (
                    <tr key={i}>
                      <td>{c.nombreApellidos}</td>
                      <td><strong>Hab. {c.numeroHabitacion}</strong></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

     
      {activeTab === 'ama-habitaciones' && (
        <div className={styles.card}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Seleccionar Personal:</label>
            <select
              className={styles.inputDate}
              value={selectedAmaId}
              onChange={(e) => handleSelectAma(e.target.value)}
            >
              <option value="">-- Seleccionar Ama de Llaves --</option>
              {amas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombreApellidos}
                </option>
              ))}
            </select>
          </div>

          {loadingHabsAma ? (
            <div>Cargando habitaciones asignadas...</div>
          ) : !selectedAmaId ? (
            <div style={{ color: 'var(--text-muted)' }}>Por favor elige un ama de llaves.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {habsAma.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No tiene habitaciones asignadas actualmente.
                    </td>
                  </tr>
                ) : (
                  habsAma.map((h) => (
                    <tr key={h.id}>
                      <td><strong>Hab. {h.numero}</strong></td>
                      <td>
                        {h.EstaFueraDeServicio ? (
                          <span style={{ color: 'var(--status-danger)' }}>Fuera de Servicio</span>
                        ) : (
                          <span style={{ color: 'var(--status-success)' }}>Operativa</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      
      {activeTab === 'disponibles' && (
        <div className={styles.card}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Entrada:</label>
            <input
              type="date"
              className={styles.inputDate}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Salida:</label>
            <input
              type="date"
              className={styles.inputDate}
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>

          {loadingDisp ? (
            <div>Buscando disponibilidad...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Habitación</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {disponibles.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No hay habitaciones disponibles para el rango seleccionado.
                    </td>
                  </tr>
                ) : (
                  disponibles.map((h) => (
                    <tr key={h.id}>
                      <td><strong>Hab. {h.numero}</strong></td>
                      <td>
                        <span style={{ color: 'var(--status-success)' }}>Disponible</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};