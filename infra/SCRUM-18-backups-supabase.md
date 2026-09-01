# SCRUM-18 — Backups automáticos diarios en Supabase

## Requisito

RNF-17: La base de datos debe contar con copias de seguridad automáticas diarias.

## Verificación realizada

Se revisó la configuración de backups del proyecto SIHS en Supabase.

- Plan actual: Free.
- Sección revisada: Database → Backups → Scheduled backups.
- Resultado: el plan Free no incluye project backups.
- Supabase indica que los backups programados están disponibles al actualizar al plan Pro.

## Resultado

El plan actual de Supabase no permite cumplir RNF-17 mediante los backups automáticos del proyecto.

No se requiere una activación manual dentro del plan Free, ya que los project backups no están incluidos en este plan.

## Acción requerida

Para disponer de backups automáticos diarios del proyecto, se requiere actualizar el proyecto al plan Pro.

El cambio de plan queda pendiente de autorización y decisión del equipo, debido a que puede generar un costo.

## Estado de la tarea

Verificación completada.

La configuración de backups no fue modificada durante esta tarea.

Queda pendiente la decisión del equipo sobre la actualización del plan de Supabase para cumplir completamente RNF-17.

## Evidencia

La verificación se realizó directamente desde el Dashboard de Supabase, donde se muestra:

- Plan: Free.
- Mensaje: "Free Plan does not include project backups."
- Opción disponible: Upgrade to the Pro Plan for up to 7 days of scheduled backups.