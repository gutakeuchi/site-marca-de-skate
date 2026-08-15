import {
  createContext,
  useCallback,
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

  const persist = useCallback((updater: (current: CartItem[]) => CartItem[]) => {
    setItems((current) => {
      const next = updater(current);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addItem = useCallback(
    (product: Product, size: string, qty: number) => {
      persist((current) => {
        const index = current.findIndex(
          (item) => item.productId === product.id && item.size === size,
        );
        if (index >= 0) {
          return current.map((item, itemIndex) =>
            itemIndex === index ? { ...item, qty: item.qty + qty } : item,
          );
        }
        return [
          ...current,
          {
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            size,
            qty,
          },
        ];
      });
    },
    [persist],
  );

  const updateQty = useCallback(
    (productId: number, size: string, qty: number) => {
      persist((current) =>
        current
          .map((item) =>
            item.productId === productId && item.size === size ? { ...item, qty } : item,
          )
          .filter((item) => item.qty > 0),
      );
    },
    [persist],
  );

  const removeItem = useCallback(
    (productId: number, size: string) => {
      persist((current) =>
        current.filter((item) => !(item.productId === productId && item.size === size)),
      );
    },
    [persist],
  );

  const clear = useCallback(() => persist(() => []), [persist]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.qty, 0),
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
      addItem,
      updateQty,
      removeItem,
      clear,
    }),
    [items, addItem, updateQty, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart precisa estar dentro de CartProvider");
  }
  return context;
}
