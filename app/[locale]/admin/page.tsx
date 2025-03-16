import { createClient } from "@/lib/supabase/server";
import AdminTitle from "./components/AdminTitle";
import AdminUserInfo from "./components/AdminUserInfo";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .single();

  return (
    <div className="flex flex-col gap-4 items-center p-10">
      <AdminTitle />
      <AdminUserInfo user={user} role={profile?.role ?? "customer"} />
    </div>
  );
}
