ALTER TABLE ambientes
    ADD COLUMN IF NOT EXISTS "numeroAmbiente" INTEGER,
    ADD COLUMN IF NOT EXISTS "tipoAmbiente" VARCHAR(20),
    ADD COLUMN IF NOT EXISTS "estadoAmbiente" VARCHAR(30);

UPDATE ambientes
SET "numeroAmbiente" = "idAmbiente"
WHERE "numeroAmbiente" IS NULL;

UPDATE ambientes
SET "tipoAmbiente" = 'regular'
WHERE "tipoAmbiente" IS NULL;

UPDATE ambientes
SET "estadoAmbiente" = 'disponible'
WHERE "estadoAmbiente" IS NULL;

UPDATE ambientes
SET "nombreAmbiente" = 'Ambiente'
WHERE "tipoAmbiente" = 'regular';

ALTER TABLE ambientes
    ALTER COLUMN "numeroAmbiente" SET NOT NULL,
    ALTER COLUMN "tipoAmbiente" SET NOT NULL,
    ALTER COLUMN "estadoAmbiente" SET DEFAULT 'disponible',
    ALTER COLUMN "estadoAmbiente" SET NOT NULL;

ALTER TABLE ambientes
    ADD CONSTRAINT "ckTipoAmbiente" CHECK ("tipoAmbiente" IN ('regular', 'especial')),
    ADD CONSTRAINT "ckEstadoAmbiente" CHECK ("estadoAmbiente" IN ('disponible', 'mantenimiento', 'inactivo')),
    ADD CONSTRAINT "uqAmbienteNumeroSede" UNIQUE ("numeroAmbiente", "idSede"),
    ADD CONSTRAINT "nombreAmbienteRegular" CHECK ("tipoAmbiente" = 'especial' OR "nombreAmbiente" = 'Ambiente');