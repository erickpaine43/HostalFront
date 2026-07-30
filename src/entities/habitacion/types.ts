export interface HabitacionDto {
  id: number;
  numero: string;
  EstaFueraDeServicio: boolean;
  amasDeLlavesIds?: number[];
  amasDeLlavesNombres?: string[];
}

export interface HabitacionCrearDto {
  numero: string;
  EstaFueraDeServicio: boolean;
}