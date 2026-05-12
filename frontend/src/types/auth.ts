export interface User {
  id: number;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginResponse {
  token: string;
  user: User;
}
