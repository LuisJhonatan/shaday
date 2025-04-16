import { VerifyResetPasswordSchema } from "@/schemas/auth/auth.schema";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Importar jwtVerify de jose
import { z } from "zod";
import { encryptPassword } from "@/lib/password";
import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function PUT(req: NextRequest) {
  try {
    const body = VerifyResetPasswordSchema.parse(await req.json()); // Extraer el cuerpo de la petición

    const { password, token } = body; // Desestructurar el cuerpo de la petición

    // Verificar el token de restablecimiento de contraseña usando jose
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_RESET_SECRET!)
    );

    const { id } = payload; // Desestructurar el cuerpo del payload

    const hashedPassword = await encryptPassword(password); // Hashear la nueva contraseña

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE users SET password = ? WHERE user_id = ?`,
      [hashedPassword, id]
    ); // Actualizar la contraseña en la base de datos

    if (result.affectedRows === 0) {
      // Si no se actualiza la contraseña devuelve un error 404
      return new NextResponse(
        JSON.stringify({ message: "Usuario no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Contraseña actualizada correctamente" }),
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
      JSON.stringify({ message: "Error al restablecer la contraseña" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
