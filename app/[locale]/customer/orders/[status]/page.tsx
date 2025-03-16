import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

import OrderCard from "./components/OrderCard";
import OrderTitle from "./components/OrderTitle";
import OrderStatusTabs from "./components/OrderStatusTabs";
import NoOrdersMessage from "./components/NoOrdersMessage";

export default async function CustomerOrdersPage({
  params,
}: {
  params: Promise<{ status: Database["public"]["Enums"]["order_status"] }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .eq("status", (await params).status)
    .order("updated_at", { ascending: false });

  const { data: order_items } = await supabase.from("order_items").select("*");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id ?? "")
    .single();

  const { data: products } = await supabase.from("products").select("*");

  const getOrderItems = (id: number) =>
    order_items?.filter((orderItem) => orderItem.order_id === id) ?? [];

  const ordersWithItems =
    orders?.map((order) => ({
      ...order,
      orderItems: getOrderItems(order.id).map((orderItem) => orderItem),
    })) ?? [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <OrderTitle />
        </div>

        <div className="mb-6">
          <OrderStatusTabs status={(await params).status} />
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ordersWithItems.length === 0 ? (
            <NoOrdersMessage />
          ) : (
            ordersWithItems.map((order) => (
              <OrderCard
                key={order.id}
                profile={profile}
                products={products ?? []}
                order={order}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
