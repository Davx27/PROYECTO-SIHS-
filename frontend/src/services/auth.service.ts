import type { AuthUser, LoginRequest, Role } from "../types/auth";

export type RegisterRequest = {
  nombres: string; apellidos: string; documento: string; tipoDocumento: string;
  correo: string; telefono: string; password: string; rol: Role;
  codigoInstructor?: string; especialidad?: string; codigoFicha?: string; programaFormacion?: string;
};

type StoredUser = AuthUser & { password: string; telefono: string };
const USERS_KEY = "sihs_users";
const SESSION_KEY = "sihs_user";
const INSTRUCTOR_CODES_KEY = "sihs_instructor_codes";

function users(): StoredUser[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[];
}

export const authService = {
  async login(request: LoginRequest) {
    const documento = request.documento.trim();
    const user = users().find((item) => item.documento === documento && item.password === request.password);
    if (!user) throw new Error("Credenciales inválidas.");
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },
  async register(request: RegisterRequest) {
    const current = users();
    const documento = request.documento.trim();
    const correo = request.correo.trim().toLowerCase();
    if (current.some((item) => item.documento === documento || item.correo.toLowerCase() === correo)) throw new Error("El documento o correo ya está registrado.");
    if (request.rol === "INSTRUCTOR") {
      const codes = JSON.parse(localStorage.getItem(INSTRUCTOR_CODES_KEY) ?? "[]") as string[];
      if (!request.codigoInstructor || !codes.includes(request.codigoInstructor)) throw new Error("El código de instructor no es válido.");
    }
    if (request.rol === "APRENDIZ" && (!request.codigoFicha || !request.programaFormacion)) throw new Error("La ficha y el programa de formación son obligatorios.");
    const user: StoredUser = { ...request, documento, nombres: request.nombres.trim(), apellidos: request.apellidos.trim(), correo, rol: request.rol, telefono: request.telefono.trim(), password: request.password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...current, user]));
  },
  async requestRecovery(correo: string) {
    if (!users().some((user) => user.correo === correo)) throw new Error("No existe una cuenta con ese correo.");
    sessionStorage.setItem("sihs_recovery_code", "123456");
  },
  async resetPassword(correo: string, code: string, password: string) {
    if (code !== (sessionStorage.getItem("sihs_recovery_code") ?? "")) throw new Error("El código de recuperación es incorrecto.");
    const updated = users().map((user) => user.correo === correo ? { ...user, password } : user);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  },
  currentUser() { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null") as AuthUser | null; },
  logout() { localStorage.removeItem(SESSION_KEY); },
};
