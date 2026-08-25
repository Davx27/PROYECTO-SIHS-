import { useState } from "react"; import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

export default function Navbar() {
	const navigate = useNavigate();
	function logout() { authService.logout(); navigate("/login"); }
	const user = authService.currentUser();
	const [query, setQuery] = useState("");
	function search(event: FormEvent) { event.preventDefault(); if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`); }
	const isCoordinator = user?.rol === "COORDINADOR";
	const roleLabel = user?.rol === "COORDINADOR" ? "Coordinador" : user?.rol === "INSTRUCTOR" ? "Instructor" : "Aprendiz";
	return <><aside className="sidebar"><Link className="brand" to="/dashboard"><span className="brand-mark">S</span><span>SIHS</span></Link><p className="brand-caption">Gestión de Horarios</p><nav><Link className="nav-active" to="/dashboard">▦ <span>Inicio</span></Link><Link to="/schedules">▣ <span>Horarios</span></Link><Link to="/environments">▤ <span>Ambientes</span></Link><Link to="/instructors">♙ <span>Instructores</span></Link><Link to="/fiches">♢ <span>Fichas</span></Link><Link to="/learning-results">▥ <span>Resultados</span></Link>{isCoordinator && <><Link to="/users">⚙ <span>Usuarios</span></Link><Link to="/instructors/code">＋ <span>Generar código</span></Link></>}</nav><button type="button" className="sidebar-logout" onClick={logout}>↪ <span>Cerrar sesión</span></button></aside><header className="topbar"><form className="global-search" onSubmit={search}><span aria-hidden="true">⌕</span><input aria-label="Buscar en el sistema" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar fichas, instructores, ambientes..." /><button type="submit">Buscar</button></form><div className="user-menu"><span className="avatar">{user?.nombres?.charAt(0) ?? "U"}</span><span className="user-details"><strong>{user?.nombres ?? "Usuario"}</strong><small>{roleLabel}</small></span></div></header></>;
}
