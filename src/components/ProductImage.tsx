import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { PRODUCT_SURFACE } from "../constants";
import { assetUrl } from "../utils/assets";

type ResponsiveNumber = number | { xs?: number; sm?: number; md?: number };

type ProductImageProps = {
  src: string;
  alt: string;
  height?: ResponsiveNumber;
  padding?: ResponsiveNumber;
  lazy?: boolean;
  sx?: SxProps<Theme>;
};

export default function ProductImage({
  src,
  alt,
  height,
  padding = 2,
  lazy = true,
  sx,
}: ProductImageProps) {
  return (
    <Box
      sx={{
        bgcolor: PRODUCT_SURFACE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        p: padding,
        ...sx,
      }}
    >
      <Box
        component="img"
        className="product-image"
        src={assetUrl(src)}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        sx={{
          width: "100%",
          height: height ?? "100%",
          objectFit: "contain",
          transition: "transform 0.45s ease",
        }}
      />
    </Box>
  );
}
