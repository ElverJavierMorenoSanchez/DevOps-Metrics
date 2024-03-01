import { NextResponse } from "next/server";
import pool, { schema } from "@/libs/DBConnect";
import getSession from "@/actions/getSession";

export async function POST(req) {
  try {
    const session = await getSession();

    if (!session) return NextResponse.json({ message: "Unauthorized" });

    const body = await req.json();
    const { leadTime, mes, pais, valorMedicion, valorMedicionPorcentual } =
      body;

    const result = await pool.query(
      `
      SELECT *
      FROM ${schema}.devopsdata
      WHERE tipo_medicion = 'Desempeño DEVOPS'
        AND mes = $1
        AND pais = $2
        AND anio = '2024'
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

    await pool.query(queries.postData, [
      newMetric.tipo_medicion,
      newMetric.pais,
      newMetric.mes,
      newMetric.nombre_item_medir,
      newMetric.valor_medicion,
      0,
    ]);

    await pool.query(queries.postData, [
      newMetric.tipo_medicion,
      newMetric.pais,
      newMetric.mes,
      "Lead Time DevOps",
      parseFloat(leadTime),
      0,
    ]);
    await pool.query(queries.postData, [
      newMetric.tipo_medicion,
      newMetric.pais,
      newMetric.mes,
      "Tasa de Éxito",
      0,
      parseFloat(valorMedicionPorcentual) / 100,
    ]);
    await pool.query(queries.postData, [
      newMetric.tipo_medicion,
      newMetric.pais,
      newMetric.mes,
      "Frecuencia de Liberación",
      parseFloat(valorMedicion) / 30,
      0,
    ]);

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
      await postClusterMetrics(mes, "HISPAM", queries.hispam);
      await postClusterMetrics(mes, "Cluster 1", queries.cluster1);
      await postClusterMetrics(mes, "Cluster 2", queries.cluster2);
    }

    return NextResponse.json({ message: "Métricas creadas" }, { status: 201 });
  } catch (error) {
    console.log("Error creating metrics", error);
    return NextResponse.json(
      { error: "Error creating metrics", problem: error },
      { status: 500 }
    );
  }
}

const postClusterMetrics = async (mes, nombrePais, query) => {
  try {
    const pais = await pool.query(
      `
      SELECT *
      FROM ${schema}.devopsdata
      WHERE tipo_medicion = 'Desempeño DEVOPS'
        AND mes = $1
        AND pais = $2
        AND anio = '2024'
    `,
      [parseInt(mes), nombrePais]
    );

    if (pais.rows.length > 0) {
      await putClusterMetrics(mes, nombrePais, query);
      return;
    }
    const prom = nombrePais === "HISPAM" ? 8 : 4;

    const result = await pool.query(query, [Number(mes)]);

    const ctdDesplie = result.rows.filter(
      (metric) => metric.nombre_item_medir === "Cantidad de Despliegues"
    );
    const leadTime = result.rows.filter(
      (metric) => metric.nombre_item_medir === "Lead Time DevOps"
    );
    const tasaExito = result.rows.filter(
      (metric) => metric.nombre_item_medir === "Tasa de Éxito"
    );
    /**
     const freLibera = result.rows.filter(
      (metric) => metric.nombre_item_medir === "Frecuencia de Liberación"
    ); 
     
     */

    const newMetric = {
      tipo_medicion: "Desempeño DEVOPS",
      pais: nombrePais,
      mes: parseInt(mes),
      nombre_item_medir: "Cantidad de Despliegues",
      valor_medicion:
        ctdDesplie.reduce((total, metric) => total + metric.valor_medicion, 0) /
        prom,
    };

    await pool.query("BEGIN");

    await pool.query(queries.postData, [
      newMetric.tipo_medicion,
      newMetric.pais,
      newMetric.mes,
      newMetric.nombre_item_medir,
      newMetric.valor_medicion,
      0,
    ]);
    await pool.query(queries.postData, [
      newMetric.tipo_medicion,
      newMetric.pais,
      newMetric.mes,
      "Lead Time DevOps",
      leadTime.reduce((total, metric) => total + metric.valor_medicion, 0) /
        prom,
      0,
    ]);
    await pool.query(queries.postData, [
      newMetric.tipo_medicion,
      newMetric.pais,
      newMetric.mes,
      "Tasa de Éxito",
      0,
      tasaExito.reduce(
        (total, metric) => total + metric.valor_medicion_porcentual,
        0
      ) / prom,
    ]);
    /*await pool.query(
      queries.postData,
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

export const putClusterMetrics = async (mes, nombrePais, query) => {
  try {
    const pais = await pool.query(
      `
      SELECT *
      FROM ${schema}.devopsdata
      WHERE tipo_medicion = 'Desempeño DEVOPS'
        AND mes = $1
        AND pais = $2
        AND anio = '2024'
    `,
      [parseInt(mes), nombrePais]
    );

    if (pais.rows.length <= 0) return;

    const prom = nombrePais === "HISPAM" ? 8 : 4;

    const result = await pool.query(query, [Number(mes)]);

    const ctdDesplie = result.rows.filter(
      (metric) => metric.nombre_item_medir === "Cantidad de Despliegues"
    );
    const leadTime = result.rows.filter(
      (metric) => metric.nombre_item_medir === "Lead Time DevOps"
    );
    const tasaExito = result.rows.filter(
      (metric) => metric.nombre_item_medir === "Tasa de Éxito"
    );
    /**
     const freLibera = result.rows.filter(
      (metric) => metric.nombre_item_medir === "Frecuencia de Liberación"
    ); 
     
     */

    const newMetric = {
      tipo_medicion: "Desempeño DEVOPS",
      pais: nombrePais,
      mes: parseInt(mes),
      nombre_item_medir: "Cantidad de Despliegues",
      valor_medicion:
        ctdDesplie.reduce((total, metric) => total + metric.valor_medicion, 0) /
        prom,
    };

    await pool.query("BEGIN");

    await pool.query(queries.updateData, [
      newMetric.tipo_medicion,
      newMetric.pais,
      newMetric.mes,
      newMetric.nombre_item_medir,
      newMetric.valor_medicion,
      pais.rows[0].id,
      0,
    ]);

    await pool.query(queries.updateData, [
      newMetric.tipo_medicion,
      newMetric.pais,
      newMetric.mes,
      "Lead Time DevOps",
      leadTime.reduce((total, metric) => total + metric.valor_medicion, 0) /
        prom,
      pais.rows[1].id,
      0,
    ]);
    await pool.query(queries.updateData2, [
      newMetric.tipo_medicion,
      newMetric.pais,
      newMetric.mes,
      "Tasa de Éxito",
      0,
      Math.round(
        tasaExito.reduce(
          (total, metric) => total + metric.valor_medicion_porcentual,
          0
        ) / prom
      ),
      pais.rows[2].id,
    ]);
    /*await pool.query(
      queries.updateData,
      [
        newMetric.tipo_medicion,
        newMetric.pais,
        newMetric.mes,
        "Frecuencia de Liberación",
        parseFloat(valorMedicion) / 30,
        pais.rows[3].id,
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

export async function GET(req) {
  try {
    const session = await getSession();

    if (!session) return NextResponse.json({ message: "Unauthorized" });

    const url = new URL(req.url);

    const mes = url.searchParams.get("mes");
    const pais = url.searchParams.get("pais");

    const metrics = await getMetrics(pais, mes);

    return NextResponse.json(metrics);
  } catch (error) {
    console.log("Error getting metrics", error);
    return NextResponse.json(
      { error: "Error getting metrics", problem: error },
      { status: 500 }
    );
  }
}

const getMetrics = async (pais, mes) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM ${schema}.devopsdata
      WHERE tipo_medicion = 'Desempeño DEVOPS'
        AND mes = $1
        AND pais = $2
        AND anio = '2024'
      ORDER BY id ASC
    `,
      [Number(mes), pais]
    );

    return result.rows;
  } catch (error) {
    console.log("🚀 ~ getMetrics ~ error:", error);
    return error;
  }
};

