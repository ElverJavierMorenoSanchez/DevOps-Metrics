import { NextResponse } from "next/server";
import prisma from "@/libs/PrismaConnect";

export async function PUT(req, { params }) {
  try {
    const id = parseInt(params?.id);
    const body = await req.json();
    const {
      leadTime,
      mes,
      pais,
      valorMedicion,
      valorMedicionPorcentual,
      nombreItemMedir,
    } = body;

    const newMetric = {
      pais,
      mes: parseInt(mes),
      valorMedicion:
        nombreItemMedir === "Cantidad de Despliegues"
          ? parseFloat(valorMedicion)
          : parseFloat(leadTime),
      valorMedicionPorcentual: parseFloat(valorMedicionPorcentual),
    };

    const newMetrics = await prisma.devOpsData.update({
      where: {
        id,
      },
      data: {
        ...newMetric,
      },
    });

    if (nombreItemMedir === "Cantidad de Despliegues") {
      const newMetrics = await prisma.devOpsData.update({
        where: {
          id: id + 3,
        },
        data: {
          ...newMetric,
          valorMedicion: parseFloat(valorMedicion) / 30,
        },
      });
    }

    return NextResponse.json(newMetrics);
  } catch (error) {
    console.log("🚀 ~ PUT ~ error:", error);
    return NextResponse.json(error);
  }
}
