import type { Environment } from "../types/environment.types";

const KEY = "sihs_environments";
const initial: Environment[] = [
	{ id: "env-1", numero: 101, sede: "Centro principal", tipo: "REGULAR", nombre: "Ambiente", estado: "DISPONIBLE" },
	{ id: "env-2", numero: 204, sede: "Centro principal", tipo: "ESPECIAL", nombre: "Laboratorio de redes", estado: "DISPONIBLE" },
];
function read() { return JSON.parse(localStorage.getItem(KEY) ?? JSON.stringify(initial)) as Environment[]; }
function write(items: Environment[]) { localStorage.setItem(KEY, JSON.stringify(items)); return items; }
export const environmentsApi = {
	list: () => read().sort((a, b) => a.numero - b.numero),
	create(environment: Omit<Environment, "id">) {
		const items = read();
		if (items.some((item) => item.numero === environment.numero && item.sede.toLowerCase() === environment.sede.toLowerCase())) throw new Error("Ya existe un ambiente con ese número en la sede.");
		return write([...items, { ...environment, nombre: environment.tipo === "REGULAR" ? "Ambiente" : environment.nombre, id: crypto.randomUUID() }]);
	},
	update(id: string, environment: Omit<Environment, "id">) {
		const items = read();
		if (items.some((item) => item.id !== id && item.numero === environment.numero && item.sede.toLowerCase() === environment.sede.toLowerCase())) throw new Error("Ya existe un ambiente con ese número en la sede.");
		return write(items.map((item) => item.id === id ? { ...environment, id, nombre: environment.tipo === "REGULAR" ? "Ambiente" : environment.nombre } : item));
	},
};
