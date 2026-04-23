export interface User {
  id: number;
  dni: number;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
}

export interface Account {
  id: number;
  user_id: number;
  available_amount: number;
  cvu: string;
  alias: string;
}

export interface Transaction {
  id: number;
  account_id: number;
  amount: number;
  dated: string;
  description: string;
  destination: string;
  origin: string;
  type: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
}

export interface Card {
  id: number;
  account_id: number;
  number_id: number;
  first_last_name: string;
  cod: number;
  expiration_date: string;
}

export interface CardRequest {
  number_id: number;
  first_last_name: string;
  cod: number;
  expiration_date: string;
}

export interface TransferenceRequest {
  amount: number;
  dated: string;
  destination: string;
  origin: string;
}

export interface Service {
  id: number;
  name: string;
  date: string;
}

export interface Company {
  id: number;
  name: string;
  date: string;
  invoice_value: number;
}

export interface TransactionRequest {
  amount: number;
  dated: string;
  description: string;
}
