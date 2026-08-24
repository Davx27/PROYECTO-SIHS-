-- Datos de prueba — Base de datos sistema_sihs (PostgreSQL)
--
-- Ejecutar después de 01_creacion.sql, sobre una base ya creada y vacía:
--   psql -U postgres -h localhost -p 5432 -d sistema_sihs -f 02_datos_prueba.sql
--
-- Las contraseñas de ejemplo son hashes falsos (hash1, hash2...) solo para
-- poder insertar algo en "password" sin bcrypt a mano — no sirven para
-- iniciar sesión de verdad. Para crear un administrador funcional, usar
-- Backend/seed.py, que sí genera un hash real.

-- =========================
-- ROLES
-- =========================
INSERT INTO roles ("nombre") VALUES
('Administrador'),
('Coordinador'),
('Instructor'),
('Aprendiz');

-- =========================
-- ESTRUCTURA ACADÉMICA BASE
-- =========================
INSERT INTO coordinaciones ("nombreCoordinacion") VALUES
('Teleinformática'),
('Logística'),
('Artes');

INSERT INTO programas ("codigoPrograma", "nombrePrograma", "nivelFormacion", "idCoordinacion")
SELECT '228106', 'Análisis y Desarrollo de Software', 'Tecnólogo', "idCoordinacion"
FROM coordinaciones WHERE "nombreCoordinacion" = 'Teleinformática';

INSERT INTO programas ("codigoPrograma", "nombrePrograma", "nivelFormacion", "idCoordinacion")
SELECT '221101', 'Mantenimiento Industrial', 'Técnico', "idCoordinacion"
FROM coordinaciones WHERE "nombreCoordinacion" = 'Logística';

INSERT INTO trimestres ("nombre", "fechaInicio", "fechaFin", "estado") VALUES
('Trimestre 1 - 2026', '2026-01-01', '2026-03-31', 'activo'),
('Trimestre 2 - 2026', '2026-04-01', '2026-06-30', 'planeado');

INSERT INTO fichas ("codigoFicha", "idPrograma", "idTrimestre")
SELECT '2874521', p."idPrograma", t."idTrimestre"
FROM programas p, trimestres t
WHERE p."codigoPrograma" = '228106' AND t."nombre" = 'Trimestre 1 - 2026';

INSERT INTO fichas ("codigoFicha", "idPrograma", "idTrimestre")
SELECT '2874522', p."idPrograma", t."idTrimestre"
FROM programas p, trimestres t
WHERE p."codigoPrograma" = '221101' AND t."nombre" = 'Trimestre 1 - 2026';

-- =========================
-- SEDES, AMBIENTES, JORNADAS, DÍAS
-- =========================
INSERT INTO sedes ("nombreSede", "direccion", "tipoSede") VALUES
('Sede Principal', 'Calle 10 # 5-51', 'principal'),
('Sede Norte', 'Carrera 20 # 30-10', 'secundaria');

INSERT INTO ambientes ("nombreAmbiente", "idSede")
SELECT 'Lab Sistemas 1', "idSede" FROM sedes WHERE "nombreSede" = 'Sede Principal';

INSERT INTO ambientes ("nombreAmbiente", "idSede")
SELECT 'Taller Industrial', "idSede" FROM sedes WHERE "nombreSede" = 'Sede Norte';

INSERT INTO jornadas ("nombreJornada") VALUES
('Mañana'), ('Tarde'), ('Noche');

INSERT INTO "diasDeLaSemana" ("nombreDia") VALUES
('Lunes'), ('Martes'), ('Miércoles'), ('Jueves'), ('Viernes'), ('Sábado');

-- =========================
-- ESPECIALIDADES
-- =========================
INSERT INTO especialidades ("nombre", "descripcion") VALUES
('Programación', 'Desarrollo de software y bases de datos'),
('Mecánica Industrial', 'Mantenimiento de maquinaria y equipos');

-- =========================
-- USUARIOS
-- =========================
INSERT INTO usuarios ("nombre", "email", "password") VALUES
('Juan Perez', 'juan@mail.com', 'hash1'),
('Maria Gomez', 'maria@mail.com', 'hash2'),
('Carlos Lopez', 'carlos@mail.com', 'hash3'),
('Ana Martinez', 'ana@mail.com', 'hash4');

