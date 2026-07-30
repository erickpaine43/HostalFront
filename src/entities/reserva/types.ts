export interface ReservaDto {
  id: number;
  fechaReservacion: string;
  fechaEntrada: string;
  fechaSalida: string;
  importe: number;
  clienteId: number;
  clienteNombre: string;
  habitacionId: number | string;
  habitacionNumero: string | number;
  estaElClienteEnHostal: boolean;
  estaCancelada: boolean;
  fechaCancelacion?: string;
  motivoCancelacion?: string;
}

export interface ReservaCrearDto {
  fechaEntrada: string;
  fechaSalida: string;
  clienteId: number;
  habitacionNumero: number;
}

export interface CancelarReservaDto {
  Motivo: string;
}
