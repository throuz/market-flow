import { createClient } from "@/utils/supabase/server";
import VendorTitle from "./components/VendorTitle";
import VendorUserInfo from "./components/VendorUserInfo";

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
      <VendorTitle />
      <VendorUserInfo user={user} role={profile?.role ?? "customer"} />
    </div>
  );
}
