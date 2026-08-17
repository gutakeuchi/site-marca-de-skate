import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid,
  Link,
  Snackbar,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useCart } from "../cart";
import EmptyState from "../components/EmptyState";
import ProductGrid from "../components/ProductGrid";
import ProductImage from "../components/ProductImage";
import QtyStepper from "../components/QtyStepper";
import SectionHeading from "../components/SectionHeading";
import { useCatalog } from "../catalog";
import { getCategory } from "../data/catalog";
import {
  getDescription,
  getInstallments,
  getSizeLabel,
  getSizes,
  getSku,
  getSpecs,
} from "../data/productInfo";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatPrice } from "../utils/assets";
import { categoryPath } from "../utils/paths";

export default function ProductPage() {
  const { id } = useParams();
  const { getProductById, getRelatedProducts } = useCatalog();
  const product = getProductById(Number(id));
  const { addItem } = useCart();
  const sizes = product ? getSizes(product.category) : [];
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0] : "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const category = product ? getCategory(product.category) : undefined;
  const related = useMemo(
    () => (product ? getRelatedProducts(product) : []),
    [product, getRelatedProducts],
  );

  usePageTitle(product?.name);

  useEffect(() => {
    setQty(1);
    const nextSizes = product ? getSizes(product.category) : [];
    setSize(nextSizes.length === 1 ? nextSizes[0] : "");
  }, [id, product]);

  if (!product || !category) {
    return (
      <EmptyState
        eyebrow="404"
        title="Produto não encontrado"
        description="Esse drop saiu da prateleira. Volta para a loja e escolhe outro."
        action={
          <Button variant="contained" component={RouterLink} to="/">
            Ir para a loja
          </Button>
        }
      />
    );
  }

  async function handleAdd() {
    if (!product || !size) return;
    await addItem(product, size, qty);
    setAdded(true);
  }

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Breadcrumbs
          sx={{ mb: 4, "& a, & p": { color: "rgba(255,255,255,0.55)", fontSize: 13 } }}
        >
          <Link component={RouterLink} to="/" underline="hover" color="inherit">
            Home
          </Link>
          <Link
            component={RouterLink}
            to={categoryPath(category.slug)}
            underline="hover"
            color="inherit"
          >
            {category.title}
          </Link>
          <Typography color="text.primary" sx={{ fontSize: 13 }}>
            {product.name}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={{ xs: 3, md: 6 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ProductImage
              src={product.image}
              alt={product.name}
              height={{ xs: 360, md: 520 }}
              padding={{ xs: 3, md: 5 }}
              lazy={false}
              sx={{ minHeight: { xs: 360, md: 560 } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: "primary.main", mb: 1 }}>
              {category.group} · {getSku(product)}
            </Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: 36, md: 52 }, mb: 2 }}>
              {product.name}
            </Typography>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              {formatPrice(product.price)}
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 3 }}>
              {getInstallments(product.price)}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.78)", mb: 4, maxWidth: 520 }}>
              {getDescription(product)}
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              {getSizeLabel(product.category)}
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={size}
              onChange={(_, value) => {
                if (value) setSize(value);
              }}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mb: 3,
                "& .MuiToggleButton-root": {
                  border: "1px solid rgba(255,255,255,0.2) !important",
                  borderRadius: "0 !important",
                  color: "#fff",
                  px: 1.8,
                  py: 0.8,
                  minWidth: 56,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: "0.08em",
                },
                "& .Mui-selected": {
                  bgcolor: "primary.main !important",
                  borderColor: "primary.main !important",
                  color: "#fff !important",
                },
              }}
            >
              {sizes.map((option) => (
                <ToggleButton key={option} value={option}>
                  {option}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <QtyStepper value={qty} onChange={setQty} />
              <Button
                variant="contained"
                size="large"
                onClick={handleAdd}
                disabled={!size}
                sx={{ flexGrow: 1, py: 1.4 }}
              >
                Adicionar ao carrinho
              </Button>
            </Stack>

            {!size ? (
              <Typography variant="body2" sx={{ color: "primary.main", mb: 3 }}>
                Escolhe {getSizeLabel(product.category).toLowerCase()} para continuar.
              </Typography>
            ) : null}

            <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

            <Stack spacing={1.2}>
              {getSpecs(product).map((spec) => (
                <Stack
                  key={spec.label}
                  direction="row"
                  justifyContent="space-between"
                  sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)", pb: 1 }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {spec.label}
                  </Typography>
                  <Typography variant="body2">{spec.value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {related.length > 0 ? (
          <Box sx={{ mt: { xs: 8, md: 12 } }}>
            <SectionHeading eyebrow="Complete o setup" title="Relacionados" />
            <ProductGrid products={related} />
          </Box>
        ) : null}
      </Container>

      <Snackbar
        open={added}
        autoHideDuration={3500}
        onClose={() => setAdded(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setAdded(false)}
          action={
            <Button color="inherit" size="small" component={RouterLink} to="/carrinho">
              Ver sacola
            </Button>
          }
          sx={{ bgcolor: "#111", color: "#fff", border: "1px solid", borderColor: "primary.main" }}
        >
          Produto adicionado ao carrinho.
        </Alert>
      </Snackbar>
    </Box>
  );
}
