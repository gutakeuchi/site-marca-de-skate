import { Grid } from "@mui/material";
import type { Product } from "../data/catalog";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 6, sm: 6, md: 4 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
