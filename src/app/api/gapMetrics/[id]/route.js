import { NextResponse } from "next/server";
import prisma from "@/libs/PrismaConnect";

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { mes, pais } = body;
    const { id } = params;
    const keys = Object.keys(body);

    const newMetric = {
      pais,
      mes: parseInt(mes),
      valorMedicion: parseFloat(body[keys[2]]),
      valorMeta: parseFloat(body[keys[3]]),
      avanceReal: parseFloat(body[keys[4]]),
      avanceEstimado: parseFloat(body[keys[5]]),
    };

    const _metric = await prisma.devOpsData.update({
      where: { id: parseInt(id) },
      data: newMetric,
    });

    return NextResponse.json(_metric);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(error);
  }
}
