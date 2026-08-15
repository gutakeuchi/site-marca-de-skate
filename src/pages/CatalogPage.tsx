import { Alert, Box, Container, Typography } from "@mui/material";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { categories, products } from "../data/catalog";

export default function CatalogPage() {
  const { slug } = useParams();

  const category = useMemo(
    () => categories.find((item) => item.slug === slug),
    [slug],
  );

  const items = useMemo(
    () => products.filter((product) => product.category === slug),
    [slug],
  );

  if (!category) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="warning">Categoria não encontrada.</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Box
        sx={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          py: { xs: 5, md: 7 },
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="subtitle2" sx={{ color: "primary.main", mb: 1 }}>
            {category.group}
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: 48, md: 80 } }}>
            {category.title}
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 1 }}>
            {items.length} produtos na prateleira
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <ProductGrid products={items} />
      </Container>
    </Box>
  );
}
