import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../shared/ui/Button/Button';
import { ClienteForm } from '../features/manage-client/ClienteForm';
import { clienteApi } from '../entities/cliente/api';
import type { ClienteDto } from '../entities/cliente/types';
import styles from './ClientesPage.module.css';

export const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState<ClienteDto | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const loadClientes = useCallback(async () => {
    try {
      const data = await clienteApi.getClientes(1, '', '');
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    clienteApi.getClientes(1, '', '')
      .then((data) => {
        if (isMounted) {
          setClientes(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error al cargar clientes:', err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [loadClientes]);

  
  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al cliente "${nombre}"?`)) {
      return;
    }

    try {
      setErrorGeneral(null);
      setDeletingId(id);
      await clienteApi.eliminarCliente(id);
      await loadClientes();
    } catch (err: unknown) {
      console.error('Error al eliminar cliente:', err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'No se pudo eliminar el cliente.';

      setErrorGeneral(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Directorio de Clientes</h2>
        <Button onClick={() => { setErrorGeneral(null); setIsCrearModalOpen(true); }}>
          + Registrar Cliente
        </Button>
      </div>

      {errorGeneral && (
        <div className={styles.errorBanner} style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          margin: '16px 0', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          border: '1px solid #ef9a9a'
        }}>
          <span>{errorGeneral}</span>
          <button 
            onClick={() => setErrorGeneral(null)} 
            style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#c62828' }}
          >
            &times;
          </button>
        </div>
      )}

      {loading ? (
        <div>Cargando directorio de clientes...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre y Apellidos</th>
                <th>Carnet de Identidad (CI)</th>
                <th>Teléfono</th>
                <th>Tipo</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay clientes registrados en la base de datos.
                  </td>
                </tr>
              ) : (
                clientes.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.nombreApellidos}</td>
                    <td>{c.ci}</td>
                    <td>{c.numeroTelefono}</td>
                    <td>{c.esVIP ? ' VIP (-10%)' : 'Estándar'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <Button onClick={() => { setErrorGeneral(null); setClienteAEditar(c); }}>
                          Modificar
                        </Button>
                        <Button 
                          onClick={() => handleDelete(c.id, c.nombreApellidos)}
                          disabled={deletingId === c.id}
                        >
                          {deletingId === c.id ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isCrearModalOpen && (
        <ClienteForm
          onSuccess={() => {
            setIsCrearModalOpen(false);
            loadClientes();
          }}
          onCancel={() => setIsCrearModalOpen(false)}
        />
      )}

      {clienteAEditar && (
        <ClienteForm
          initialData={clienteAEditar}
          onSuccess={() => {
            setClienteAEditar(null);
            loadClientes();
          }}
          onCancel={() => setClienteAEditar(null)}
        />
      )}
    </div>
  );
};