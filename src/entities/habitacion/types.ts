export interface HabitacionDto {
  id: number;
  numero: string;
  estaFueraDeServicio: boolean;
  amasDeLlavesIds?: number[];
  amasDeLlavesNombres?: string[];
}

export interface HabitacionCrearDto {
  numero: string;
  estaFueraDeServicio: boolean;
}