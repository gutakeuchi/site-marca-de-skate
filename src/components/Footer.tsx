import { Box, Container, Grid, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { assetUrl } from "../utils/assets";

const owners = [
  "Gabriel dos Santos",
  "Gustavo Azevedo",
  "Gustavo Hideki",
  "Vitor Hugo",
];

const shopLinks = [
  { label: "Camisas", to: "/categoria/masculino-camisas" },
  { label: "Tênis Nike SB", to: "/categoria/tenis-nike" },
  { label: "Shapes", to: "/categoria/shape" },
  { label: "Skate completo", to: "/categoria/skate" },
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
            <Box
              component="img"
              src={assetUrl("IMG/inicio/LOGO.png")}
              alt="Logo Wolf Board"
              sx={{ width: 88, height: 88, objectFit: "contain", mb: 2 }}
            />
            <Typography variant="h5" sx={{ mb: 1 }}>
              Wolf Board
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
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
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
