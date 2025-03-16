import { createClient } from "@/lib/supabase/server";
import CustomerTitle from "./components/CustomerTitle";
import CustomerUserInfo from "./components/CustomerUserInfo";

export default async function CustomerPage() {
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
      <CustomerTitle />
      <CustomerUserInfo user={user} role={profile?.role ?? "customer"} />
    </div>
  );
}
