export interface User {
  id: number;
  account_id: number;
  dni: number;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
}
