import { NextResponse } from "next/server";
import prisma from "@/libs/PrismaConnect";

export async function POST(req) {
  try {
    const body = await req.json();
    const { leadTime, mes, pais, valorMedicion, valorMedicionPorcentual } =
      body;

    const metrics = await getMetrics(pais, mes);
    if (metrics.length > 0) {
      return NextResponse.json(
        { message: "Ya existe una métrica para este mes y país" },
        { status: 302 }
      );
    }

    const newMetric = {
      tipoMedicion: "Desempeño DEVOPS",
      pais,
      mes: parseInt(mes),
      nombreItemMedir: "Cantidad de Despliegues",
      valorMedicion: parseFloat(valorMedicion),
    };

    const newMetrics = await prisma.$transaction([
      prisma.devOpsData.create({ data: { ...newMetric } }),
      prisma.devOpsData.create({
        data: {
          ...newMetric,
          nombreItemMedir: "Lead Time DevOps",
          valorMedicion: parseFloat(leadTime),
        },
      }),
      prisma.devOpsData.create({
        data: {
          ...newMetric,
          nombreItemMedir: "Tasa de Éxito",
          valorMedicion: 0,
          valorMedicionPorcentual: parseFloat(valorMedicionPorcentual),
        },
      }),
      prisma.devOpsData.create({
        data: {
          ...newMetric,
          nombreItemMedir: "Frecuencia de Liberación",
          valorMedicion: parseFloat(valorMedicion) / 30,
        },
      }),
    ]);

    return NextResponse.json(newMetrics);
  } catch (error) {
    console.log("Error creating metrics", error);
    return NextResponse.json(
      { error: "Error creating metrics" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);

    const mes = url.searchParams.get("mes");
    const pais = url.searchParams.get("pais");

    const metrics = await getMetrics(pais, mes);

    return NextResponse.json(metrics);
  } catch (error) {
    console.log("Error getting metrics", error);
    return NextResponse.json(
      { error: "Error getting metrics" },
      { status: 500 }
    );
  }
}

const getMetrics = async (pais, mes) => {
  const metrics = await prisma.devOpsData.findMany({
    where: {
      AND: [
        { tipoMedicion: { equals: "Desempeño DEVOPS" } },
        { mes: { equals: Number(mes) } },
        { pais: { equals: pais } },
      ],
    },
    take: 8,
    orderBy: [{ anio: "desc" }, { mes: "desc" }],
  });

  return metrics;
};
