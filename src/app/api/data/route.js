import { NextResponse } from "next/server";
import pool, { schema } from "@/libs/DBConnect";
import getSession from "@/actions/getSession";

export async function POST() {
  try {
    const session = await getSession();

    if (!session) return NextResponse.json({ message: "Unauthorized" });
    return NextResponse.json({ hello: "hello" }, { status: 200 });
  } catch (error) {
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
      error: "error",
    });
  }
}

const searhMetrics = async () => {
  const data = await pool.query(`SELECT * FROM ${schema}.devopsdata`);

  return data.rows;
};
