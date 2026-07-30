import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../shared/ui/Button/Button';
import { ClienteForm } from '../features/manage-client/ClienteForm';
import { clienteApi } from '../entities/cliente/api';
import type { ClienteDto } from '../entities/cliente/types';
import styles from './ClientesPage.module.css';

export const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState('');
  const [filterCi, setFilterCi] = useState('');

  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState<ClienteDto | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const loadClientes = useCallback(async () => {
    try {
      const response = await clienteApi.getClientes(page, pageSize, search, filterCi);
      setClientes(response?.datos || []);
      setTotalPages(response?.totalPaginas || 1);
      setTotalItems(response?.total || 0);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setClientes([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, filterCi]);

  useEffect(() => {
    let isMounted = true;

    const fetchClientes = async () => {
      try {
        const response = await clienteApi.getClientes(page, pageSize, search, filterCi);
        if (isMounted) {
          setClientes(response?.datos || []);
          setTotalPages(response?.totalPaginas || 1);
          setTotalItems(response?.total || 0);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error al cargar clientes:', err);
          setClientes([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchClientes();

    return () => {
      isMounted = false;
    };
  }, [page, pageSize, search, filterCi]);

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

      const errorMessage =
        err instanceof Error ? err.message : 'No se pudo eliminar el cliente.';

      setErrorGeneral(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterCiChange = (value: string) => {
    setFilterCi(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setFilterCi('');
    setPage(1);
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <h2>Directorio de Clientes</h2>
        <Button onClick={() => { setErrorGeneral(null); setIsCrearModalOpen(true); }}>
          + Registrar Cliente
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '12px', margin: '16px 0', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, CI o teléfono"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{ flex: '1 1 200px' }}
        />

        <input
          type="text"
          placeholder="Filtrar por CI"
          value={filterCi}
          onChange={(e) => handleFilterCiChange(e.target.value)}
          style={{ flex: '1 1 150px' }}
        />

        <Button onClick={clearFilters}>
          Limpiar
        </Button>
      </div>

      {errorGeneral && (
        <div
          className={styles.errorBanner}
          style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '12px 16px',
            borderRadius: '8px',
            margin: '16px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #ef9a9a',
          }}
        >
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
        <>
          <div className={styles.tableContainer}>
            <div className="responsive-table-container">
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
                        <td>{c.esVIP ? 'VIP (-10%)' : 'Estándar'}</td>
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
          </div>

          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Mostrando {clientes.length} de {totalItems} clientes
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