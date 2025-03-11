import { createClient } from "@/utils/supabase/server";

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

  const userDisplay = {
    id: user?.id ?? "",
    email: user?.email ?? "",
    role: profile?.role ?? "",
    created_at: new Date(user?.created_at ?? "").toLocaleString(),
    last_sign_in: user?.last_sign_in_at
      ? new Date(user.last_sign_in_at).toLocaleString()
      : "Never",
  };

  return (
    <div className="flex flex-col gap-4 items-center p-10">
      <h2 className="font-bold text-2xl mb-4">Dashboard</h2>
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          {Object.entries(userDisplay).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium capitalize">
                {key.replace(/_/g, " ")}:
              </span>
              <span className="text-gray-600">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
