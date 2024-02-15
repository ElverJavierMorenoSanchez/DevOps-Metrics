import { NextResponse } from "next/server";
import pool from "@/libs/DBConnect";

export async function PUT(req, { params }) {
  try {
    const { _parsed } = req.cookies;
    const token = _parsed.get("next-auth.session-token");

    if (!token) return NextResponse.json({ message: "Unauthorized" });

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
      valor_medicion:
        nombreItemMedir === "Cantidad de Despliegues"
          ? parseFloat(valorMedicion)
          : parseFloat(leadTime),
      valor_medicion_porcentual: parseFloat(valorMedicionPorcentual),
    };

    const result = await pool.query(
      `
      UPDATE devOpsData
      SET
        pais = $1,
        mes = $2,
        valor_medicion = $3,
        valor_medicion_porcentual = $4
      WHERE id = $5
      RETURNING *
    `,
      [
        newMetric.pais,
        newMetric.mes,
        newMetric.valor_medicion,
        newMetric.valor_medicion_porcentual,
        id,
      ]
    );

    const newMetrics = result.rows[0];

    if (nombreItemMedir === "Cantidad de Despliegues") {
      const result = await pool.query(
        `
        UPDATE devOpsData
        SET
          pais = $1,
          mes = $2,
          valor_medicion = $3
        WHERE id = $4
        RETURNING *
      `,
        [newMetric.pais, newMetric.mes, newMetric.valor_medicion / 30, id + 3]
      );

      newMetrics.secondaryMetric = result.rows[0];
    }

    return NextResponse.json(newMetrics);
  } catch (error) {
    console.log("🚀 ~ PUT ~ error:", error);
    return NextResponse.json(error);
  }
}