-- Roles: Juan y Maria -> Aprendiz, Carlos -> Instructor, Ana -> Coordinador
INSERT INTO usuario_rol ("idUsuario", "idRol")
SELECT u."idUsuario", r."idRol" FROM usuarios u, roles r
WHERE u."email" = 'juan@mail.com' AND r."nombre" = 'Aprendiz';

INSERT INTO usuario_rol ("idUsuario", "idRol")
SELECT u."idUsuario", r."idRol" FROM usuarios u, roles r
WHERE u."email" = 'maria@mail.com' AND r."nombre" = 'Aprendiz';

INSERT INTO usuario_rol ("idUsuario", "idRol")
SELECT u."idUsuario", r."idRol" FROM usuarios u, roles r
WHERE u."email" = 'carlos@mail.com' AND r."nombre" = 'Instructor';

INSERT INTO usuario_rol ("idUsuario", "idRol")
SELECT u."idUsuario", r."idRol" FROM usuarios u, roles r
WHERE u."email" = 'ana@mail.com' AND r."nombre" = 'Coordinador';

-- Especialidad de Carlos (instructor)
INSERT INTO usuario_especialidad ("idUsuario", "idEspecialidad")
SELECT u."idUsuario", e."idEspecialidad" FROM usuarios u, especialidades e
WHERE u."email" = 'carlos@mail.com' AND e."nombre" = 'Programación';

-- Juan y Maria matriculados en la ficha de ADSO
INSERT INTO ficha_usuario ("idFicha", "idUsuario")
SELECT f."idFicha", u."idUsuario" FROM fichas f, usuarios u
WHERE f."codigoFicha" = '2874521' AND u."email" = 'juan@mail.com';

INSERT INTO ficha_usuario ("idFicha", "idUsuario")
SELECT f."idFicha", u."idUsuario" FROM fichas f, usuarios u
WHERE f."codigoFicha" = '2874521' AND u."email" = 'maria@mail.com';

-- =========================
-- COMPETENCIAS / RESULTADOS / ACTIVIDADES
-- =========================
INSERT INTO competencias_formacion ("codigo", "descripcion", "idPrograma")
SELECT '220501093', 'Desarrollar componentes de software', "idPrograma"
FROM programas WHERE "codigoPrograma" = '228106';

INSERT INTO resultados_aprendizaje ("codigo", "descripcion", "idCompetencia")
SELECT '24020101', 'Diseñar el modelo de datos del proyecto', "idCompetencia"
FROM competencias_formacion WHERE "codigo" = '220501093';

INSERT INTO actividades_aprendizaje ("codigo", "descripcion", "tipoActividad", "duracionMinutos", "idResultado")
SELECT 'ACT001', 'Modelar entidad-relación y crear el script SQL', 'Práctica', 240, "idResultado"
FROM resultados_aprendizaje WHERE "codigo" = '24020101';

-- =========================
-- HORARIO (con las FK completas: instructor, ambiente, ficha, resultado)
-- =========================
INSERT INTO horarios ("horaInicio", "horaFin", "idJornada", "idTrimestre", "idAmbiente", "idInstructor", "idFicha", "idResultado")
SELECT
    '07:00', '09:00',
    j."idJornada",
    t."idTrimestre",
    a."idAmbiente",
    i."idUsuario",
    f."idFicha",
    r."idResultado"
FROM jornadas j, trimestres t, ambientes a, usuarios i, fichas f, resultados_aprendizaje r
WHERE j."nombreJornada" = 'Mañana'
  AND t."nombre" = 'Trimestre 1 - 2026'
  AND a."nombreAmbiente" = 'Lab Sistemas 1'
  AND i."email" = 'carlos@mail.com'
  AND f."codigoFicha" = '2874521'
  AND r."codigo" = '24020101';

INSERT INTO horario_dia ("idHorario", "idDia")
SELECT h."idHorario", d."idDia"
FROM horarios h, "diasDeLaSemana" d
WHERE d."nombreDia" IN ('Lunes', 'Miércoles');

-- =========================
-- Cómo verificar que NO hay un cruce antes de insertar un horario nuevo
-- (esto es lo que el backend debe hacer en horarios/service.py):
-- =========================
-- SELECT * FROM horarios
-- WHERE ("idInstructor" = :idInstructor OR "idAmbiente" = :idAmbiente)
--   AND "horaInicio" < :horaFinNueva
--   AND "horaFin"    > :horaInicioNueva
--   AND "idHorario" IN (
--       SELECT "idHorario" FROM horario_dia
--       WHERE "idDia" = ANY(:diasNuevos)
--   );
