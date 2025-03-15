import * as React from "react";

import { createClient } from "@/utils/supabase/server";

import CheckoutForm from "./components/CheckoutForm";
import CheckoutTitle from "./components/CheckoutTitle";

export default async function CheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products } = await supabase.from("products").select("*");

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="flex justify-center items-center mb-6">
          <CheckoutTitle />
        </div>
        <div className="space-y-8">
          <CheckoutForm userId={user?.id ?? ""} products={products ?? []} />
        </div>
      </section>
    </div>
  );
}
