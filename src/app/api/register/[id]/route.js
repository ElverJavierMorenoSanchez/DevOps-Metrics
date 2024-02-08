import bcrypt from "bcrypt";
import pool from "@/libs/DBConnect";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { email, user_name, password, rol, pais } = await req.json();

    if (!email || !user_name)
      return new NextResponse("Missing info", { status: 400 });

    if (password !== "") {
      const hashedPassword = await bcrypt.hash(password, 12);

      const query = `
      UPDATE "user_hispam" 
      SET 
        "email" = $1
        "user_name" = $2
        "password" = $3
        "rol" = $4
        "pais" = $5
      WHERE "id" = $6;
    `;

      const values = [email, user_name, hashedPassword, rol, pais, id];
      const result = await pool.query(query, values);
      return NextResponse.json(result);
    }

    const query = `
      UPDATE "user_hispam" 
      SET 
        "email" = $1,
        "user_name" = $2,
        "rol" = $3,
        "pais" = $4
      WHERE "id" = $5;
    `;

    const values = [email, user_name, rol, pais, id];
    const result = await pool.query(query, values);

    return NextResponse.json(result);
  } catch (error) {
    console.log(error, "REGISTRATION ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}