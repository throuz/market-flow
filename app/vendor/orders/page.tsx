import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

import OrderCard from "./components/OrderCard";
import OrderFormDialog from "./components/OrderFormDialog";
import { createOrder, deleteOrder, updateOrder } from "./actions";

export default async function VendorOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase.from("orders").select("*");
  const { data: order_items } = await supabase.from("order_items").select("*");
  const { data: profiles } = await supabase.from("profiles").select("*");
  const { data: products } = await supabase.from("products").select("*");

  const userIdOptions: {
    label: string;
    value: Database["public"]["Tables"]["orders"]["Row"]["user_id"];
  }[] = (() => {
    if (profiles) {
      return profiles
        .filter((profile) => profile.role === "customer")
        .map((profile) => ({
          label: profile.email,
          value: profile.id,
        }));
    }
    return [];
  })();

  const productIdOptions: {
    label: string;
    value: Database["public"]["Tables"]["products"]["Row"]["id"];
    price: number;
  }[] = (() => {
    if (products) {
      return products.map((product) => ({
        label: product.name,
        value: product.id,
        price: product.price_per_unit,
      }));
    }
    return [];
  })();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold">Orders</div>
          <OrderFormDialog
            userIdOptions={userIdOptions}
            productIdOptions={productIdOptions}
            onSubmit={createOrder}
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orders
            ?.map((order) => ({
              ...order,
              orderItems:
                order_items
                  ?.filter((orderItem) => orderItem.order_id === order.id)
                  .map(({ price, product_id, quantity }) => ({
                    price,
                    product_id,
                    quantity,
                  })) || [],
            }))
            .map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                userIdOptions={userIdOptions}
                productIdOptions={productIdOptions}
                onUpdate={updateOrder}
                onDelete={deleteOrder}
              />
            ))}
        </div>
      </section>
    </div>
  );
}
