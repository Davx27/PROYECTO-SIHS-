# Plan para integrar lo aprendido en lógica de negocio y base de datos

Este documento es el puente entre `REGLAS_DE_NEGOCIO_CONOCIDAS.md` (qué
sabemos del dominio real) y el código: qué cambiar en el esquema, en qué
orden programarlo, y **qué formato de datos pedirle a la coordinación**
para que, cuando lleguen, se puedan cargar directo sin reinterpretarlos.
Nada de lo que propone este documento está aplicado todavía — es la
propuesta a revisar antes de tocar `01_creacion.sql` en producción.
Última actualización: 2026-08-26.

## 1. Qué ya no requiere información nueva (se puede programar ya)

Estructura definida en `01_creacion.sql`, sin cambios pendientes, sin
depender de ninguna respuesta de la coordinación:

- `coordinaciones` → `programas` → `trimestres` → `fichas` →
  `ficha_usuario` (CRUD completo, capa por capa, mismo patrón que
  `especialidades`/`sedes`/`ambientes`).
- Frontend: conectar `Ambientes.tsx`, `Instructores.tsx`, `Fichas.tsx` a
  esos endpoints en cuanto existan (hoy son datos de ejemplo a propósito).

Esto es el paso 3 del roadmap en `backend/OBJETIVO_Y_SERVICIOS_FALTANTES.md`
y no cambia con nada de lo que sigue.

## 2. Cambios de esquema propuestos (pendientes de aplicar)

### 2.1 Tabla `guias` (nueva)

La entrevista de Logística reveló una capa que el esquema actual no tiene:
un **resultado de aprendizaje** pertenece a una **guía**, y la guía (no el
resultado directamente) es la que se ubica en un trimestre según la
planeación pedagógica. Hoy `resultados_aprendizaje` solo enlaza a
`competencias_formacion` → `programa`, sin guía ni trimestre ni horas.

```sql
CREATE TABLE guias (
    "idGuia"       SERIAL PRIMARY KEY,
    "codigo"       VARCHAR(50),              -- ej. "Guía 10"
    "idPrograma"   INTEGER NOT NULL REFERENCES programas("idPrograma"),
    "idTrimestre"  INTEGER NOT NULL REFERENCES trimestres("idTrimestre")
);

ALTER TABLE resultados_aprendizaje
    ADD COLUMN "idGuia" INTEGER REFERENCES guias("idGuia"),
    ADD COLUMN "horasAsignadas" INTEGER;   -- ej. 40 (horas totales del resultado)
```

`idGuia` queda **nullable** a propósito: no todos los programas tienen
esta capa documentada todavía, y forzar `NOT NULL` bloquearía sembrar
competencias/resultados de programas que aún no tengan sus guías
digitalizadas.

### 2.2 Distinguir instructor de planta vs. contratista (nuevo)

Necesario para la regla "planta se programa primero, debe llegar a 32h/semana":

```sql
ALTER TABLE usuarios
    ADD COLUMN "tipoContrato" VARCHAR(20),      -- 'planta' | 'contratista', nullable
    ADD COLUMN "horasContratadasSemana" INTEGER; -- nullable, solo aplica a instructores
```

Alternativa más limpia si el equipo prefiere no tocar `usuarios`
directamente: una tabla `instructor_perfil` 1:1 con `usuarios` — a decidir
en equipo, no es una diferencia grande de esfuerzo.

### 2.3 Instructor "vacante" (placeholder) — decisión de diseño, no de esquema

Logística usa un placeholder tipo "instructor logística 7" cuando el cupo
todavía no está contratado, y lo renombra después sin perder lo ya
programado. Con el esquema actual (`horarios.idInstructor` es `NOT NULL
UUID REFERENCES usuarios`), esto se resuelve **sin cambiar el esquema**:
crear una fila real en `usuarios` para cada "vacante" (ej. nombre
`"Vacante Logística #7"`, sin cuenta de Supabase Auth asociada — o con una
cuenta placeholder) y reasignar `idInstructor` cuando se contrate a
alguien real. Documentado acá para que quien programe `horarios` no
reinvente esto — no hace falta una tabla nueva.

### 2.4 Cruce por resultado repetido — no es esquema, es validación

No requiere cambio de tabla. Antes de insertar en `horarios`, además de
las validaciones de rango de horas (instructor/ambiente/ficha), agregar:

```sql
SELECT 1 FROM horarios
WHERE "idFicha" = :idFicha AND "idResultado" = :idResultado;
-- si existe, es cruce de tipo "resultado repetido" — bloquear o alertar
```

### 2.5 `EXCLUDE` constraint de Postgres — sigue sin activarse

