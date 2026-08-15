import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import ProductGrid from "../components/ProductGrid";
import SectionHeading from "../components/SectionHeading";
import { homeHighlights, products, type Product } from "../data/catalog";
import { usePageTitle } from "../hooks/usePageTitle";
import { assetUrl } from "../utils/assets";
import { categoryPath } from "../utils/paths";

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
    slug: "masculino-camisas",
    image: "IMG/camisasm/camisa1.jpeg",
  },
  {
    title: "Tênis",
    slug: "tenis-vans",
    image: "IMG/tenis/vans/tenis-vans-old-skool-plataform-checkboard.png",
  },
  {
    title: "Completos",
    slug: "skate",
    image: "IMG/skates/1.jpg",
  },
  {
    title: "Shapes",
    slug: "shape",
    image: "IMG/shape.png/shape itachi.jpg",
  },
];

export default function HomePage() {
  usePageTitle();

  return (
    <Box>
      <HeroCarousel />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <SectionHeading eyebrow="Shop by category" title="Escolhe tua linha" />

        <Grid container spacing={2}>
          {departments.map((department) => (
            <Grid key={department.title} size={{ xs: 6, md: 3 }}>
              <Box
                component={RouterLink}
                to={categoryPath(department.slug)}
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
                  loading="lazy"
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

        <ProductSection
          eyebrow="Fresh tees"
          title="Camisetas"
          slug="feminino-camisas"
          products={featuredShirts}
        />
        <ProductSection
          eyebrow="Maple"
          title="Shapes"
          slug="shape"
          products={featuredShapes}
        />
        <ProductSection
          eyebrow="On foot"
          title="Tênis"
          slug="tenis-adidas"
          products={homeHighlights}
        />
      </Container>
    </Box>
  );
}

function ProductSection({
  eyebrow,
  title,
  slug,
  products: sectionProducts,
}: {
  eyebrow: string;
  title: string;
  slug: string;
  products: Product[];
}) {
  return (
    <Box sx={{ mt: { xs: 7, md: 10 } }}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        action={
          <Button
            component={RouterLink}
            to={categoryPath(slug)}
            color="inherit"
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            Ver tudo →
          </Button>
        }
      />
      <ProductGrid products={sectionProducts} />
    </Box>
  );
}
