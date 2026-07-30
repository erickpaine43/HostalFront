import { apiClient } from '../../shared/api/apiClient';
import type { ClienteDto, ClienteCrearDto } from './types';

export interface ClientePaginatedResponse {
  total: number;
  pagina: number;
  tamanioPagina: number;
  totalPaginas: number;
  datos: ClienteDto[];
}

export const clienteApi = {
  getClientes: (page = 1, pageSize = 10, search = '', ci = '') =>
    apiClient<ClientePaginatedResponse>(
      `/Clientes?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&ci=${encodeURIComponent(ci)}`
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