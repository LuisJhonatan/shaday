import pool from "@/lib/db";
import { encryptPassword } from "@/lib/password";
import { ChangePasswordSchema } from "@/schemas/auth/auth.schema";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payloadHeader = req.headers.get("x-user-payload"); // Obtener el payload del header
    const payloadHeaderParse = JSON.parse(payloadHeader!); // Parsear el payload del header
    const body = ChangePasswordSchema.parse(await req.json()); // Validar el cuerpo de la petición con el esquema de Zod

    const { old_password, new_password } = body; // Desestructurar el cuerpo de la petición

    if (old_password === new_password) { // Si la nueva contraseña es igual a la antigua devuelve un error 400
      return new NextResponse(
        JSON.stringify({
          message: "La nueva contraseña no puede ser igual a la antigua",
        }),
        { status: 400 }
      );
    }

    const hashedNewPassword = await encryptPassword(new_password); // Hashear la nueva contraseña

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE users SET password = ? WHERE user_id = ?`,
      [hashedNewPassword, payloadHeaderParse.id]
    ); // Actualizar la contraseña en la base de datos

    if (result.affectedRows === 0) { 
      // Si no se actualiza la contraseña devuelve un error 404
      return new NextResponse(
        JSON.stringify({ message: "Usuario no encontrado" }),
        { status: 404 }
      );
    }

    return new NextResponse( 
      JSON.stringify({ message: "Contraseña actualizada correctamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en la ruta protegida:", error);
  }
}
