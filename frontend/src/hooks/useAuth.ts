import { useState } from "react";
import { authService } from "../services/auth.service";
import type { AuthUser, LoginRequest } from "../types/auth";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  async function login(request: LoginRequest): Promise<AuthUser> {
    setLoading(true);
    try { return await authService.login(request); } finally { setLoading(false); }
  }
  return { login, loading, user: authService.currentUser(), logout: authService.logout };
}
