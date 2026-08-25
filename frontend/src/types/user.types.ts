import type { Role } from "./auth";
export type User = { id: string; nombres: string; apellidos: string; documento: string; correo: string; telefono: string; rol: Role; especialidad?: string; tipoContrato?: "PLANTA" | "CONTRATO" };
