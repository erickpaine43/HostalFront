import React, { useState, useEffect, useMemo, type FormEvent } from 'react';
import { Button } from '../../shared/ui/Button/Button';
import { Input } from '../../shared/ui/Input/Input';
import { reservaApi } from '../../entities/reserva/api';
import { reportesAndTrazasApi } from '../../entities/traza/api';
import { clienteApi } from '../../entities/cliente/api';
import type { ClienteDto } from '../../entities/cliente/types';
import type { HabitacionDto } from '../../entities/habitacion/types';
import type { ReservaDto } from '../../entities/reserva/types';
import styles from './ReservaForm.module.css';

interface ReservaFormProps {
  reservaInicial?: ReservaDto;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ReservaForm: React.FC<ReservaFormProps> = ({ reservaInicial, onSuccess, onCancel }) => {
  const [clientes, setClientes] = useState<ClienteDto[]>([]);
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState<HabitacionDto[]>([]);

  const initialHabitacion = reservaInicial?.habitacionNumero ? Number(reservaInicial.habitacionNumero) : '';
  const initialCliente = reservaInicial?.clienteId ? Number(reservaInicial.clienteId) : '';

  const [clienteId, setClienteId] = useState<number | ''>(initialCliente);
  const [habitacionId, setHabitacionId] = useState<number | ''>(initialHabitacion);
  
  const formatDateForInput = (dateStr?: string | Date) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  const [fechaEntrada, setFechaEntrada] = useState(formatDateForInput(reservaInicial?.fechaEntrada));
  const [fechaSalida, setFechaSalida] = useState(formatDateForInput(reservaInicial?.fechaSalida));

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clienteApi.getClientes(1, 100, '')
      .then((res) => {
        setClientes(Array.isArray(res) ? res : []);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (fechaEntrada && fechaSalida) {
      reportesAndTrazasApi.getHabitacionesDisponibles(fechaEntrada, fechaSalida)
        .then((habs) => {
          let listaHabs = Array.isArray(habs) ? habs : [];
          if (reservaInicial && reservaInicial.habitacionNumero) {
            const numHab = Number(reservaInicial.habitacionNumero);
            const yaExiste = listaHabs.some(h => Number(h.numero) === numHab);
            if (!yaExiste) {
              listaHabs = [{ id: numHab, numero: numHab, estaFueraDeServicio: false, tipo: '', precioPorNoche: 10 }, ...listaHabs] as HabitacionDto[];
            }
          }
          setHabitacionesDisponibles(listaHabs);
        })
        .catch(() => setHabitacionesDisponibles([]));
    }
  }, [fechaEntrada, fechaSalida, reservaInicial]);

  const calculoReserva = useMemo(() => {
    if (!fechaEntrada || !fechaSalida) return { dias: 0, total: 0, descuentoVip: false };

    const inicio = new Date(fechaEntrada);
    const fin = new Date(fechaSalida);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime()) || fin < inicio) {
      return { dias: 0, total: 0, descuentoVip: false };
    }

    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const dias = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const clienteSeleccionado = clientes.find((c) => c.id === Number(clienteId));
    const descuentoVip = Boolean(clienteSeleccionado?.esVIP);

    let total = dias * 10;
    if (descuentoVip) {
      total = total * 0.9;
    }

    return { dias, total, descuentoVip };
  }, [fechaEntrada, fechaSalida, clienteId, clientes]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fechaEntrada || !fechaSalida || !clienteId || !habitacionId) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (calculoReserva.dias < 3) {
      setError(`El período mínimo de reservación es de 3 días (has seleccionado ${calculoReserva.dias} día/s).`);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fechaEntrada,
        fechaSalida,
        clienteId: Number(clienteId),
        habitacionNumero: Number(habitacionId),
      };

      if (reservaInicial) {
        await reservaApi.actualizarReserva(reservaInicial.id, payload);
      } else {
        await reservaApi.crearReserva(payload);
      }
      onSuccess();
    } catch (err: unknown) {
      console.error('Error detallado al procesar reserva:', err);
      if (err instanceof Error) {
        const mensajeLimpio = err.message.replace(/^Error \d+:\s*/, '');
        setError(mensajeLimpio);
      } else {
        setError('Error al procesar la reserva.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.row}>
        <Input
          label="Fecha de Entrada"
          type="date"
          value={fechaEntrada}
          onChange={(e) => setFechaEntrada(e.target.value)}
          required
        />
        <Input
          label="Fecha de Salida"
          type="date"
          value={fechaSalida}
          onChange={(e) => setFechaSalida(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Cliente</label>
        <select
          className={styles.select}
          value={clienteId}
          onChange={(e) => setClienteId(Number(e.target.value))}
          required
        >
          <option value="">-- Seleccionar Cliente --</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombreApellidos} {c.esVIP ? '(VIP)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Habitación Disponible</label>
        <select
          className={styles.select}
          value={habitacionId}
          onChange={(e) => setHabitacionId(Number(e.target.value))}
          disabled={!fechaEntrada || !fechaSalida}
          required
        >
          <option value="">
            {!fechaEntrada || !fechaSalida
              ? '-- Seleccione primero el rango de fechas --'
              : '-- Seleccionar Habitación --'}
          </option>
          {habitacionesDisponibles.map((h) => (
            <option key={h.numero} value={h.numero}>
              Habitación {String(h.numero).padStart(3, '0')}
            </option>
          ))}
        </select>
      </div>

      {calculoReserva.dias > 0 && (
        <div className={styles.summaryCard}>
          <div>
            <span>Días calculados:</span> <strong>{calculoReserva.dias} días</strong>
          </div>
          <div>
            <span>Importe estimado:</span>{' '}
            <strong className={styles.totalText}>
              ${calculoReserva.total.toFixed(2)} USD
            </strong>
            {calculoReserva.descuentoVip && (
              <span className={styles.badgeVip}>10% desc. VIP aplicado</span>
            )}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={loading}>
          {reservaInicial ? 'Guardar Cambios' : 'Confirmar Reserva'}
        </Button>
      </div>
    </form>
  );
};