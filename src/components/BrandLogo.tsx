import { Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { LOGO_PATH, SITE_NAME } from "../constants";
import { assetUrl } from "../utils/assets";

type BrandLogoProps = {
  size?: number;
  to?: string | false;
};

export default function BrandLogo({ size = 64, to = "/" }: BrandLogoProps) {
  const image = (
    <Box
      component="img"
      src={assetUrl(LOGO_PATH)}
      alt={`Logo ${SITE_NAME}`}
      sx={{ width: size, height: size, objectFit: "contain", display: "block" }}
    />
  );

  if (!to) return image;

  return (
    <Box
      component={RouterLink}
      to={to}
      aria-label={`${SITE_NAME} - página inicial`}
      sx={{ display: "inline-flex", alignItems: "center" }}
    >
      {image}
    </Box>
  );
}
