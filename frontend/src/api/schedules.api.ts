import type { ScheduleBlock } from "../types/schedule.types";
const KEY = "sihs_schedules"; const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
function read() { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as ScheduleBlock[]; }
export const schedulesApi = { list: () => read(), days, create(block: Omit<ScheduleBlock, "id">) { const items = read(); localStorage.setItem(KEY, JSON.stringify([...items, { ...block, id: crypto.randomUUID() }])); }, update(id: string, block: Omit<ScheduleBlock, "id">) { localStorage.setItem(KEY, JSON.stringify(read().map((item) => item.id === id ? { ...block, id } : item))); } };
