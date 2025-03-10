import Link from "next/link";
import { Database } from "@/database.types";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import OrderCard from "./components/OrderCard";
import OrderFormDialog from "./components/OrderFormDialog";
import { createOrder, deleteOrder, updateOrder } from "./actions";

const orderStatusOptions: {
  label: string;
  value: Database["public"]["Enums"]["order_status"];
}[] = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default async function VendorOrdersPage({
  params,
  searchParams,
}: {
  params: Promise<{ status: Database["public"]["Enums"]["order_status"] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("status", (await params).status)
    .order("updated_at", { ascending: false });
  const { data: order_items } = await supabase.from("order_items").select("*");
  const { data: profiles } = await supabase.from("profiles").select("*");
  const { data: categories } = await supabase.from("categories").select("*");
  const { data: products } = await supabase.from("products").select("*");

  const getOrderItems = (id: number) =>
    order_items?.filter((orderItem) => orderItem.order_id === id) ?? [];

  const ordersWithItems =
    orders?.map((order) => ({
      ...order,
      orderItems: getOrderItems(order.id).map(
        ({ price, product_id, quantity }) => ({
          price,
          product_id,
          quantity,
        })
      ),
    })) ?? [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold">Orders</div>
          <OrderFormDialog
            profiles={profiles ?? []}
            categories={categories ?? []}
            products={products ?? []}
            onSubmit={createOrder}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <Input
            type="text"
            placeholder="Search by Order ID"
            className="w-full sm:w-64"
          />
          <Tabs value={(await params).status}>
            <TabsList>
              {orderStatusOptions.map(({ label, value }) => (
                <TabsTrigger key={value} value={value} asChild>
                  <Link href={`/vendor/orders/${value}`}>{label}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ordersWithItems.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              profiles={profiles ?? []}
              categories={categories ?? []}
              products={products ?? []}
              onUpdate={updateOrder}
              onDelete={deleteOrder}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
