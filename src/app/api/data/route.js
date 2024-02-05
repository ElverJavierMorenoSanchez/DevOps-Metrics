import { NextResponse } from "next/server";
import prisma from "@/libs/PrismaConnect";

export async function POST() {
  try {
    return NextResponse.json({ hello: "hello" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 407 });
  }
}

export async function GET(req, res) {
  try {
    const url = new URL(req.url);
    const all = url.searchParams.get("all");

    if (all === "true") {
      const data = await searhMetrics();
      return NextResponse.json(data);
    }

    return NextResponse.json({ he: "jasd" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: "error",
    });
  }
}

const searhMetrics = async () => {
  const data = await prisma.devOpsData.findMany({
    orderBy: [{ anio: "desc" }, { mes: "desc" }],
  });

  return data;
};
