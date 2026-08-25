export type EnvironmentType = "REGULAR" | "ESPECIAL";
export type EnvironmentStatus = "DISPONIBLE" | "NO_DISPONIBLE";
export type Environment = { id: string; numero: number; sede: string; tipo: EnvironmentType; nombre: string; estado: EnvironmentStatus };
