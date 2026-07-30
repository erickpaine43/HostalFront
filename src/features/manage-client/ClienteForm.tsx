import React, { useState } from 'react';
import { clienteApi } from '../../entities/cliente/api';
import type { ClienteDto, ClienteCrearDto } from '../../entities/cliente/types';
import styles from './ClienteForm.module.css';

interface ClienteFormProps {
  initialData?: ClienteDto | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// 1. Constantes de Regex para reflejar las Data Annotations del backend
const REGEX_NOMBRE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const REGEX_CI = /^\d{11}$/;
const REGEX_TELEFONO = /^\+?[1-9]\d{6,14}$/;

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

    const nombreClean = nombreApellidos.trim();
    const ciClean = ci.trim();
    const telefonoClean = numeroTelefono.trim();

    // 2. Validaciones locales en el cliente antes de tocar la red
    if (!nombreClean || !ciClean || !telefonoClean) {
      setError('Todos los campos obligatorios deben ser completados.');
      return;
    }

    if (!REGEX_NOMBRE.test(nombreClean)) {
      setError('El nombre solo debe contener letras y espacios.');
      return;
    }

    if (!REGEX_CI.test(ciClean)) {
      setError('El CI debe contener exactamente 11 dígitos numéricos.');
      return;
    }

    if (!REGEX_TELEFONO.test(telefonoClean)) {
      setError('Ingrese un número de teléfono válido con su código de país (Ejemplo: +5351234567 o +13055550123).');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload: ClienteCrearDto = {
        nombreApellidos: nombreClean,
        ci: ciClean,
        numeroTelefono: telefonoClean,
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
              inputMode="numeric"
              maxLength={11}
              className={styles.input}
              value={ci}
              onChange={(e) => setCi(e.target.value.replace(/\D/g, ''))} // 3. Filtra letras en tiempo real
              placeholder="Ej. 95081212345"
              required
            />
          </label>

          <label className={styles.label}>
            Número Telefónico:
            <input
              type="tel"
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