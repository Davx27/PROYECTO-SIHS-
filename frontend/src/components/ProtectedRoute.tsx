import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../services/auth.service";
import type { Role } from "../types/auth";

export default function ProtectedRoute({ children, allowedRoles }: { children?: ReactNode; allowedRoles?: Role[] }) {
	const user = authService.currentUser();
	if (!user) return <Navigate to="/login" replace />;
	if (allowedRoles && !allowedRoles.includes(user.rol)) return <Navigate to="/dashboard" replace />;
	return children ?? <Outlet />;
}
