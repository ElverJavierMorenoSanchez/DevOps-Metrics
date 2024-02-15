import { NextResponse } from "next/server";
import pool from "@/libs/DBConnect";

export async function POST() {
  try {
    const { _parsed } = req.cookies;
    const token = _parsed.get("next-auth.session-token");

    if (!token) return NextResponse.json({ message: "Unauthorized" });
    return NextResponse.json({ hello: "hello" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 407 });
  }
}

export async function GET(req, res) {
  try {
    const { _parsed } = req.cookies;
    const token = _parsed.get("next-auth.session-token");

    if (!token) return NextResponse.json({ message: "Unauthorized" });
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
  const data = await pool.query("SELECT * FROM DevOpsData");

  return data.rows;
};
