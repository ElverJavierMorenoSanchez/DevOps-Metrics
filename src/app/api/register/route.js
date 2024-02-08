import bcrypt from "bcrypt";
import pool from "@/libs/DBConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const query = `
      SELECT id, user_name, email, pais, rol FROM "user_hispam"
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
    const { email, user_name, password, rol, pais } = await req.json();

    if (!email || !user_name || !password)
      return new NextResponse("Missing info", { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 12);

    const query = `
      INSERT INTO "user_hispam" ("email", "user_name", "hashedPassword", "pais", "rol")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [email, user_name, hashedPassword, pais, rol];

    const result = await pool.query(query, values);

    return NextResponse.json(result);
  } catch (error) {
    console.log(error, "REGISTRATION ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
