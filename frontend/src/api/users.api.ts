import type { User } from "../types/user.types";
const KEY = "sihs_users"; function read() { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as User[]; }
function normalizedUsers() { return read().map((user) => ({ ...user, id: user.id ?? user.documento })); }
export const usersApi = { list: () => normalizedUsers(), update(id: string, user: Omit<User, "id">) { localStorage.setItem(KEY, JSON.stringify(normalizedUsers().map((item) => item.id === id ? { ...user, id } : item))); } };
