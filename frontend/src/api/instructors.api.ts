import type { User } from "../types/user.types";
const CODES_KEY = "sihs_instructor_codes";
function codes() { return JSON.parse(localStorage.getItem(CODES_KEY) ?? "[]") as string[]; }
export const instructorsApi = {
	list: () => JSON.parse(localStorage.getItem("sihs_users") ?? "[]").filter((user: User) => user.rol === "INSTRUCTOR") as User[],
	generateCode() { const code = `INS-${crypto.randomUUID().slice(0, 6).toUpperCase()}`; localStorage.setItem(CODES_KEY, JSON.stringify([...codes(), code])); return code; },
	isCodeValid: (code: string) => codes().includes(code),
};
