import type { User } from "../types/user.types";
const KEY = "sihs_users"; function read() { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as User[]; }
export const usersApi = { list: () => read().filter((user) => user.rol !== "COORDINADOR"), update(id: string, user: Omit<User, "id">) { localStorage.setItem(KEY, JSON.stringify(read().map((item) => item.id === id ? { ...user, id } : item))); } };
