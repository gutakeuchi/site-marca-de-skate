import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useCart } from "../cart";
import { MinusIcon, PlusIcon } from "../components/Icons";
import { assetUrl, formatPrice } from "../utils/assets";

export default function CartPage() {
  const { items, total, updateQty, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
        <Typography variant="subtitle2" sx={{ color: "primary.main", mb: 1 }}>
          Carrinho
        </Typography>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Tá vazio
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 4 }}>
          Escolhe um shape, um tênis ou uma tee e volta aqui.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/">
          Ir para a loja
        </Button>
      </Container>
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
                to={`/produto/${item.productId}`}
                sx={{
                  width: 92,
                  height: 92,
                  bgcolor: "#f3f3f3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  flexShrink: 0,
                }}
              >
                <Box
                  component="img"
                  src={assetUrl(item.image)}
                  alt={item.name}
                  sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  component={RouterLink}
                  to={`/produto/${item.productId}`}
                  sx={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}
                >
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item.size}
                </Typography>
                <Typography sx={{ mt: 0.5 }}>{formatPrice(item.price)}</Typography>
              </Box>
              <Stack direction="row" alignItems="center">
                <IconButton
                  color="inherit"
                  aria-label="Diminuir quantidade"
                  onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                >
                  <MinusIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ width: 24, textAlign: "center" }}>{item.qty}</Typography>
                <IconButton
                  color="inherit"
                  aria-label="Aumentar quantidade"
                  onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                >
                  <PlusIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Button
                color="inherit"
                onClick={() => removeItem(item.productId, item.size)}
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
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
