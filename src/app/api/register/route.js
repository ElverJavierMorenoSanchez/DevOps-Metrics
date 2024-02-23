import bcrypt from "bcrypt";
import pool, { schema } from "@/libs/DBConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { _parsed } = req.cookies;
    const token = _parsed.get("next-auth.session-token");

    if (!token) return NextResponse.json({ message: "Unauthorized" });

    const query = `
      SELECT id, user_name, email, pais, rol FROM ${schema}.user_hispam
    `;

    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.log(error, "REGISTRATION ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { _parsed } = req.cookies;
    const token = _parsed.get("next-auth.session-token");

    if (!token) return NextResponse.json({ message: "Unauthorized" });

    const { email, user_name, password, rol, pais } = await req.json();

    if (!email || !user_name || !password)
      return new NextResponse("Missing info", { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 12);

    const query = `
      INSERT INTO ${schema}.user_hispam ("email", "user_name", "hashedPassword", "pais", "rol")
      VALUES ($1, $2, $3, $4, $5)
      ;
    `;

    const values = [email, user_name, hashedPassword, pais, rol];

    const result = await pool.query(query, values);

    return NextResponse.json(result);
  } catch (error) {
    console.log(error, "REGISTRATION ERROR");

    if (error.code === "23505") {
      return new NextResponse("El usuario ya existe", { status: 301 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
