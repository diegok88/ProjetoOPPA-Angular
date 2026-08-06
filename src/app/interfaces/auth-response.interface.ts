export interface AuthResponse {
  message: string;
  usuario?: { id: string; perfil: string; empresa: string };
}
