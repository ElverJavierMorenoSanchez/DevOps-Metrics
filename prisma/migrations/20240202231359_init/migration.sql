-- CreateTable
CREATE TABLE "DevOpsData" (
    "id" SERIAL NOT NULL,
    "tipoMedicion" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "mes" INTEGER NOT NULL DEFAULT 1,
    "anio" INTEGER NOT NULL DEFAULT 2024,
    "nombreItemMedir" TEXT NOT NULL,
    "valorMedicion" DOUBLE PRECISION DEFAULT 0,
    "valorMeta" DOUBLE PRECISION DEFAULT 0,
    "avanceReal" INTEGER DEFAULT 0,
    "avanceEstimado" INTEGER DEFAULT 0,
    "valorMedicionPorcentual" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "DevOpsData_pkey" PRIMARY KEY ("id")
);
