import { NextResponse } from "next/server";
import pool from "@/libs/DBConnect";

export async function POST(req) {
  try {
    const { _parsed } = req.cookies;
    const token = _parsed.get("next-auth.session-token");

    if (!token) return NextResponse.json({ message: "Unauthorized" });

    const body = await req.json();
    const { leadTime, mes, pais, valorMedicion, valorMedicionPorcentual } =
      body;

    const result = await pool.query(
      `
      SELECT *
      FROM devOpsData
      WHERE tipo_medicion = 'Desempeño DEVOPS'
        AND mes = $1
        AND pais = $2
    `,
      [parseInt(mes), pais]
    );

    if (result.rows.length > 0) {
      return NextResponse.json(
        { message: "Ya existe una métrica para este mes y país" },
        { status: 302 }
      );
    }

    const newMetric = {
      tipo_medicion: "Desempeño DEVOPS",
      pais,
      mes: parseInt(mes),
      nombre_item_medir: "Cantidad de Despliegues",
      valor_medicion: parseFloat(valorMedicion),
    };

    // Crear nuevas métricas utilizando una transacción
    await pool.query("BEGIN");

    await pool.query(
      `
        INSERT INTO devOpsData (tipo_medicion, pais, mes, nombre_item_medir, valor_medicion)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [
        newMetric.tipo_medicion,
        newMetric.pais,
        newMetric.mes,
        newMetric.nombre_item_medir,
        newMetric.valor_medicion,
      ]
    );
    await pool.query(
      `
        INSERT INTO devOpsData (tipo_medicion, pais, mes, nombre_item_medir, valor_medicion)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [
        newMetric.tipo_medicion,
        newMetric.pais,
        newMetric.mes,
        "Lead Time DevOps",
        parseFloat(leadTime),
      ]
    );
    await pool.query(
      `
        INSERT INTO devOpsData (tipo_medicion, pais, mes, nombre_item_medir, valor_medicion, valor_medicion_porcentual)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [
        newMetric.tipo_medicion,
        newMetric.pais,
        newMetric.mes,
        "Tasa de Éxito",
        0,
        parseFloat(valorMedicionPorcentual),
      ]
    );
    await pool.query(
      `
        INSERT INTO devOpsData (tipo_medicion, pais, mes, nombre_item_medir, valor_medicion)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [
        newMetric.tipo_medicion,
        newMetric.pais,
        newMetric.mes,
        "Frecuencia de Liberación",
        parseFloat(valorMedicion) / 30,
      ]
    );

    await pool.query("COMMIT");

    await postHispamMetrics(mes);

    return NextResponse.json({ message: "Métricas creadas" }, { status: 201 });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log("Error creating metrics", error);
    return NextResponse.json(
      { error: "Error creating metrics" },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  try {
    const { _parsed } = req.cookies;
    const token = _parsed.get("next-auth.session-token");

    if (!token) return NextResponse.json({ message: "Unauthorized" });

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
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM devOpsData
      WHERE tipo_medicion = 'Desempeño DEVOPS'
        AND mes = $1
        AND pais = $2
      ORDER BY id ASC
    `,
      [Number(mes), pais]
    );

    return result.rows;
  } catch (error) {
    console.log("🚀 ~ getMetrics ~ error:", error);
    return [];
  }
};

const postHispamMetrics = async (mes) => {
  try {
    const hispamMetrics = await pool.query(
      `
      SELECT *
      FROM devOpsData
      WHERE tipo_medicion = 'Desempeño DEVOPS'
        AND mes = $1
        AND pais = 'HISPAM'
    `,
      [parseInt(mes)]
    );

    if (hispamMetrics.rows.length > 0) return;

    const result = await pool.query(
      `
      SELECT *
      FROM devOpsData
      WHERE tipo_medicion = 'Desempeño DEVOPS'
        AND mes = $1
        AND anio = '2024'
      ORDER BY id ASC
      `,
      [Number(mes)]
    );

    const ctdDesplie = result.rows.filter(
      (metric) => metric.nombre_item_medir === "Cantidad de Despliegues"
    );
    const leadTime = result.rows.filter(
      (metric) => metric.nombre_item_medir === "Lead Time DevOps"
    );
    const tasaExito = result.rows.filter(
      (metric) => metric.nombre_item_medir === "Tasa de Éxito"
    );
    const freLibera = result.rows.filter(
      (metric) => metric.nombre_item_medir === "Frecuencia de Liberación"
    );

    const newMetric = {
      tipo_medicion: "Desempeño DEVOPS",
      pais: "HISPAM",
      mes: parseInt(mes),
      nombre_item_medir: "Cantidad de Despliegues",
      valor_medicion:
        ctdDesplie.reduce((total, metric) => total + metric.valor_medicion, 0) /
        8,
    };

    await pool.query("BEGIN");

    await pool.query(
      `
        INSERT INTO devOpsData (tipo_medicion, pais, mes, nombre_item_medir, valor_medicion)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [
        newMetric.tipo_medicion,
        newMetric.pais,
        newMetric.mes,
        newMetric.nombre_item_medir,
        newMetric.valor_medicion,
      ]
    );
    await pool.query(
      `
        INSERT INTO devOpsData (tipo_medicion, pais, mes, nombre_item_medir, valor_medicion)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [
        newMetric.tipo_medicion,
        newMetric.pais,
        newMetric.mes,
        "Lead Time DevOps",
        leadTime.reduce((total, metric) => total + metric.valor_medicion, 0) /
          8,
      ]
    );
    await pool.query(
      `
        INSERT INTO devOpsData (tipo_medicion, pais, mes, nombre_item_medir, valor_medicion, valor_medicion_porcentual)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [
        newMetric.tipo_medicion,
        newMetric.pais,
        newMetric.mes,
        "Tasa de Éxito",
        0,
        tasaExito.reduce(
          (total, metric) => total + metric.valor_medicion_porcentual,
          0
        ) / 8,
      ]
    );
    /*await pool.query(
      `
        INSERT INTO devOpsData (tipo_medicion, pais, mes, nombre_item_medir, valor_medicion)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [
        newMetric.tipo_medicion,
        newMetric.pais,
        newMetric.mes,
        "Frecuencia de Liberación",
        parseFloat(valorMedicion) / 30,
      ]
    );*/

    await pool.query("COMMIT");
  } catch (error) {
    console.log("🚀 ~ postHispamMetrics ~ error:", error);
    return NextResponse.json(
      { error: "Error getting metrics" },
      { status: 500 }
    );
  }
};
