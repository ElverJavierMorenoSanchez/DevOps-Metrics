-- CreateTable
CREATE TABLE devopsdata (
    "id" SERIAL PRIMARY KEY,
    "tipo_medicion" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "mes" INTEGER NOT NULL DEFAULT 1,
    "anio" INTEGER NOT NULL DEFAULT 2024,
    "nombre_item_medir" TEXT NOT NULL,
    "valor_medicion" DOUBLE PRECISION DEFAULT 0,
    "valor_meta" DOUBLE PRECISION DEFAULT 0,
    "avance_real" INTEGER DEFAULT 0,
    "avance_estimado" INTEGER DEFAULT 0,
    "valor_medicion_porcentual" DOUBLE PRECISION DEFAULT 0,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE user (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR,
  "pais" VARCHAR,
  "email" VARCHAR UNIQUE,
  "emailVerified" TIMESTAMP,
  "image" VARCHAR,
  "hashedPassword" VARCHAR
);

CREATE TABLE account (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" VARCHAR REFERENCES "User"(id) ON DELETE CASCADE,
  "type" VARCHAR,
  "provider" VARCHAR,
  "providerAccountId" VARCHAR,
  "refresh_token" VARCHAR,
  "access_token" VARCHAR,
  "expires_at" INT,
  "token_type" VARCHAR,
  "scope" VARCHAR,
  "id_token" VARCHAR,
  "session_state" VARCHAR,
  UNIQUE ("provider", "providerAccountId")
);

-- Permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE devopsdata TO doraowner;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE devopsdata_id_seq TO doraowner;