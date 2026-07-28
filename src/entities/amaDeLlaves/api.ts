import { apiClient } from '../../shared/api/apiClient';
import type { AmaDeLlavesDto, AmaDeLlavesCrearDto } from './types';

export const amaDeLlavesApi = {
  getAmasDeLlaves: () =>
    apiClient<AmaDeLlavesDto[]>('/AmasDeLlaves'),

  getAmaDeLlavesById: (id: number) =>
    apiClient<AmaDeLlavesDto>(`/AmasDeLlaves/${id}`),

  crearAmaDeLlaves: (data: AmaDeLlavesCrearDto) =>
    apiClient<AmaDeLlavesDto>('/AmasDeLlaves', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  actualizarAmaDeLlaves: (id: number, data: AmaDeLlavesCrearDto) =>
    apiClient<AmaDeLlavesDto>(`/AmasDeLlaves/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  eliminarAmaDeLlaves: (id: number) =>
    apiClient<void>(`/AmasDeLlaves/${id}`, {
      method: 'DELETE',
    }),
};