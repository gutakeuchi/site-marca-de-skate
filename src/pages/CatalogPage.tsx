import { Box, Button, Container, Typography } from "@mui/material";
import { useMemo } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useCatalog } from "../catalog";
import EmptyState from "../components/EmptyState";
import ProductGrid from "../components/ProductGrid";
import { getCategory } from "../data/catalog";
import { usePageTitle } from "../hooks/usePageTitle";

export default function CatalogPage() {
  const { slug } = useParams();
  const category = getCategory(slug);
  const { getByCategory } = useCatalog();
  const items = useMemo(() => getByCategory(slug ?? ""), [getByCategory, slug]);

  usePageTitle(category?.title);

  if (!category) {
    return (
      <EmptyState
        eyebrow="404"
        title="Categoria sumiu"
        description="Essa prateleira não existe. Volta para a home e escolhe outra linha."
        action={
          <Button variant="contained" component={RouterLink} to="/">
            Ir para a loja
          </Button>
        }
      />
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
