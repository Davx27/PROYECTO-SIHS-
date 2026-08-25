import { authService } from "../services/auth.service";
import type { LoginRequest } from "../types/auth";
import type { RegisterRequest } from "../services/auth.service";

export const authApi = {
	login: (payload: LoginRequest) => authService.login(payload),
	register: (payload: RegisterRequest) => authService.register(payload),
	requestRecovery: (correo: string) => authService.requestRecovery(correo),
	resetPassword: (correo: string, code: string, password: string) => authService.resetPassword(correo, code, password),
	logout: () => authService.logout(),
	currentUser: () => authService.currentUser(),
};