Ver `REGLAS_DE_NEGOCIO_CONOCIDAS.md`: exige que el día viva en `horarios`
en vez de en `horario_dia` aparte. **Decisión pendiente para el equipo**:
o se cambia el esquema (colapsar `horario_dia` en una columna
`"diasSemana" INTEGER[]` o similar sobre `horarios`, perdiendo la relación
M:N normalizada) o la detección de cruces queda solo a nivel de
`service` (ya cubre los 4 tipos si se implementa el punto 2.4). Mientras
no se decida, **no bloquea nada** — la validación en `service` es
suficiente para lanzar a producción.

## 3. Validación de cruces a implementar en `horarios/service.py`

Los 4 tipos confirmados entre las dos entrevistas, en el orden en que
conviene chequearlos (más barato primero):

1. **Resultado repetido en la misma ficha** (punto 2.4) — comparación de
   existencia, sin rangos de fecha, la más barata.
2. **Cruce de ficha** — misma ficha, rango de horas se solapa, mismo día.
3. **Cruce de instructor** — mismo instructor, rango se solapa, mismo día.
4. **Cruce de ambiente** — mismo ambiente, rango se solapa, mismo día.

Las reglas de restricción por instructor (mañana/tarde, sede única) **NO**
se implementan como regla global — ver la corrección en
`REGLAS_DE_NEGOCIO_CONOCIDAS.md`. Si se llegan a implementar, es como una
restricción configurable por instructor (tabla nueva o columna flexible),
no como parte fija del cruce.

## 4. Formato de datos que se necesita de la coordinación

Para que lo que traigas se pueda sembrar directo (via el patrón ya usado
en `database/02_datos_prueba.sql`), idealmente en CSV o Excel con estas
columnas — no hace falta que vengan perfectos, pero si vienen así se
ahorra una vuelta de "traducir" el archivo:

| Catálogo | Columnas mínimas |
|---|---|
| `coordinaciones` | nombre |
| `programas` | código oficial SENA, nombre, nivel (Técnico/Tecnólogo), coordinación |
| `trimestres` | nombre/número, fecha inicio, fecha fin |
| `fichas` | código (7 dígitos), programa, trimestre, jornada, n° aprendices |
| `sedes` | nombre, dirección, tipo (principal/secundaria/alterna) |
| `ambientes` | código/nombre, sede, ¿especializado? (sí/no + para qué), ¿de qué coordinación es "por tradición"? (informativo, no restrictivo) |
| `especialidades` | nombre, descripción |
| `instructores` (`usuarios` + `usuario_especialidad`) | nombre, correo, sigla/iniciales, especialidad(es), planta o contratista, horas contratadas/semana |
| `competencias_formacion` | código, descripción, programa |
| `guias` | código ("Guía 10"), programa, trimestre |
| `resultados_aprendizaje` | código (ej. `CPL21`), descripción, competencia, guía, horas asignadas |

Si lo único disponible es el "reporte de juicio de evaluación" exportado
de Sofía Plus tal cual, también sirve — se puede escribir un script de
importación que lo parsee, pero conviene primero ver una muestra real del
formato de ese export antes de comprometerse a un parser específico.

## 5. Migrar de `horarios_guardados` (JSONB) al `horarios` real

`horarios_guardados` es un puente deliberadamente temporal (ver su propio
comentario en `01_creacion.sql`). Una vez existan `fichas`, `ambientes`,
`instructores` y `resultados_aprendizaje` como filas reales:

1. El editor (`NuevoHorario.tsx` / `useHorarioState`) cambia sus campos de
   texto libre (`instructor`, `ficha`, `ambiente` como `string`) por
   selects que traen las filas reales vía `apiGet` (mismo patrón que ya
   usa el resto del frontend).
2. `POST /horarios-guardados` se reemplaza por `POST /horarios`
   (`idInstructor`, `idAmbiente`, `idFicha`, `idResultado` reales) con la
   validación de cruces del punto 3.
3. Las filas viejas en `horarios_guardados` se pueden dejar como
   historial de "borradores" — no hace falta migrarlas fila por fila, ya
   cumplieron su función de mostrar algo funcional mientras no existían
   los catálogos.
4. `HistorialHorarios.tsx` puede seguir apuntando a
   `GET /horarios-guardados` en paralelo, o migrarse a `GET /horarios`
   filtrado por usuario — a decidir cuando se llegue a este punto, no es
   una decisión urgente ahora.

## 6. Orden recomendado de ahora en adelante

1. Estructura académica (`coordinaciones` → `programas` → `trimestres` →
   `fichas`) — sección 1, ya desbloqueado.
2. Aplicar los cambios de esquema de la sección 2 (revisados en equipo).
3. Sembrar los catálogos con los datos reales que traigas (formato de la
   sección 4).
4. Módulo `competencias_formacion` → `resultados_aprendizaje` →
   `actividades_aprendizaje` → `guias`, con datos reales ya sembrados.
5. Módulo `horarios` real con la validación de cruces de la sección 3.
6. Migración del editor según la sección 5.
