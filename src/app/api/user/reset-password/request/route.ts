import pool from "@/lib/db";
import { enviarCodigo } from "@/lib/mailer";
import { ResetPasswordSchema } from "@/schemas/auth/auth.schema";
import { SignJWT } from "jose";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
export async function POST(req: NextRequest) {
  try {
    const body = ResetPasswordSchema.parse(await req.json()); // Extraer el cuerpo de la petición

    const { email } = body; // Desestructurar el cuerpo de la petición

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE email = ?`,
      email
    ); // Consultar la base de datos para verificar el usuario

    if (rows.length === 0) {
      // Si no se encuentra el usuario devuelve un error 404
      return new NextResponse(
        JSON.stringify({ message: "Usuario no encontrado." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (rows[0].state !== "active") {
      // Si el usuario no está activo devuelve un error 403
      return new NextResponse(
        JSON.stringify({ message: "El usuario no está activo." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear el token de restablecimiento de contraseña usando jose
    const resetToken = await new SignJWT({
      id: rows[0].user_id,
      email: rows[0].email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("15m")
      .sign(new TextEncoder().encode(process.env.JWT_RESET_SECRET!));

    const link = `${process.env
      .BASE_URL!}reset-password/?resetToken=${resetToken}`; // Crear el link para restablecer la contraseña
    console.log(resetToken);

    await enviarCodigo("luis.baca.s@uni.pe", link); // Enviar el correo electrónico con el link para restablecer la contraseña

    return new NextResponse(
      JSON.stringify({
        message: "Se ha enviado un enlace para restablecer la contraseña.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ message: error.issues[0].message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: "Error al restablecer la contraseña." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
