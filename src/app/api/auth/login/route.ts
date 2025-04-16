import pool from "@/lib/db";
import { comparePassword } from "@/lib/password";
import { AuthSchema } from "@/schemas/auth/auth.schema";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose"; // Importa SignJWT de jose
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = AuthSchema.parse(await req.json()); // Extraer el cuerpo de la petición

    const { email, password } = body; // Desestructurar el cuerpo de la petición

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    ); // Consultar la base de datos para verificar el usuario

    if (rows.length === 0) {
      // Si no se encuentra el usuario devuelve un error 404
      return new NextResponse(
        JSON.stringify({ message: "Usuario no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const passwordIsValid = await comparePassword(password, rows[0].password); // Comparar la contraseña ingresada con la almacenada en la base de datos

    if (!passwordIsValid) {
      // Si la contraseña no es válida devuelve un error 401
      return new NextResponse(
        JSON.stringify({ message: "Contraseña incorrecta" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...user } = rows[0]; // Desestructurar el usuario para eliminar la contraseña
    const payload = { id: user.user_id, email: user.email }; // Crear el payload del token con el id y el email del usuario

    // Crear el token de acceso usando jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Convierte la clave secreta a un Uint8Array
    const accessToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" }) // Define el algoritmo de firma
      .setExpirationTime("1m") // Establece el tiempo de expiración
      .sign(secret); // Firma el token con la clave secreta
    // const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    //   expiresIn: "7d",
    // }); // Crear el token de acceso y el token de refresco

    return new NextResponse( // Devolver una respuesta con el token en las cookies y el usuario
      JSON.stringify({
        message: "Usuario autenticado",
        user,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": [
            `access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=60`,
            // `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${
            //   7 * 24 * 60 * 60
            // }`,
          ].join(", "),
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      // Si hay un error de validación devuelve un error 400
      return new NextResponse(
        JSON.stringify({
          message: "Error de validación",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    //  Si hay un error inesperado devuelve un error 500
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
