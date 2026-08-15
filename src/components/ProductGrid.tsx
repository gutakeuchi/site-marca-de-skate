import { Button, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Product } from "../data/catalog";
import EmptyState from "./EmptyState";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        eyebrow="Catálogo"
        title="Nada por aqui"
        description="Essa prateleira está vazia. Escolhe outra categoria e continua a sessão."
        action={
          <Button variant="contained" component={RouterLink} to="/">
            Ir para a loja
          </Button>
        }
      />
    );
  }

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
