import { createClient } from "@/utils/supabase/server";

export default async function VendorProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase.from("products").select("*");

  return (
    <div className="flex flex-col gap-2 items-center p-10">
      <h2 className="font-bold text-2xl mb-4">Your products</h2>
      <pre className="text-xs font-mono p-3 rounded border max-h-320 overflow-auto">
        {JSON.stringify(products, null, 2)}
      </pre>
    </div>
  );
}
