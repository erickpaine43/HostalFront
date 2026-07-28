export interface ClienteDto {
  id: number;
  nombreApellidos: string;
  ci: string;
  numeroTelefono: string;
  esVIP?: boolean;
}

export interface ClienteCrearDto {
  nombreApellidos: string;
  ci: string;
  numeroTelefono: string;
  esVIP?: boolean;
}

export interface ClientePaginatedResponse {
  items: ClienteDto[];
  totalItems: number;
  page: number;
  pageSize: number;
}