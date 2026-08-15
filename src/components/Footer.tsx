import { Box, Container, Grid, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { SITE_NAME } from "../constants";
import { categoryPath } from "../utils/paths";
import BrandLogo from "./BrandLogo";

const owners = [
  "Gabriel dos Santos",
  "Gustavo Azevedo",
  "Gustavo Hideki",
  "Vitor Hugo",
];

const shopLinks = [
  { label: "Camisetas", slug: "masculino-camisas" },
  { label: "Tênis Nike SB", slug: "tenis-nike" },
  { label: "Shapes", slug: "shape" },
  { label: "Skate completo", slug: "skate" },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#000",
        color: "#fff",
        mt: 8,
        pt: { xs: 6, md: 8 },
        pb: 4,
        borderTop: "4px solid",
        borderColor: "primary.main",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 2 }}>
              <BrandLogo size={88} />
            </Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {SITE_NAME}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", maxWidth: 280 }}>
              Skate shop com shapes, tênis e streetwear. Menos vitrine corporativa, mais sessão.
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: "primary.main" }}>
              Shop
            </Typography>
            <Stack spacing={1}>
              {shopLinks.map((link) => (
                <Link
                  key={link.slug}
                  component={RouterLink}
                  to={categoryPath(link.slug)}
                  underline="hover"
                  color="inherit"
                  sx={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 5 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: "primary.main" }}>
              Crew
            </Typography>
            {owners.map((owner) => (
              <Typography key={owner} variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mb: 0.5 }}>
                {owner}
              </Typography>
            ))}
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          sx={{ display: "block", mt: 6, color: "rgba(255,255,255,0.4)", letterSpacing: "0.16em" }}
        >
          WOLF BOARD · SKATE SHOP · TODOS OS DIREITOS RESERVADOS
        </Typography>
      </Container>
    </Box>
  );
}
