-- Script de creación — Base de datos sistema_sihs (PostgreSQL / Supabase)
--
-- Fuente: Backend/app/modules/*/model.py (usuarios, roles, usuario_rol) +
-- MER SIHS.pdf + correcciones de AUDITORIA_TECNICA.md (especialidades,
-- programas con código único, y las FK de horarios que faltaban para poder
-- detectar cruces).
--
-- v2 (2026-08-23): se adopta Supabase Auth para autenticación en vez de un
-- JWT/hash de contraseña propio. Por eso:
--   * "usuarios" ya no guarda "password": Supabase Auth la administra.
--   * "usuarios"."idUsuario" pasa de SERIAL a UUID y referencia
--     auth.users(id) — Supabase Auth genera UUIDs, no enteros. Toda FK que
--     apuntaba a usuarios se actualiza al mismo tipo.
--   * "password_reset_tokens" se elimina: el flujo de recuperación por
--     correo ya lo cubre Supabase Auth, no hay que reconstruirlo.
--   * Este script asume que se ejecuta dentro de un proyecto Supabase (el
--     esquema "auth" con la tabla auth.users ya existe ahí de forma nativa).
--
-- Las columnas están en camelCase y comilladas ("idUsuario") porque así las
-- genera SQLAlchemy en Postgres. Si consultas a mano con psql, usa las
-- comillas: SELECT "idUsuario" FROM usuarios;
--
-- Uso (Supabase — SQL Editor del proyecto, o psql contra el connection
-- string que entregue la cuenta del proyecto):
--   psql "<connection string de Supabase>" -f 01_creacion.sql
--   psql "<connection string de Supabase>" -f 02_datos_prueba.sql

-- =========================================================
-- TIPOS ENUM
-- =========================================================
CREATE TYPE estado_usuario AS ENUM ('activo', 'inactivo');
CREATE TYPE tipo_sede AS ENUM ('principal', 'secundaria', 'alterna');
CREATE TYPE estado_trimestre AS ENUM ('planeado', 'activo', 'finalizado');

-- =========================================================
-- ROLES Y USUARIOS
-- =========================================================
CREATE TABLE roles (
    "idRol"  SERIAL PRIMARY KEY,
    "nombre" VARCHAR(50) UNIQUE NOT NULL
);

-- "usuarios" es la tabla de perfil (datos propios del dominio SIHS), no la
-- de autenticación: la contraseña, el email de login y la recuperación de
-- contraseña viven en auth.users, administradas por Supabase Auth.
CREATE TABLE usuarios (
    "idUsuario"     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    "nombre"        VARCHAR(100) NOT NULL,
    "email"         VARCHAR(100) UNIQUE NOT NULL,
    "estado"        estado_usuario DEFAULT 'activo',
    "fechaRegistro" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE usuario_rol (
    "idUsuario" UUID NOT NULL REFERENCES usuarios("idUsuario") ON DELETE CASCADE,
    "idRol"     INTEGER NOT NULL REFERENCES roles("idRol") ON DELETE CASCADE,
    PRIMARY KEY ("idUsuario", "idRol")
);

-- =========================================================
-- ESPECIALIDADES
-- Catálogo controlado y ampliable; un instructor puede tener varias.
-- =========================================================
CREATE TABLE especialidades (
    "idEspecialidad" SERIAL PRIMARY KEY,
    "nombre"         VARCHAR(100) UNIQUE NOT NULL,
    "descripcion"    VARCHAR(255),
    "activo"         BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE usuario_especialidad (
    "idUsuario"       UUID NOT NULL REFERENCES usuarios("idUsuario") ON DELETE CASCADE,
    "idEspecialidad"  INTEGER NOT NULL REFERENCES especialidades("idEspecialidad") ON DELETE CASCADE,
    PRIMARY KEY ("idUsuario", "idEspecialidad")
);

-- =========================================================
-- ESTRUCTURA ACADÉMICA
-- =========================================================
CREATE TABLE coordinaciones (
    "idCoordinacion"     SERIAL PRIMARY KEY,
    "nombreCoordinacion" VARCHAR(150) NOT NULL
);

-- codigoPrograma evita duplicados: el código oficial del SENA es único,
-- aunque el nombre se escriba distinto entre personas.
CREATE TABLE programas (
    "idPrograma"      SERIAL PRIMARY KEY,
    "codigoPrograma"  VARCHAR(20) UNIQUE NOT NULL,
    "nombrePrograma"  VARCHAR(150) UNIQUE NOT NULL,
    "nivelFormacion"  VARCHAR(30),
    "activo"          BOOLEAN NOT NULL DEFAULT TRUE,
    "idCoordinacion"  INTEGER NOT NULL REFERENCES coordinaciones("idCoordinacion")
);

CREATE TABLE trimestres (
    "idTrimestre" SERIAL PRIMARY KEY,
    "nombre"      VARCHAR(20) NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFin"    DATE NOT NULL,
    "estado"      estado_trimestre DEFAULT 'planeado'
);

CREATE TABLE fichas (
    "idFicha"      SERIAL PRIMARY KEY,
    "codigoFicha"  VARCHAR(50) UNIQUE NOT NULL,
    "idPrograma"   INTEGER NOT NULL REFERENCES programas("idPrograma"),
    "idTrimestre"  INTEGER NOT NULL REFERENCES trimestres("idTrimestre")
);

-- Relación ficha <-> usuario (aprendices matriculados y/o instructor líder)
CREATE TABLE ficha_usuario (
    "idFicha"   INTEGER NOT NULL REFERENCES fichas("idFicha") ON DELETE CASCADE,
    "idUsuario" UUID NOT NULL REFERENCES usuarios("idUsuario") ON DELETE CASCADE,
    PRIMARY KEY ("idFicha", "idUsuario")
);

-- =========================================================
-- COMPETENCIAS / RESULTADOS / ACTIVIDADES
-- =========================================================
CREATE TABLE competencias_formacion (
    "idCompetencia" SERIAL PRIMARY KEY,
    "codigo"        VARCHAR(50),
    "descripcion"   TEXT NOT NULL,
    "idPrograma"    INTEGER NOT NULL REFERENCES programas("idPrograma")
);

CREATE TABLE resultados_aprendizaje (
    "idResultado"   SERIAL PRIMARY KEY,
    "codigo"        VARCHAR(50),
    "descripcion"   TEXT NOT NULL,
    "idCompetencia" INTEGER NOT NULL REFERENCES competencias_formacion("idCompetencia")
        ON DELETE CASCADE
);

CREATE TABLE actividades_aprendizaje (
    "idActividad"     SERIAL PRIMARY KEY,
    "codigo"          VARCHAR(50),
    "descripcion"     TEXT NOT NULL,
    "tipoActividad"   VARCHAR(80),
    "duracionMinutos" INTEGER,
    "idResultado"     INTEGER NOT NULL REFERENCES resultados_aprendizaje("idResultado")
        ON DELETE CASCADE
);

-- =========================================================
-- SEDES Y AMBIENTES
-- =========================================================
CREATE TABLE sedes (
    "idSede"     SERIAL PRIMARY KEY,
    "nombreSede" VARCHAR(150) NOT NULL,
    "direccion"  VARCHAR(255),
    "tipoSede"   tipo_sede
);

CREATE TABLE ambientes (
    "idAmbiente"     SERIAL PRIMARY KEY,
    "nombreAmbiente" VARCHAR(100) NOT NULL,
    "idSede"         INTEGER NOT NULL REFERENCES sedes("idSede")
);

-- =========================================================
-- JORNADAS Y DÍAS
-- =========================================================
CREATE TABLE jornadas (
    "idJornada"     SERIAL PRIMARY KEY,
    "nombreJornada" VARCHAR(50) NOT NULL
);

CREATE TABLE "diasDeLaSemana" (
    "idDia"     SERIAL PRIMARY KEY,
    "nombreDia" VARCHAR(10) UNIQUE NOT NULL
);

-- =========================================================
-- HORARIOS
-- Incluye instructor, ambiente, ficha y resultado: sin esas cuatro llaves
-- es imposible saber quién está dónde y, por lo tanto, imposible detectar
-- cruces, que es el objetivo principal del sistema.
-- =========================================================
CREATE TABLE horarios (
    "idHorario"    SERIAL PRIMARY KEY,
    "horaInicio"   TIME NOT NULL,
    "horaFin"      TIME NOT NULL,

    "idJornada"    INTEGER NOT NULL REFERENCES jornadas("idJornada"),
    "idTrimestre"  INTEGER NOT NULL REFERENCES trimestres("idTrimestre"),

    "idAmbiente"   INTEGER NOT NULL REFERENCES ambientes("idAmbiente"),
    "idInstructor" UUID NOT NULL REFERENCES usuarios("idUsuario"),
    "idFicha"      INTEGER NOT NULL REFERENCES fichas("idFicha"),
    "idResultado"  INTEGER NOT NULL REFERENCES resultados_aprendizaje("idResultado"),

    CONSTRAINT "horaFinDespuesDeInicio" CHECK ("horaFin" > "horaInicio")
);

CREATE TABLE horario_dia (
    "idHorario" INTEGER NOT NULL REFERENCES horarios("idHorario") ON DELETE CASCADE,
    "idDia"     INTEGER NOT NULL REFERENCES "diasDeLaSemana"("idDia"),
    PRIMARY KEY ("idHorario", "idDia")
);

-- Índices sobre las llaves foráneas que más se filtran al buscar cruces.
CREATE INDEX "idxHorarioInstructor" ON horarios ("idInstructor");
CREATE INDEX "idxHorarioAmbiente"   ON horarios ("idAmbiente");
CREATE INDEX "idxHorarioFicha"      ON horarios ("idFicha");
CREATE INDEX "idxHorarioTrimestre"  ON horarios ("idTrimestre");

-- =========================================================
-- OPCIONAL — bloquear cruces desde la propia base de datos.
-- No se activa por defecto: exige que el día viva en la misma tabla en
-- vez de horario_dia, porque un EXCLUDE constraint no puede cruzar dos
-- tablas. Se deja documentado para cuando se decida aplicarlo.
-- =========================================================
-- CREATE EXTENSION IF NOT EXISTS btree_gist;
-- ALTER TABLE horarios ADD CONSTRAINT "sinCruceInstructor"
--     EXCLUDE USING gist (
--         "idInstructor" WITH =,
--         tsrange(("horaInicio")::text::timestamp, ("horaFin")::text::timestamp) WITH &&
--     );

-- =========================================================
-- OPCIONAL — Row Level Security (Supabase).
-- Con Supabase Auth activo, auth.uid() ya identifica al usuario autenticado
-- dentro de cualquier política RLS. No se activa aquí (se define junto con
-- el módulo de roles en la Fase 1), se deja documentado el patrón base:
-- =========================================================
-- ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "instructor_ve_su_horario" ON horarios
--     FOR SELECT USING ("idInstructor" = auth.uid());
