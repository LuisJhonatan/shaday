import { ChangePasswordSchema } from "@/schemas/auth/auth.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log(req.json());
    
    const payloadHeader = req.headers.get("x-user-payload");
    const body = ChangePasswordSchema.parse(await req.json());

    const { old_password, new_password } = body; // Desestructurar el cuerpo de la petición

    console.log(old_password, new_password); // Imprimir las contraseñas en la consola
    return new NextResponse(JSON.stringify({ message: "Password changed successfully" }), { status: 200 });

  } catch (error) {
    console.error("Error en la ruta protegida:", error);    
  }
}
