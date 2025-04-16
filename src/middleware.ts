import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Importa jwtVerify de jose

export async function middleware(req: NextRequest) {
  console.log("Middleware ejecutado para:", req.nextUrl.pathname);

  const token = req.cookies.get("access_token")?.value; // Accede a la cookie del token

  if (!token) {
    // Si no hay token y la solicitud no es una API, redirige

    return NextResponse.json(
      { error: "No autenticado. Inicia sesión." },
      { status: 401 }
    );
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Convierte la clave secreta a Uint8Array
    const { payload } = await jwtVerify(token, secret); // Verifica el token
    // Agrega el payload como un encabezado personalizado
    const response = NextResponse.next();
    response.headers.set("x-user-payload", JSON.stringify(payload));

    return response; // Continúa con la solicitud
  } catch {
    if (req.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Configuración de las rutas protegidas
export const config = {
  matcher: ["/api/protected/:path*", "/api/auth/change-password/:path*"],
};