export const queries = {
  postData: ` 
      INSERT INTO ${schema}.devopsdata (tipo_medicion, pais, mes, nombre_item_medir, valor_medicion, valor_medicion_porcentual)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
  cluster1: `
      SELECT *
      FROM ${schema}.devopsdata
      WHERE tipo_medicion = 'Desempeño DEVOPS'
        AND mes = $1
        AND anio = '2024'
        AND pais != 'Ecuador'
        AND pais != 'Mexico'
        AND pais != 'Uruguay'
        AND pais != 'Venezuela'
        AND pais != 'Cluster 1'
        AND pais != 'Cluster 2'
        AND pais != 'HISPAM'
      ORDER BY id ASC`,
  cluster2: `
      SELECT *
      FROM ${schema}.devopsdata
      WHERE tipo_medicion = 'Desempeño DEVOPS'
        AND mes = $1
        AND anio = '2024' 
        AND pais != 'Argentina'
        AND pais != 'Chile'
        AND pais != 'Colombia'
        AND pais != 'Peru'
        AND pais != 'Cluster 1'
        AND pais != 'Cluster 2'
        AND pais != 'HISPAM'
      ORDER BY id ASC
  `,
  hispam: `
      SELECT *
      FROM ${schema}.devopsdata
      WHERE tipo_medicion = 'Desempeño DEVOPS'
        AND mes = $1
        AND anio = '2024'
        AND pais != 'Cluster 1'
        AND pais != 'Cluster 2'
        AND pais != 'HISPAM'
      ORDER BY id ASC
  `,
  updateData: `
      UPDATE ${schema}.devopsdata 
      SET 
      tipo_medicion=$1, 
      pais=$2, 
      mes=$3, 
      nombre_item_medir=$4, 
      valor_medicion=$5,
      valor_medicion_porcentual=$7
      WHERE id = $6
  `,
  updateData2: `
      UPDATE ${schema}.devopsdata 
      SET 
      tipo_medicion=$1, 
      pais=$2, 
      mes=$3, 
      nombre_item_medir=$4, 
      valor_medicion=$5,
      valor_medicion_porcentual=$6
      WHERE id = $7
  `,
};
