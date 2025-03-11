import { Database } from "@/database.types";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  const response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/protected", "/admin", "/vendor", "/customer"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to sign-in if not logged in and the route is protected
  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .single();

  const rolePaths: Record<Database["public"]["Enums"]["app_role"], string> = {
    admin: "/admin",
    vendor: "/vendor",
    customer: "/customer",
  };

  // Redirect users to their respective role-based pages
  if (
    isLoggedIn &&
    profile?.role &&
    !pathname.startsWith("/protected") &&
    !pathname.startsWith(rolePaths[profile.role])
  ) {
    return NextResponse.redirect(new URL(rolePaths[profile.role], request.url));
  }

  return response;
};
