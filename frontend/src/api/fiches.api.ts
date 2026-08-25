import type { Fiche } from "../types/fiche.types";
const KEY = "sihs_fiches";
function read() { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Fiche[]; }
function write(items: Fiche[]) { localStorage.setItem(KEY, JSON.stringify(items)); return items; }
export const fichesApi = { list: () => read().sort((a, b) => a.numero.localeCompare(b.numero)), create(fiche: Omit<Fiche, "id">) { const items = read(); if (items.some((item) => item.numero === fiche.numero)) throw new Error("El número de ficha ya está registrado."); return write([...items, { ...fiche, id: crypto.randomUUID() }]); }, update(id: string, fiche: Omit<Fiche, "id">) { const items = read(); if (items.some((item) => item.id !== id && item.numero === fiche.numero)) throw new Error("El número de ficha ya está registrado."); return write(items.map((item) => item.id === id ? { ...fiche, id } : item)); } };
