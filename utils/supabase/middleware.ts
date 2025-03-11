import { Database } from "@/database.types";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
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

  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isLoggedIn && pathname === "/") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user?.id ?? "")
      .single();

    const roleRedirects: Record<
      Database["public"]["Enums"]["app_role"],
      string
    > = {
      admin: "/admin",
      vendor: "/vendor",
      customer: "/customer",
    };

    const redirectUrl = profile?.role
      ? roleRedirects[profile.role]
      : "/protected";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return response;
};
