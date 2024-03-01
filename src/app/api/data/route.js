import { NextResponse } from "next/server";
import pool, { schema } from "@/libs/DBConnect";
import getSession from "@/actions/getSession";
import { utils, read } from "xlsx";

export async function POST(req, res) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = read(buffer, { type: "buffer" });
    const sheetname = workbook.SheetNames[0];

    const jsonObjects = utils.sheet_to_json(workbook.Sheets[sheetname]);
    const metrics = await insertMetrics(jsonObjects);
    return NextResponse.json(metrics, { status: 200 });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json({ error }, { status: 407 });
  }
}

export async function GET(req, res) {
  try {
    const session = await getSession();

    if (!session) return NextResponse.json({ message: "Unauthorized" });
    const data = await searhMetrics();
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
    });
  }
}

export async function DELETE(req, res) {
  try {
    const session = await getSession();

    if (!session) return NextResponse.json({ message: "Unauthorized" });

    const query = `DELETE FROM ${schema}.devopsdata WHERE anio = '2024'`;

    const data = await pool.query(query);

    return NextResponse.json({ message: "Deleted", data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
    });
  }
}

const searhMetrics = async () => {
  const data = await pool.query(`SELECT * FROM ${schema}.devopsdata`);

  return data.rows;
};

const insertMetrics = async (data) => {
  const query = `
    INSERT INTO ${schema}.devopsdata (tipo_medicion, pais, mes, anio, nombre_item_medir, valor_medicion, valor_meta, avance_real, avance_estimado, valor_medicion_porcentual) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;

  const metrics = data.map(async (row) => {
    try {
      const values = [
        row["Tipo Medicion"],
        row["Pais"],
        row["Mes"],
        row["Año"],
        row["Nombre Item a Medir"],
        validateData(row["Valor Medicion"]),
        validateData(row["Valor Meta"]),
        validateData(row["%avance Real del plan de desarrollo"]),
        validateData(row["%avance Estimado del plan de desarrollo"]),
        validateData(row["Valor Medicion %"]),
      ];

      const metric = await pool.query(query, values);
      return metric.rows[0];
    } catch (error) {
      console.log("🚀 ~ insertMetrics ~ error:", error);
    }
  });
  await Promise.all(metrics);
  return metrics;
};

const validateData = (data) => {
  if (!data) return 0;
  if (data === "N/A") return 0;
  return data;
};
