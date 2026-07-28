import { apiClient } from '../../shared/api/apiClient';
import type { TrazaDto, ClienteActivoReporteDto } from './types';
import type { HabitacionDto } from '../habitacion/types';

export const reportesAndTrazasApi = {
  getTrazas: () =>
    apiClient<TrazaDto[]>('/Consultas/auditoria-trazas'),

  getClientesActivosPorDia: (fecha: string) =>
    apiClient<ClienteActivoReporteDto[]>(`/Consultas/clientes-activos?dia=${fecha}`),

  getHabitacionesPorAmaDeLlaves: (amaId: number) =>
    apiClient<HabitacionDto[]>(`/Consultas/por-ama-de-llaves/${amaId}`),

  getHabitacionesDisponibles: (fechaInicio: string, fechaFin: string) =>
    apiClient<HabitacionDto[]>(`/Consultas/habitaciones-disponibles?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`),
};