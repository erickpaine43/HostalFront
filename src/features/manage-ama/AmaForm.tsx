import React, { useState } from 'react';
import { amaDeLlavesApi } from '../../entities/amaDeLlaves/api';
import type { AmaDeLlavesDto, AmaDeLlavesCrearDto } from '../../entities/amaDeLlaves/types';
import styles from './AmaForm.module.css';

interface AmaFormProps {
  initialData?: AmaDeLlavesDto | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AmaForm: React.FC<AmaFormProps> = ({
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

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreApellidos.trim() || !ci.trim()) {
      setError('Nombre y CI son obligatorios.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload: AmaDeLlavesCrearDto = {
        nombreApellidos: nombreApellidos.trim(),
        ci: ci.trim(),
        numeroTelefono: numeroTelefono.trim(),
      };

      if (initialData?.id) {
        await amaDeLlavesApi.actualizarAmaDeLlaves(initialData.id, payload);
      } else {
        await amaDeLlavesApi.crearAmaDeLlaves(payload);
      }

      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error al guardar los datos.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>
          {initialData ? 'Editar Ama de Llaves' : 'Registrar Ama de Llaves'}
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
              placeholder="Ej. Ana García"
              required
            />
          </label>

          <label className={styles.label}>
            CI:
            <input
              type="text"
              className={styles.input}
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              placeholder="Ej. 12345678"
              required
            />
          </label>

          <label className={styles.label}>
            Teléfono:
            <input
              type="text"
              className={styles.input}
              value={numeroTelefono}
              onChange={(e) => setNumeroTelefono(e.target.value)}
              placeholder="Ej. +34600000000"
            />
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