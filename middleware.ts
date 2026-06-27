import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

function makeClient(request: NextRequest) {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    }
  );
}

export async function middleware(request: NextRequest) {
  const response = await updateSupabaseSession(request);
  const { pathname } = request.nextUrl;

  // ── /espace-client : session requise (sauf /connexion) ──────────────────
  if (
    pathname.startsWith("/espace-client") &&
    !pathname.startsWith("/espace-client/connexion")
  ) {
    const { data: { user } } = await makeClient(request).auth.getUser();
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/espace-client/connexion";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Déjà connectée → /espace-client/connexion redirige vers tableau-de-bord
  if (pathname.startsWith("/espace-client/connexion")) {
    const { data: { user } } = await makeClient(request).auth.getUser();
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = "/espace-client/tableau-de-bord";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // ── /admin : session requise (sauf /connexion) ───────────────────────────
  // La vérification du rôle admin est faite dans app/admin/layout.tsx
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/connexion")
  ) {
    const { data: { user } } = await makeClient(request).auth.getUser();
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/connexion";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
