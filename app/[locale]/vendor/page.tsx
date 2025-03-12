import { createClient } from "@/utils/supabase/server";
import VendorHeader from "./components/vendor-header";
import VendorUserInfo from "./components/vendor-user-info";

export default async function VendorPage() {
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
      <VendorHeader />
      <VendorUserInfo user={user} role={profile?.role ?? "customer"} />
    </div>
  );
}
