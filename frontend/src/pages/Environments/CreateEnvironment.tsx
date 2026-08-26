import { useState } from "react"; import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { environmentsApi } from "../../api/environments.api";
import type { EnvironmentType } from "../../types/environment.types";

export default function CreateEnvironment() {
	const { id } = useParams(); const existing = id ? environmentsApi.list().find((environment) => environment.id === id) : undefined;
	const [form, setForm] = useState(existing ? { ...existing, numero: String(existing.numero) } : { numero: "", sede: "Centro principal", tipo: "REGULAR" as EnvironmentType, nombre: "", estado: "DISPONIBLE" as const });
	const [error, setError] = useState(""); const navigate = useNavigate();
	if (id && !existing) return <><Navbar /><main className="page-shell"><h1>Ambiente no encontrado</h1><Link to="/environments">Volver a ambientes</Link></main></>;
	function submit(event: FormEvent) { event.preventDefault(); try { const payload = { ...form, numero: Number(form.numero) }; if (id) environmentsApi.update(id, payload); else environmentsApi.create(payload); navigate("/environments"); } catch (reason) { setError(reason instanceof Error ? reason.message : "No fue posible guardar el ambiente."); } }
	return <><Navbar /><main className="page-shell"><Link to="/environments">Volver a ambientes</Link><h1>{id ? "Editar ambiente" : "Registrar ambiente"}</h1><form onSubmit={submit} className="form-panel"><Input label="Número del ambiente" type="number" value={form.numero} onChange={(event) => setForm({ ...form, numero: event.target.value })} required /><Input label="Sede" value={form.sede} onChange={(event) => setForm({ ...form, sede: event.target.value })} required /><Select label="Tipo de ambiente" value={form.tipo} onChange={(event) => setForm({ ...form, tipo: event.target.value as EnvironmentType })} options={[{ value: "REGULAR", label: "Regular" }, { value: "ESPECIAL", label: "Especial" }]} /><Input label="Nombre del ambiente" value={form.tipo === "REGULAR" ? "Ambiente" : form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} disabled={form.tipo === "REGULAR"} required /><Select label="Estado" value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value as "DISPONIBLE" })} options={[{ value: "DISPONIBLE", label: "Disponible" }, { value: "NO_DISPONIBLE", label: "No disponible" }]} />{error && <p className="error">{error}</p>}<Button>{id ? "Guardar cambios" : "Guardar ambiente"}</Button></form></main></>;
}
