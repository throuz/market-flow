import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function VendorPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-2 items-center p-10">
      <h2 className="font-bold text-2xl mb-4">Your user details</h2>
      <pre className="text-xs font-mono p-3 rounded border max-h-320 overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
