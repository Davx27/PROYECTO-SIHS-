# Qué falta para cumplir el objetivo del proyecto

Este documento es distinto de `PENDIENTE_MVP.md` (que es solo "qué falta
para mostrar algo en 24h"). Aquí está **todo lo que falta** para que el
sistema cumpla lo que dice la documentación del proyecto — pensado para que
cualquiera del equipo pueda tomar un módulo y programarlo sin tener que
releer todos los PDFs de requisitos primero.

## El objetivo real (no lo pierdan de vista)

> Detectar y evitar que un instructor, un ambiente o una ficha queden
> **cruzados** en el mismo horario. Todo lo demás (usuarios, roles,
> catálogos) existe para que este único problema se pueda resolver.

Si en algún momento hay que elegir en qué trabajar primero, el módulo
`horarios` siempre gana — es literalmente la razón por la que existe SIHS
(ver `_Docs/Documentación general/Propuesta de proyecto V1.md` y la
entrevista con el coordinador en `_Docs/Elicitación/`).

## Cómo leer la tabla

Las 19 tablas del dominio **ya existen** en Supabase (`database/01_creacion.sql`).
Lo que falta es la capa de código de cada una: modelo (SQLAlchemy), esquema
(Pydantic), repositorio, servicio y rutas — siguiendo exactamente el mismo
patrón que ya está armado para `roles`/`usuarios`/`usuario_rol` (ver
`ESTRUCTURA.md` para el patrón paso a paso).

| Módulo | Tablas (ya existen) | Estado del código | Para qué sirve |
|---|---|---|---|
| Autenticación | `auth.users` (Supabase) | ✅ Hecho | Login, registro, recuperación de contraseña — vía Supabase Auth |
| Usuarios / Roles | `usuarios`, `roles`, `usuario_rol` | ✅ Hecho | Perfil, control de acceso por rol |
| Especialidades | `especialidades`, `usuario_especialidad` | ✅ Hecho | Catálogo de especialidades de instructores (un instructor puede tener varias) |
| Estructura académica | `coordinaciones`, `programas`, `trimestres`, `fichas`, `ficha_usuario` | ❌ Falta | Base para poder crear fichas y matricular aprendices/instructores |
| Sedes y ambientes | `sedes`, `ambientes` | ✅ Hecho | Dónde puede dictarse una clase — necesario antes de `horarios` |
| Jornadas y días | `jornadas`, `diasDeLaSemana` | ✅ Hecho | Catálogos simples, casi sin lógica — buen punto de entrada para alguien nuevo en el backend |
| **Horarios** | `horarios`, `horario_dia` | ❌ **Falta — es el objetivo del proyecto** (hay un puente temporal `horarios_guardados` en JSONB, ver abajo) | Crear/editar horarios **detectando cruces** de instructor, ambiente y ficha |
| Competencias / resultados / actividades | `competencias_formacion`, `resultados_aprendizaje`, `actividades_aprendizaje` | ❌ Falta | Lo que se enseña en cada bloque de horario — relacionado con el "semáforo" que mencionó el coordinador en la entrevista |

## Orden recomendado para programar lo que falta

No es obligatorio seguir este orden exacto, pero cada módulo depende de que
el anterior ya exista (por las llaves foráneas). Actualizado 2026-08-26 —
los pasos 1, 2 y 4 ya están hechos:

1. ~~Jornadas y días~~ — ✅ hecho.
2. ~~Sedes → Ambientes~~ — ✅ hecho.
3. **Coordinaciones → Programas → Trimestres → Fichas** — esta cadena hay
   que hacerla en ese orden porque cada una depende de la anterior. **Es el
   siguiente paso desbloqueado** — no depende de ninguna decisión pendiente
   con la coordinación, solo de programar el CRUD siguiendo el esquema ya
   definido en `01_creacion.sql`.
4. ~~Especialidades~~ — ✅ hecho.
5. **Competencias → Resultados → Actividades de aprendizaje** — cadena
   parecida a la de fichas, también en orden.
6. **Horarios** — el último porque depende de TODO lo anterior (jornada,
   ambiente, instructor, ficha, resultado). Es el módulo más importante y el
   más delicado: la detección de cruces tiene que validarse en el `service`
   antes de guardar (ver la consulta de ejemplo al final de
   `database/02_datos_prueba.sql`), y ya existe el `EXCLUDE` constraint de
   PostgreSQL comentado en `01_creacion.sql` como segunda barrera a nivel de
   base de datos — **ojo:** esa consulta de ejemplo solo compara
   instructor/ambiente, falta sumarle la validación de cruce por ficha (una
   ficha tampoco puede tener dos clases al mismo tiempo) antes de darla por
   completa. El `EXCLUDE` constraint también sigue bloqueado por el mismo
   motivo que dice el comentario en `01_creacion.sql`: exige que el día viva
   en la misma tabla `horarios` en vez de en `horario_dia` aparte — hay que
   decidir si vale la pena ese cambio de esquema antes de activarlo.

## Sección de estudiantes (planeada, no programada todavía)

Se decidió agregar una sección para que los estudiantes ingresen su ficha y
vean su horario de la semana (solo lectura). Depende de que `fichas` y
`horarios` (pasos 3 y 6 de arriba) ya existan en código, y todavía faltan
decisiones de diseño por resolver — ver
[`_Docs/Documentación general/SECCION_ESTUDIANTES.md`](../_Docs/Documentación%20general/SECCION_ESTUDIANTES.md)
antes de empezar a programarla.

## Al terminar cada módulo

Para los requisitos exactos (qué debe validar cada endpoint, qué campos son
obligatorios, etc.) revisen `_Docs/Informes de requisitos/Requisitos
Funcionales V4.pdf` — es la versión más reciente y la que coincide con los
wireframes en `_Docs/Diseño/wireframes.pdf`. Las versiones V1-V3 quedaron
como historial, tienen numeración de requisitos distinta a V4, no las usen
como referencia para programar.

Cada módulo nuevo necesita también su fila en este archivo pasando de ❌ a
✅ — así el equipo ve el avance real de un vistazo sin tener que preguntar.
