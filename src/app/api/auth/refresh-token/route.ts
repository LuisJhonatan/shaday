import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token");

    if (!refreshToken) {
      return new NextResponse(JSON.stringify({ message: "No autenticado" }), {
        status: 401,
      });
    }

    const payload = jwt.verify(
      refreshToken.value,
      process.env.JWT_REFRESH_SECRET!
    ) as jwt.JwtPayload;

    const newAccessToken = jwt.sign(
      { id: payload.id, email: payload.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1m" }
    );

    return new NextResponse(JSON.stringify({ message: "Token renovado" }), {
      status: 200,
      headers: {
        "Set-Cookie": `access_token=${newAccessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=60`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse(
        JSON.stringify({ message: "Error interno del servidor" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}
