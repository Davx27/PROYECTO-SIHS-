export type Role = "COORDINADOR" | "INSTRUCTOR" | "APRENDIZ";

export type AuthUser = {
  documento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: Role;
};

export type LoginRequest = { documento: string; password: string };
