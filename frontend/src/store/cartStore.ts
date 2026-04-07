import { create } from 'zustand';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  
  addToCart: (item) => {
    const currentItems = get().cartItems;
    const existingItem = currentItems.find(i => i.id === item.id);
    
    if (existingItem) {
      set({
        cartItems: currentItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      });
    } else {
      set({ cartItems: [...currentItems, { ...item, quantity: 1 }] });
    }
  },
  
  removeFromCart: (itemId) => {
    set({ cartItems: get().cartItems.filter(item => item.id !== itemId) });
  },
  
  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(itemId);
      return;
    }
    
    set({
      cartItems: get().cartItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    });
  },
  
  clearCart: () => {
    set({ cartItems: [] });
  },
  
  getTotalPrice: () => {
    return get().cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getTotalItems: () => {
    return get().cartItems.reduce((total, item) => total + item.quantity, 0);
  }
}));
