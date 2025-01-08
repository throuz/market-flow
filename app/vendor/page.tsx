import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";

export default async function VendorPage() {
  const supabase = await createClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is vendor page
        </div>
      </div>
    </div>
  );
}
