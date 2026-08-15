import { Card, CardActionArea, CardContent, Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Product } from "../data/catalog";
import { formatPrice } from "../utils/assets";
import { productPath } from "../utils/paths";
import ProductImage from "./ProductImage";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "transparent",
        color: "#fff",
        borderRadius: 0,
        "&:hover .product-image": {
          transform: "scale(1.06)",
        },
        "&:hover .product-cta": {
          opacity: 1,
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={productPath(product.id)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <ProductImage
            src={product.image}
            alt={product.name}
            height={{ xs: 320, sm: 250, md: 280 }}
          />
          <Box
            className="product-cta"
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "primary.main",
              color: "#fff",
              textAlign: "center",
              py: 1,
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontSize: 13,
              fontWeight: 700,
              opacity: { xs: 1, md: 0 },
              transition: "opacity 0.2s ease",
            }}
          >
            Ver produto
          </Box>
        </Box>
        <CardContent sx={{ px: 0, pt: 1.5, pb: 0, flexGrow: 1 }}>
          <Typography
            variant="body2"
            sx={{
              minHeight: 44,
              fontWeight: 500,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            {product.name}
          </Typography>
          <Typography variant="h6" sx={{ mt: 0.5, letterSpacing: "0.04em" }}>
            {formatPrice(product.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
