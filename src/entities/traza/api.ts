import { apiClient } from '../../shared/api/apiClient';
import type { TrazaDto, ClienteActivoReporteDto } from './types';
import type { HabitacionDto } from '../habitacion/types';

export interface PagedResponse<T> {
  total: number;
  pagina: number;
  tamanioPagina: number;
  totalPaginas: number;
  datos: T[];
}

export const reportesAndTrazasApi = {
  getTrazas: (page = 1, pageSize = 10) =>
    apiClient<PagedResponse<TrazaDto>>(
      `/Consultas/auditoria-trazas?page=${page}&pageSize=${pageSize}`
    ),

  getClientesActivosPorDia: (fecha: string) =>
    apiClient<ClienteActivoReporteDto[]>(`/Consultas/clientes-activos?dia=${fecha}`),

  getHabitacionesPorAmaDeLlaves: (amaId: number) =>
    apiClient<HabitacionDto[]>(`/Consultas/por-ama-de-llaves/${amaId}`),

  getHabitacionesDisponibles: (fechaInicio: string, fechaFin: string) =>
    apiClient<HabitacionDto[]>(
      `/Consultas/habitaciones-disponibles?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    ),
};