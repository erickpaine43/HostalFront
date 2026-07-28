import { apiClient } from '../../shared/api/apiClient';
import type { ClienteDto, ClienteCrearDto } from './types';

export const clienteApi = {
  getClientes: (page = 1, search = '', filterCI = '') =>
    apiClient<ClienteDto[]>(
      `/Clientes?page=${page}&search=${encodeURIComponent(search)}&ci=${encodeURIComponent(filterCI)}`
    ),

  getClienteById: (id: number) =>
    apiClient<ClienteDto>(`/Clientes/${id}`),

  crearCliente: (data: ClienteCrearDto) =>
    apiClient<ClienteDto>('/Clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  actualizarCliente: (id: number, data: ClienteCrearDto) =>
    apiClient<ClienteDto>(`/Clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  eliminarCliente: (id: number) =>
    apiClient<void>(`/Clientes/${id}`, {
      method: 'DELETE',
    }),
};