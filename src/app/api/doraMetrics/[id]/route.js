import { NextResponse } from "next/server";
import pool, { schema } from "@/libs/DBConnect";
import { putClusterMetrics, queries } from "../route";
import getSession from "@/actions/getSession";

export async function PUT(req, { params }) {
  try {
    const session = await getSession();

    if (!session) return NextResponse.json({ message: "Unauthorized" });

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
      valor_medicion_porcentual: parseFloat(valorMedicionPorcentual) / 100,
    };

    const result = await pool.query(
      `
      UPDATE ${schema}.devopsdata
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
        UPDATE ${schema}.devopsdata
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

    const cntMetrics = await pool.query(
      `
      SELECT *
      FROM ${schema}.devopsdata
      WHERE tipo_medicion = 'Desempeño DEVOPS'
        AND mes = $1
        AND nombre_item_medir = 'Cantidad de Despliegues'
        AND anio = '2024'
    `,
      [parseInt(mes)]
    );

    if (cntMetrics.rows.length > 6) {
      await putClusterMetrics(mes, "HISPAM", queries.hispam);
      await putClusterMetrics(mes, "Cluster 1", queries.cluster1);
      await putClusterMetrics(mes, "Cluster 2", queries.cluster2);
    }

    return NextResponse.json(newMetrics);
  } catch (error) {
    console.log("🚀 ~ PUT ~ error:", error);
    return NextResponse.json(error);
  }
}
