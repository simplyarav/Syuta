import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i._id === item._id);
        
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...currentItems, item], isOpen: true });
        }
      },
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i._id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((i) =>
            i._id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state like isOpen
    }
  )
);
