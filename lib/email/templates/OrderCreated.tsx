import { Database } from "@/database.types";

interface OrderCreatedProps {
  orderData: Database["public"]["Tables"]["orders"]["Row"];
  orderItems: Database["public"]["Tables"]["order_items"]["Insert"][];
}

export default function OrderCreated({
  orderData,
  orderItems,
}: OrderCreatedProps) {
  return (
    <div>
      <p>
        Order <strong>#{orderData.id}</strong> has been successfully created!
      </p>
      <p>
        <strong>Order Details:</strong>
      </p>
      <ul>
        {orderItems.map((item) => (
          <li key={item.id}>
            {item.quantity} x {item.name} @ ${item.price} each
          </li>
        ))}
      </ul>
      <p>
        <strong>Total Price:</strong> ${orderData.total_price}
      </p>
    </div>
  );
}
