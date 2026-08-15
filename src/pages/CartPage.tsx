import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useCart } from "../cart";
import EmptyState from "../components/EmptyState";
import ProductImage from "../components/ProductImage";
import QtyStepper from "../components/QtyStepper";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatPrice } from "../utils/assets";
import { productPath } from "../utils/paths";

export default function CartPage() {
  const { items, total, updateQty, removeItem, clear } = useCart();
  usePageTitle("Carrinho");

  if (items.length === 0) {
    return (
      <EmptyState
        eyebrow="Carrinho"
        title="Tá vazio"
        description="Escolhe um shape, um tênis ou uma tee e volta aqui."
        action={
          <Button variant="contained" component={RouterLink} to="/">
            Ir para a loja
          </Button>
        }
      />
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="subtitle2" sx={{ color: "primary.main", mb: 1 }}>
        Checkout
      </Typography>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Carrinho
      </Typography>

      <Stack spacing={3}>
        {items.map((item) => (
          <Box key={`${item.productId}-${item.size}`}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                component={RouterLink}
                to={productPath(item.productId)}
                sx={{ width: 92, height: 92, flexShrink: 0, display: "block" }}
              >
                <ProductImage src={item.image} alt={item.name} height={76} padding={1} />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  component={RouterLink}
                  to={productPath(item.productId)}
                  sx={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}
                >
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item.size}
                </Typography>
                <Typography sx={{ mt: 0.5 }}>{formatPrice(item.price)}</Typography>
              </Box>
              <QtyStepper
                value={item.qty}
                onChange={(qty) => updateQty(item.productId, item.size, qty)}
                min={0}
              />
              <Button color="inherit" onClick={() => removeItem(item.productId, item.size)}>
                Remover
              </Button>
            </Stack>
            <Divider sx={{ mt: 2, borderColor: "rgba(255,255,255,0.08)" }} />
          </Box>
        ))}
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        spacing={2}
        sx={{ mt: 4 }}
      >
        <Button color="inherit" onClick={clear}>
          Esvaziar
        </Button>
        <Box textAlign={{ sm: "right" }}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            Total
          </Typography>
          <Typography variant="h4">{formatPrice(total)}</Typography>
          <Button variant="contained" size="large" sx={{ mt: 2 }} disabled>
            Finalizar (em breve)
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
