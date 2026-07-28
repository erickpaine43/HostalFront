import { apiClient } from '../../shared/api/apiClient';
import type { HabitacionDto, HabitacionCrearDto } from './types';

export const habitacionApi = {
  getHabitaciones: () =>
    apiClient<HabitacionDto[]>('/Habitaciones'),

  getHabitacionById: (id: number) =>
    apiClient<HabitacionDto>(`/Habitaciones/${id}`),

  crearHabitacion: (data: HabitacionCrearDto) =>
    apiClient<HabitacionDto>('/Habitaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  actualizarHabitacion: (id: number, data: HabitacionCrearDto) =>
    apiClient<HabitacionDto>(`/Habitaciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  toggleFueraDeServicio: (id: number) =>
    apiClient<string>(`/Habitaciones/${id}`, {
      method: 'DELETE',
    }),

  asignarAmaDeLlaves: (habitacionId: number, amaDeLlavesId: number) =>
    apiClient<void>(`/Habitaciones/${habitacionId}/asignar-ama/${amaDeLlavesId}`, {
      method: 'POST',
    }),

  desasignarAmaDeLlaves: (habitacionId: number, amaDeLlavesId: number) =>
    apiClient<string>(`/Habitaciones/${habitacionId}/desasignar-ama/${amaDeLlavesId}`, {
      method: 'DELETE',
    }),
};