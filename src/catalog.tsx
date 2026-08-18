import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "./api/client";
import {
  products as localProducts,
  type CategorySlug,
  type Product,
} from "./data/catalog";

type CatalogContextValue = {
  products: Product[];
  loading: boolean;
  fromApi: boolean;
  getProductById: (id: number) => Product | undefined;
  getByCategory: (slug: string) => Product[];
  getRelatedProducts: (product: Product, limit?: number) => Product[];
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

function normalize(items: Product[]): Product[] {
  return items.map((item) => ({
    ...item,
    category: item.category as CategorySlug,
  }));
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => normalize(localProducts));
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await api.products();
        if (!active) return;
        setProducts(
          normalize(
            response.items.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              category: item.category as CategorySlug,
            })),
          ),
        );
        setFromApi(true);
      } catch {
        if (!active) return;
        setProducts(normalize(localProducts));
        setFromApi(false);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<CatalogContextValue>(() => {
    const getProductById = (id: number) => products.find((product) => product.id === id);

    const getByCategory = (slug: string) =>
      products.filter((product) => product.category === slug);

    const getRelatedProducts = (product: Product, limit = 4) =>
      products
        .filter((item) => item.category === product.category && item.id !== product.id)
        .slice(0, limit);

    return {
      products,
      loading,
      fromApi,
      getProductById,
      getByCategory,
      getRelatedProducts,
    };
  }, [products, loading, fromApi]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog precisa estar dentro de CatalogProvider");
  }
  return context;
}
