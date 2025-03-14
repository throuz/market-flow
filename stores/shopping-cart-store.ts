import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export interface CartItem {
  product_id: number;
  quantity: number;
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
            set({
              cart: cart.map((item) =>
                item.product_id === newItem.product_id
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            });
          } else {
            set({ cart: [...cart, newItem] });
          }
        },

        updateCartItem: (product_id, quantity) => {
          set({
            cart: get().cart.map((item) =>
              item.product_id === product_id ? { ...item, quantity } : item
            ),
          });
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
