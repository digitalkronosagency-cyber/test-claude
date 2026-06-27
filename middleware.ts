import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import type { SessionData } from "@/lib/session";

const SESSION_OPTIONS = {
  password: process.env.SESSION_SECRET!,
  cookieName: "belle-epoque-session",
  cookieOptions: { secure: process.env.NODE_ENV === "production", httpOnly: true, sameSite: "lax" as const },
};

async function readSession(request: NextRequest): Promise<SessionData> {
  // In middleware we use req+res form (3 args)
  const res = new NextResponse();
  return getIronSession<SessionData>(request, res, SESSION_OPTIONS);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/espace-client") && !pathname.startsWith("/espace-client/connexion")) {
    const session = await readSession(request);
    if (!session.clienteId) {
      const url = request.nextUrl.clone();
      url.pathname = "/espace-client/connexion";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/espace-client/connexion") {
    const session = await readSession(request);
    if (session.clienteId) {
      const url = request.nextUrl.clone();
      url.pathname = "/espace-client/tableau-de-bord";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/connexion")) {
    const session = await readSession(request);
    if (!session.adminEmail) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/connexion";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/admin/connexion") {
    const session = await readSession(request);
    if (session.adminEmail) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/clientes";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/espace-client/:path*", "/admin/:path*"],
};
