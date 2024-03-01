import getSession from "@/actions/getSession";
import pool, { schema } from "@/libs/DBConnect";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const session = await getSession();

    if (!session) return NextResponse.json({ message: "Unauthorized" });

    const body = await req.json();
    const { mes, pais } = body;
    const { id } = params;
    const keys = Object.keys(body);

    const newMetric = {
      pais,
      mes: parseInt(mes),
      valor_medicion: parseFloat(body[keys[2]]),
      valor_meta: parseFloat(body[keys[3]]),
      avance_real: parseFloat(body[keys[4]]),
      avance_estimado: parseFloat(body[keys[5]]),
    };

    const result = await pool.query(
      `
      UPDATE ${schema}.devopsdata
      SET
        pais = $1,
        mes = $2,
        valor_medicion = $3,
        valor_meta = $4,
        avance_real = $5,
        avance_estimado = $6
      WHERE id = $7
      RETURNING *
    `,
      [
        newMetric.pais,
        newMetric.mes,
        newMetric.valor_medicion,
        newMetric.valor_meta,
        newMetric.avance_real / 100,
        newMetric.avance_estimado / 100,
        parseInt(id),
      ]
    );

    const _metric = result.rows[0];
    return NextResponse.json(_metric);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(error);
  }
}
