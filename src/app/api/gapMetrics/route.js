import { NextResponse } from "next/server";
import prisma from "@/libs/PrismaConnect";
import { gapsMetrics } from "@/helpers/AditionalData";

export async function POST(req) {
  try {
    const body = await req.json();
    const { mes, pais } = body;
    const newMetrics = [];

    const _metrics = await searhMetrics(pais, mes);

    if (_metrics.length > 0)
      return NextResponse.json(
        { message: "El elemento ya existe" },
        { status: 302 }
      );

    gapsMetrics.map(async (metric) => {
      const newMetric = {
        tipoMedicion: "Madurez DevOps",
        pais,
        mes: parseInt(mes),
        nombreItemMedir: metric.nombreItem,
        valorMedicion: parseFloat(body[`${metric.nomVariable}1`]) || 0,
        valorMeta: parseFloat(body[`${metric.nomVariable}2`]) || 0,
        avanceReal: parseFloat(body[`${metric.nomVariable}3`]) || 0,
        avanceEstimado: parseFloat(body[`${metric.nomVariable}4`]) || 0,
      };

      const _metric = await prisma.devOpsData.create({ data: newMetric });
      newMetrics.push(_metric);
    });

    return NextResponse.json(newMetrics);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(error);
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    console.log(url);

    const mes = url.searchParams.get("mes");
    const pais = url.searchParams.get("pais");

    const gaps = await searhMetrics(pais, mes);
    return NextResponse.json(gaps);
  } catch (error) {
    return NextResponse.json([]);
  }
}

const searhMetrics = async (pais, mes) => {
  const gaps = await prisma.devOpsData.findMany({
    where: {
      AND: [
        { tipoMedicion: { equals: "Madurez DevOps" } },
        { mes: { equals: Number(mes) } },
        { pais: { equals: pais } },
      ],
    },
    take: 10,
    orderBy: [{ anio: "desc" }, { mes: "desc" }],
  });

  return gaps;
};
