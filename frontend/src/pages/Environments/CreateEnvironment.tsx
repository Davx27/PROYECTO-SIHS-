import { useState } from "react"; import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { environmentsApi } from "../../api/environments.api";
import type { EnvironmentType } from "../../types/environment.types";

export default function CreateEnvironment() {
	const [form, setForm] = useState({ numero: "", sede: "Centro principal", tipo: "REGULAR" as EnvironmentType, nombre: "", estado: "DISPONIBLE" as const });
	const [error, setError] = useState(""); const navigate = useNavigate();
	function submit(event: FormEvent) { event.preventDefault(); try { environmentsApi.create({ ...form, numero: Number(form.numero) }); navigate("/environments"); } catch (reason) { setError(reason instanceof Error ? reason.message : "No fue posible guardar el ambiente."); } }
	return <><Navbar /><main className="page-shell"><Link to="/environments">Volver a ambientes</Link><h1>Registrar ambiente</h1><form onSubmit={submit} className="form-panel"><Input label="Número del ambiente" type="number" value={form.numero} onChange={(event) => setForm({ ...form, numero: event.target.value })} required /><Input label="Sede" value={form.sede} onChange={(event) => setForm({ ...form, sede: event.target.value })} required /><Select label="Tipo de ambiente" value={form.tipo} onChange={(event) => setForm({ ...form, tipo: event.target.value as EnvironmentType })} options={[{ value: "REGULAR", label: "Regular" }, { value: "ESPECIAL", label: "Especial" }]} /><Input label="Nombre del ambiente" value={form.tipo === "REGULAR" ? "Ambiente" : form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} disabled={form.tipo === "REGULAR"} required /><Select label="Estado" value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value as "DISPONIBLE" })} options={[{ value: "DISPONIBLE", label: "Disponible" }, { value: "NO_DISPONIBLE", label: "No disponible" }]} />{error && <p className="error">{error}</p>}<Button>Guardar ambiente</Button></form></main></>;
}
