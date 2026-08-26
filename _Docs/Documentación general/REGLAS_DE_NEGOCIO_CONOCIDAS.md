# Reglas de negocio conocidas — y lo que todavía falta confirmar

Este documento junta lo que ya sabemos del dominio real (sacado de la
entrevista con el coordinador de Teleinformática y del resto de
`_Docs/`) para no tener que releer las transcripciones cada vez, y deja
aparte, sin inventar nada, lo que sigue pendiente de confirmar con la
coordinación antes de programarlo. Última actualización: 2026-08-26.

Fuente principal: `_Docs/Elicitacion/Entrevistas/Entrevista 1 transcrita -
Coordinador de teleinformática.md`. Todo lo marcado "❓" es una pregunta
abierta real, no una suposición — no programar esas reglas hasta
confirmarlas.

## Cómo se resuelven los cruces hoy (manual)

El coordinador arma cada trimestre una planeación en Excel/macros
controlando a la vez **ficha, instructor, jornada y ambiente**. Reglas que
mencionó explícitamente en la entrevista:

- Un instructor programado en la jornada de la mañana **no se programa en
  la tarde** — por los desplazamientos entre sedes/ambientes.
- Algunos instructores están restringidos a un solo lugar ("tiene que
  estar programado solo aquí").
- Entre bloques que cruzan de ambiente/sede hay un margen de traslado que
  hoy se negocia a mano con los instructores (ej. salir 11:30, recibir a
  la 1 o 2 pm en el otro sitio) — no es una regla dura del sistema, es
  coordinación humana.
- ❓ **¿La restricción mañana/tarde aplica a todos los instructores o solo
  a algunos?** El coordinador dio a entender que depende del instructor
  ("otro sería que tiene que estar programado solo aquí"). Hace falta el
  criterio exacto para poder codificarla — probablemente un flag o
  restricción por instructor, no una regla global.

**Lógica ya definida para automatizar la detección** (ver
`database/02_datos_prueba.sql` líneas 215-225, y el `EXCLUDE` constraint
comentado en `database/01_creacion.sql`):

```sql
SELECT * FROM horarios
WHERE ("idInstructor" = :idInstructor OR "idAmbiente" = :idAmbiente)
  AND "horaInicio" < :horaFinNueva
  AND "horaFin"    > :horaInicioNueva
  AND "idHorario" IN (
      SELECT "idHorario" FROM horario_dia
      WHERE "idDia" = ANY(:diasNuevos)
  );
```

**Pendiente antes de dar esto por completo:** esa consulta de ejemplo solo
cubre cruce de instructor y de ambiente — falta sumar el cruce por
**ficha** (una ficha tampoco puede tener dos clases al mismo tiempo,
aunque sea con instructor/ambiente distintos). El `EXCLUDE USING gist` de
Postgres sigue sin poder activarse tal como está el esquema hoy: exige que
el día viva en la misma tabla `horarios` en vez de en `horario_dia`
aparte (una tabla puente M:N) — hay que decidir si vale la pena ese
cambio de esquema, o si la validación a nivel de `service` basta.

## Instructores y especialidades

- Cada instructor maneja entre **1 y 3 temáticas máximo**, asignadas según
  su fortaleza — ya modelado con `usuario_especialidad` (N:N, un
  instructor puede tener varias especialidades).
- En la planeación interna, algunos instructores se referencian por una
  **sigla/código corto** (ej. "UA", "LM"), no siempre por nombre completo.
- Los "resultados de aprendizaje" (competencias) van codificados. El
  número varía por programa (~15 aprox.); hay **transversales** (medio
  ambiente, sociocultura, paz — se repiten en técnico y tecnólogo) y
  **técnicos** (específicos de cada programa). Ya modelado en
  `competencias_formacion` / `resultados_aprendizaje`.
- ❓ **Listado real de instructores** (nombre, especialidad(es), sigla) —
  no está en ningún documento del repo todavía. Sofía Plus no se puede
  integrar directo ("es una caja que nunca nos dejarán permitir el acceso
  al código"), pero el coordinador ofreció generar un **archivo plano**
  exportado — hay que pedirlo formalmente.

## Ambientes

- Unos **~100 ambientes en todo el centro**: sede principal (Cl 52, ~50
  ambientes, de los cuales ~23 son de Teleinformática y ~10 de
  Logística), sede Fontibón (~10 ambientes, 2 de Teleinformática), y un
  edificio adicional para el centro de servicios financieros.
- Cada coordinación "es dueña" de un subconjunto de ambientes, pero puede
  **ver** (solo lectura) los de otras coordinaciones — necesario para
  planear alrededor de ambientes compartidos ("yo lo único que veo es
  cómo estoy de ambientes... si hace falta algún cambio").
- Se identifican por número (ej. "509", "303", "402").
- ❓ **Listado real de ambientes** por sede/coordinación, con código y
  cualquier requisito especial (ya existe `database/migrations/
  03_ambientes_requisitos.sql` esperando datos reales).

## Fichas y programas

- Una ficha SENA es nominalmente de **30 personas**, pero se abren fichas
  adicionales cuando la demanda/meta institucional lo exige.
- Un solo coordinador de Teleinformática maneja **~75 fichas**.
- Código de ficha visto en la entrevista/documentación: `3228973` (ya es
  el que se usa de ejemplo en `NuevoHorario.tsx`).
- 14 programas en Teleinformática: 8 tecnólogos (Análisis y Desarrollo de
  Software, Gestión de Redes de Datos, Implementación de Infraestructura,
  Desarrollo de Videojuegos, Animación 3D, Producción de Multimedia,
  Provisión de Medios Audiovisuales, Provisión de Sonido) + 6 técnicos
  (Programación de Software, Mantenimiento de Equipos, Sistemas
  Teleinformáticos, Multimedia en Producción de Audiovisuales, Seguridad
  Digital, y uno más sin confirmar en la transcripción).
- Existen "fichas cadena de formación": arrancan con conocimientos
  previos, van hasta el sábado (jornada especial, solo mañana).
- Etapa productiva: los aprendices salen a práctica ~20 de diciembre; la
  fase lectiva vuelve en febrero (coincide con el reintegro de
  instructores contratados).
- ❓ **Listado real de fichas activas** por trimestre (código, programa,
  jornada) — no está en el repo todavía.

## Horarios (estructura de bloques)

- Jornada mañana y tarde: **bloques de 6 horas** cada una (divididos en 2
  sub-bloques de 3h).
- Jornada noche: **bloques de 4 horas** (2 sub-bloques de 2h) — el
  coordinador explicó que la jornada nocturna necesita más autonomía, por
  eso son más cortos que en el papel (6h nominales bajadas a 4h reales).
- Esto **ya coincide exactamente** con el `BLOQUES` definido en
  `frontend/src/pages/horario/tipos.ts`.
- Semana ≈ **36 horas** — también ya es el valor por defecto en el
  formulario de `NuevoHorario.tsx`.
- Sábado: jornada especial, solo mañana, para fichas "cadena de
  formación".

## Otras preguntas abiertas (no bloquean código, pero sí decisiones)

Ver `_Docs/Documentación general/SECCION_ESTUDIANTES.md` para el detalle
completo de estas — se repiten acá solo como índice:

- ❓ ¿El aprendiz inicia sesión con Supabase Auth o es consulta pública por
  código de ficha?
- ❓ "Ingresar su ficha" ¿crea la ficha o solo la vincula a una que ya
  existe?
- ❓ ¿Un aprendiz pertenece a una sola ficha activa a la vez, o puede tener
  varias?
- ❓ Existencia real de `Requisitos Funcionales V4` — el roadmap del
  backend lo referencia como la versión vigente, pero en el repo solo
  están V1-V3 (`_Docs/Informes de requisitos/`). Confirmar si existe y
  conseguirlo.

## Qué no depende de estas respuestas (se puede avanzar ya)

- El CRUD de `coordinaciones` → `programas` → `trimestres` → `fichas`: la
  estructura de esas tablas ya está definida en `01_creacion.sql` y no
  cambia según ninguna de las preguntas de arriba.
- Las vistas de catálogo (Ambientes, Instructores, Fichas) del frontend
  pueden construirse ya con datos de ejemplo — ver
  `frontend/OBJETIVO_Y_SERVICIOS_FALTANTES.md` para el estado de cada una.
