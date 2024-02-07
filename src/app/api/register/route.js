import bcrypt from "bcrypt";
import pool from "@/libs/DBConnect";
import { NextResponse } from "next/server";

export async function POST(resquest) {
  try {
    const { email, name, password } = await resquest.json();

    if (!email || !name || !password)
      return new NextResponse("Missing info", { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 12);

    const query = `
      INSERT INTO "user_hispam" ("email", "name", "hashedPassword")
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [email, name, hashedPassword];

    const result = await pool.query(query, values);

    return NextResponse.json(result);
  } catch (error) {
    console.log(error, "REGISTRATION ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
