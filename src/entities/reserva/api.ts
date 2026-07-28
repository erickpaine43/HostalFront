import { apiClient } from '../../shared/api/apiClient';
import type { 
  ReservaDto, 
  ReservaCrearDto, 
  CancelarReservaDto, 
  CambiarHabitacionDto 
} from './types';

export const reservaApi = {
  getReservas: (page = 1) =>
    apiClient<ReservaDto[]>(`/Reservas?page=${page}`),

  getReservaById: (id: number) =>
    apiClient<ReservaDto>(`/Reservas/${id}`),

  crearReserva: (data: ReservaCrearDto) =>
    apiClient<ReservaDto>('/Reservas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  actualizarReserva: (id: number, data: Partial<ReservaCrearDto>) =>
    apiClient<ReservaDto>(`/Reservas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  cancelarReserva: (id: number, data: CancelarReservaDto) =>
    apiClient<void>(`/Reservas/${id}/cancelar`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  checkinReserva: (id: number) =>
    apiClient<void>(`/Reservas/${id}/checkin`, {
      method: 'POST',
    }),

  cambiarHabitacion: (id: number, data: CambiarHabitacionDto) =>
    apiClient<void>(`/Reservas/${id}/cambiar-habitacion`, {
      method: 'POST',
      body: data.NuevaHabitacionId.toString(),
    }),
};