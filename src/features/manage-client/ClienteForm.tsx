import React, { useState } from 'react';
import { clienteApi } from '../../entities/cliente/api';
import type { ClienteDto, ClienteCrearDto } from '../../entities/cliente/types';
import styles from './ClienteForm.module.css';

interface ClienteFormProps {
  initialData?: ClienteDto | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const [nombreApellidos, setNombreApellidos] = useState(
    () => initialData?.nombreApellidos || ''
  );
  const [ci, setCi] = useState(
    () => initialData?.ci || ''
  );
  const [numeroTelefono, setNumeroTelefono] = useState(
    () => initialData?.numeroTelefono || ''
  );
  const [esVIP, setEsVIP] = useState(
    () => initialData?.esVIP || false
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreApellidos.trim() || !ci.trim() || !numeroTelefono.trim()) {
      setError('Todos los campos obligatorios deben ser completados.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload: ClienteCrearDto = {
        nombreApellidos: nombreApellidos.trim(),
        ci: ci.trim(),
        numeroTelefono: numeroTelefono.trim(),
        esVIP: Boolean(esVIP),
      };

      if (initialData?.id) {
        await clienteApi.actualizarCliente(initialData.id, payload);
      } else {
        await clienteApi.crearCliente(payload);
      }

      onSuccess();
    } catch (err: unknown) {
    
      const errorObj = err as { response?: { data?: { mensaje?: string; title?: string } }; message?: string };
      const mensajeServidor = 
        errorObj?.response?.data?.mensaje || 
        errorObj?.response?.data?.title || 
        errorObj?.message;

      if (mensajeServidor && mensajeServidor.includes('CI')) {
        setError('El CI introducido ya pertenece a otro cliente registrado.');
      } else if (mensajeServidor) {
        setError(mensajeServidor);
      } else {
        setError('Error al guardar el cliente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>
          {initialData ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h3>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Nombre y Apellidos:
            <input
              type="text"
              className={styles.input}
              value={nombreApellidos}
              onChange={(e) => setNombreApellidos(e.target.value)}
              placeholder="Ej. Carlos Pérez"
              required
            />
          </label>

          <label className={styles.label}>
            Carnet de Identidad (CI):
            <input
              type="text"
              className={styles.input}
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              placeholder="Ej. 95081212345"
              required
            />
          </label>

          <label className={styles.label}>
            Número Telefónico:
            <input
              type="text"
              className={styles.input}
              value={numeroTelefono}
              onChange={(e) => setNumeroTelefono(e.target.value)}
              placeholder="Ej. +5352345678"
              required
            />
          </label>

          <label className={styles.label} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={esVIP}
              onChange={(e) => setEsVIP(e.target.checked)}
            />
            Cliente VIP (10% de descuento)
          </label>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onCancel}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};