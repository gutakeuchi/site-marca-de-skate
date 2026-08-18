import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, getToken } from "./api/client";
import type { Product } from "./data/catalog";

type CartItem = {
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
  addItem: (product: Product, size: string, qty: number) => Promise<void>;
  updateQty: (productId: number, size: string, qty: number) => Promise<void>;
  removeItem: (productId: number, size: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
};

const STORAGE_KEY = "wolf-board-cart";
const CartContext = createContext<CartContextValue | null>(null);

function readLocalCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeLocalCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function fromApi(items: CartItem[]): CartItem[] {
  return items.map((item) => ({
    productId: item.productId,
    name: item.name,
    image: item.image,
    price: item.price,
    size: item.size,
    qty: item.qty,
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readLocalCart());

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setItems(readLocalCart());
      return;
    }

    try {
      const cart = await api.cart.get();
      const next = fromApi(cart.items);
      setItems(next);
      writeLocalCart(next);
    } catch {
      setItems(readLocalCart());
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (product: Product, size: string, qty: number) => {
      if (getToken()) {
        const cart = await api.cart.addItem(product.id, size, qty);
        const next = fromApi(cart.items);
        setItems(next);
        writeLocalCart(next);
        return;
      }

      setItems((current) => {
        const index = current.findIndex(
          (item) => item.productId === product.id && item.size === size,
        );
        const next =
          index >= 0
            ? current.map((item, itemIndex) =>
                itemIndex === index ? { ...item, qty: item.qty + qty } : item,
              )
            : [
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
        writeLocalCart(next);
        return next;
      });
    },
    [],
  );

  const updateQty = useCallback(async (productId: number, size: string, qty: number) => {
    if (getToken()) {
      const cart = await api.cart.setQty(productId, size, qty);
      const next = fromApi(cart.items);
      setItems(next);
      writeLocalCart(next);
      return;
    }

    setItems((current) => {
      const next = current
        .map((item) =>
          item.productId === productId && item.size === size ? { ...item, qty } : item,
        )
        .filter((item) => item.qty > 0);
      writeLocalCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback(async (productId: number, size: string) => {
    if (getToken()) {
      const cart = await api.cart.removeItem(productId, size);
      const next = fromApi(cart.items);
      setItems(next);
      writeLocalCart(next);
      return;
    }

    setItems((current) => {
      const next = current.filter(
        (item) => !(item.productId === productId && item.size === size),
      );
      writeLocalCart(next);
      return next;
    });
  }, []);

  const clear = useCallback(async () => {
    if (getToken()) {
      const cart = await api.cart.clear();
      const next = fromApi(cart.items);
      setItems(next);
      writeLocalCart(next);
      return;
    }

    writeLocalCart([]);
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.qty, 0),
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
      addItem,
      updateQty,
      removeItem,
      clear,
      refresh,
    }),
    [items, addItem, updateQty, removeItem, clear, refresh],
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
