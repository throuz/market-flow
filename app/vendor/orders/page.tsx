import { createClient } from "@/utils/supabase/server";
import OrderFormDialog from "./components/OrderFormDialog";
import OrderCard from "./components/OrderCard";
import { createOrder, updateOrder, deleteOrder } from "./actions";

export default async function VendorOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase.from("orders").select("*");

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold">Orders</div>
          <OrderFormDialog onSubmit={createOrder} />
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orders?.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdate={updateOrder}
              onDelete={deleteOrder}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
