import { apiClient } from '../../shared/api/apiClient';
import type {
  ReservaDto,
  ReservaCrearDto,
  CancelarReservaDto,
} from './types';

export interface PagedResponse<T> {
  total: number;
  pagina: number;
  tamanioPagina: number;
  totalPaginas: number;
  datos: T[];
}

export const reservaApi = {
  getReservas: (page = 1, pageSize = 10) =>
    apiClient<PagedResponse<ReservaDto>>(`/Reservas?page=${page}&pageSize=${pageSize}`),

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

  cambiarHabitacion: (reservaId: number, nuevaHabitacion: number) =>
  apiClient<string>(`/Reservas/${reservaId}/cambiar-habitacion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevaHabitacion),
  }),
};