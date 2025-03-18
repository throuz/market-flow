import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export interface CartItem {
  product_id: number;
  quantity: number;
  stock_quantity: number; // Add stock quantity
}

interface CartStoreState {
  cart: CartItem[];
}

interface CartStoreActions {
  addToCart: (item: CartItem) => void;
  updateCartItem: (product_id: number, quantity: number) => void;
  removeFromCart: (product_id: number) => void;
  clearCart: () => void;
}

export type CartStore = CartStoreState & CartStoreActions;

export const defaultInitState: CartStoreState = {
  cart: [],
};

export const createCartStore = (
  initState: CartStoreState = defaultInitState
) => {
  return createStore<CartStore>()(
    persist(
      (set, get) => ({
        ...initState,

        addToCart: (newItem) => {
          const { cart } = get();
          const existingItem = cart.find(
            (item) => item.product_id === newItem.product_id
          );

          if (existingItem) {
            // Ensure that the total quantity doesn't exceed the stock
            const updatedQuantity = existingItem.quantity + newItem.quantity;
            if (updatedQuantity <= existingItem.stock_quantity) {
              set({
                cart: cart.map((item) =>
                  item.product_id === newItem.product_id
                    ? { ...item, quantity: updatedQuantity }
                    : item
                ),
              });
            } else {
              // If stock is insufficient, only update to the max stock available
              set({
                cart: cart.map((item) =>
                  item.product_id === newItem.product_id
                    ? { ...item, quantity: existingItem.stock_quantity }
                    : item
                ),
              });
            }
          } else {
            // Ensure new item does not exceed stock
            if (newItem.quantity <= newItem.stock_quantity) {
              set({ cart: [...cart, newItem] });
            } else {
              set({
                cart: [
                  ...cart,
                  { ...newItem, quantity: newItem.stock_quantity },
                ],
              });
            }
          }
        },

        updateCartItem: (product_id, quantity) => {
          const { cart } = get();
          const item = cart.find((item) => item.product_id === product_id);
          if (item) {
            // Ensure quantity doesn't exceed stock
            const updatedQuantity = Math.min(quantity, item.stock_quantity);
            set({
              cart: cart.map((item) =>
                item.product_id === product_id
                  ? { ...item, quantity: updatedQuantity }
                  : item
              ),
            });
          }
        },

        removeFromCart: (product_id) => {
          set({
            cart: get().cart.filter((item) => item.product_id !== product_id),
          });
        },

        clearCart: () => {
          set({ cart: [] });
        },
      }),
      { name: "shopping-cart-storage" }
    )
  );
};
