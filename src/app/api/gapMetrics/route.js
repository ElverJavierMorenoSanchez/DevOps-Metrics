import { NextResponse } from "next/server";
import { gapsMetrics } from "@/helpers/AditionalData";
import pool, { schema } from "@/libs/DBConnect";
import getSession from "@/actions/getSession";

export async function POST(req) {
  try {
    const session = await getSession();

    if (!session) return NextResponse.json({ message: "Unauthorized" });

    const body = await req.json();
    const { mes, pais } = body;
    const newMetrics = [];

    const _metrics = await searhMetrics(pais, mes);

    if (_metrics.length > 0)
      return NextResponse.json(
        { message: "Ya existe una métrica para este mes y país" },
        { status: 302 }
      );

    for (const metric of gapsMetrics) {
      const newMetric = {
        tipo_medicion: "Madurez DevOps",
        pais,
        mes: parseInt(mes),
        nombre_item_medir: metric.nombreItem,
        valor_medicion: parseFloat(body[`${metric.nomVariable}1`]) || 0,
        valor_meta: parseFloat(body[`${metric.nomVariable}2`]) || 0,
        avance_real: parseFloat(body[`${metric.nomVariable}3`]) || 0,
        avance_estimado: parseFloat(body[`${metric.nomVariable}4`]) || 0,
      };

      const result = await pool.query(
        `
        INSERT INTO ${schema}.devopsdata (tipo_medicion, pais, mes, nombre_item_medir, valor_medicion, valor_meta, avance_real, avance_estimado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
        [
          newMetric.tipo_medicion,
          newMetric.pais,
          newMetric.mes,
          newMetric.nombre_item_medir,
          newMetric.valor_medicion,
          newMetric.valor_meta,
          newMetric.avance_real / 100,
          newMetric.avance_estimado / 100,
        ]
      );

      newMetrics.push(result);
    }

    return NextResponse.json(newMetrics);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(error);
  }
}

export async function GET(req) {
  try {
    const session = await getSession();

    if (!session) return NextResponse.json({ message: "Unauthorized" });

    const url = new URL(req.url);

    const mes = url.searchParams.get("mes");
    const pais = url.searchParams.get("pais");

    const gaps = await searhMetrics(pais, mes);
    return NextResponse.json(gaps);
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    return NextResponse.json([]);
  }
}

const searhMetrics = async (pais, mes) => {
  const result = await pool.query(
    `
    SELECT *
    FROM ${schema}.devopsdata
    WHERE tipo_medicion = 'Madurez DevOps'
      AND mes = $1
      AND pais = $2
      AND anio = '2024'
    ORDER BY id ASC
    LIMIT 10
  `,
    [Number(mes), pais]
  );

  return result.rows;
};
