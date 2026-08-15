import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import ProductGrid from "../components/ProductGrid";
import { homeHighlights, products, type Product } from "../data/catalog";
import { assetUrl } from "../utils/assets";

const featuredShirts = products.filter((product) =>
  ["IMG/camisasf/6.png", "IMG/camisasf/7.png", "IMG/camisasf/5.png"].includes(
    product.image,
  ),
);

const featuredShapes = products.filter((product) =>
  [
    "IMG/shape.png/shape element trapped westgate.png",
    "IMG/shape.png/shape itachi.jpg",
    "IMG/shape.png/shape-primor.jpeg",
  ].includes(product.image),
);

const departments = [
  {
    title: "Streetwear",
    to: "/categoria/masculino-camisas",
    image: "IMG/camisasm/camisa1.jpeg",
  },
  {
    title: "Tênis",
    to: "/categoria/tenis-vans",
    image: "IMG/tenis/vans/tenis-vans-old-skool-plataform-checkboard.png",
  },
  {
    title: "Completos",
    to: "/categoria/skate",
    image: "IMG/skates/1.jpg",
  },
  {
    title: "Shapes",
    to: "/categoria/shape",
    image: "IMG/shape.png/shape itachi.jpg",
  },
];

export default function HomePage() {
  return (
    <Box>
      <HeroCarousel />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <SectionEyebrow>Shop by category</SectionEyebrow>
        <Typography variant="h3" sx={{ mb: 3, fontSize: { xs: 36, md: 52 } }}>
          Escolhe tua linha
        </Typography>

        <Grid container spacing={2}>
          {departments.map((department) => (
            <Grid key={department.title} size={{ xs: 6, md: 3 }}>
              <Box
                component={RouterLink}
                to={department.to}
                sx={{
                  display: "block",
                  position: "relative",
                  height: { xs: 180, md: 260 },
                  overflow: "hidden",
                  textDecoration: "none",
                  "&:hover img": { transform: "scale(1.08)" },
                }}
              >
                <Box
                  component="img"
                  src={assetUrl(department.image)}
                  alt={department.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.45s ease",
                    bgcolor: "#111",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(transparent, rgba(0,0,0,0.78))",
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    position: "absolute",
                    left: 16,
                    bottom: 14,
                    color: "#fff",
                  }}
                >
                  {department.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Section
          eyebrow="Fresh tees"
          title="Camisetas"
          to="/categoria/feminino-camisas"
          products={featuredShirts}
        />
        <Section
          eyebrow="Maple"
          title="Shapes"
          to="/categoria/shape"
          products={featuredShapes}
        />
        <Section
          eyebrow="On foot"
          title="Tênis"
          to="/categoria/tenis-adidas"
          products={homeHighlights}
        />
      </Container>
    </Box>
  );
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <Typography variant="subtitle2" sx={{ color: "primary.main", mb: 1 }}>
      {children}
    </Typography>
  );
}

function Section({
  eyebrow,
  title,
  to,
  products: sectionProducts,
}: {
  eyebrow: string;
  title: string;
  to: string;
  products: Product[];
}) {
  return (
    <Box sx={{ mt: { xs: 7, md: 10 } }}>
      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box>
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <Typography variant="h3" sx={{ fontSize: { xs: 36, md: 52 } }}>
            {title}
          </Typography>
        </Box>
        <Button component={RouterLink} to={to} color="inherit" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
          Ver tudo →
        </Button>
      </Stack>
      <ProductGrid products={sectionProducts} />
    </Box>
  );
}
