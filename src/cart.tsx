import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./data/catalog";

export type CartItem = {
  productId: number;
  name: string;
  image: string;
  price: number;
  size: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product, size: string, qty: number) => void;
  updateQty: (productId: number, size: string, qty: number) => void;
  removeItem: (productId: number, size: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "wolf-board-cart";
const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readCart());

  function persist(next: CartItem[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      itemCount: items.reduce((sum, item) => sum + item.qty, 0),
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
      addItem(product, size, qty) {
        const next = [...items];
        const index = next.findIndex(
          (item) => item.productId === product.id && item.size === size,
        );
        if (index >= 0) {
          next[index] = { ...next[index], qty: next[index].qty + qty };
        } else {
          next.push({
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            size,
            qty,
          });
        }
        persist(next);
      },
      updateQty(productId, size, qty) {
        persist(
          items
            .map((item) =>
              item.productId === productId && item.size === size
                ? { ...item, qty }
                : item,
            )
            .filter((item) => item.qty > 0),
        );
      },
      removeItem(productId, size) {
        persist(
          items.filter(
            (item) => !(item.productId === productId && item.size === size),
          ),
        );
      },
      clear() {
        persist([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart precisa estar dentro de CartProvider");
  }
  return context;
}
