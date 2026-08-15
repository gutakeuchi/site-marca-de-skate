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
import ProductGrid from "../components/ProductGrid";
import { MinusIcon, PlusIcon } from "../components/Icons";
import { getCategory, getProductById, getRelatedProducts } from "../data/catalog";
import {
  getDescription,
  getInstallments,
  getSizeLabel,
  getSizes,
  getSku,
  getSpecs,
} from "../data/productInfo";
import { assetUrl, formatPrice } from "../utils/assets";

export default function ProductPage() {
  const { id } = useParams();
  const product = getProductById(Number(id));
  const { addItem } = useCart();
  const sizes = product ? getSizes(product.category) : [];
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0] : "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQty(1);
    const nextSizes = product ? getSizes(product.category) : [];
    setSize(nextSizes.length === 1 ? nextSizes[0] : "");
  }, [id, product]);

  const category = product ? getCategory(product.category) : undefined;
  const related = useMemo(
    () => (product ? getRelatedProducts(product) : []),
    [product],
  );

  if (!product || !category) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="warning">Produto não encontrado.</Alert>
      </Container>
    );
  }

  function handleAdd() {
    if (!product || !size) return;
    addItem(product, size, qty);
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
            to={`/categoria/${category.slug}`}
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
            <Box
              sx={{
                bgcolor: "#f3f3f3",
                minHeight: { xs: 360, md: 560 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 3, md: 5 },
              }}
            >
              <Box
                component="img"
                src={assetUrl(product.image)}
                alt={product.name}
                sx={{ width: "100%", maxHeight: 520, objectFit: "contain" }}
              />
            </Box>
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
                  bgcolor: "#e10600 !important",
                  borderColor: "#e10600 !important",
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
              <Stack
                direction="row"
                alignItems="center"
                sx={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <Button
                  color="inherit"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  aria-label="Diminuir quantidade"
                  sx={{ minWidth: 44 }}
                >
                  <MinusIcon fontSize="small" />
                </Button>
                <Typography sx={{ width: 32, textAlign: "center" }}>{qty}</Typography>
                <Button
                  color="inherit"
                  onClick={() => setQty((value) => value + 1)}
                  aria-label="Aumentar quantidade"
                  sx={{ minWidth: 44 }}
                >
                  <PlusIcon fontSize="small" />
                </Button>
              </Stack>
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
            <Typography variant="subtitle2" sx={{ color: "primary.main", mb: 1 }}>
              Complete o setup
            </Typography>
            <Typography variant="h3" sx={{ mb: 3, fontSize: { xs: 36, md: 48 } }}>
              Relacionados
            </Typography>
            <ProductGrid products={related} />
          </Box>
        ) : null}
      </Container>

      <Snackbar
        open={added}
        autoHideDuration={2500}
        onClose={() => setAdded(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setAdded(false)}
          sx={{ bgcolor: "#111", color: "#fff", border: "1px solid #e10600" }}
        >
          Produto adicionado ao carrinho.
        </Alert>
      </Snackbar>
    </Box>
  );
}
