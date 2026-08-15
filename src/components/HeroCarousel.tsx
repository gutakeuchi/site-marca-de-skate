import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { banners } from "../data/catalog";
import { assetUrl } from "../utils/assets";
import { categoryPath } from "../utils/paths";

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % banners.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        height: { xs: 420, sm: 520, md: "78vh" },
        minHeight: 380,
        bgcolor: "#000",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {banners.map((banner, index) => (
        <Box
          key={banner.src}
          component="img"
          src={assetUrl(banner.src)}
          alt={banner.alt}
          loading={index === 0 ? "eager" : "lazy"}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: index === current ? 1 : 0,
            transform: index === current ? "scale(1.04)" : "scale(1.12)",
            transition: "opacity 0.7s ease, transform 6s ease",
          }}
        />
      ))}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 48%, rgba(0,0,0,0.2) 100%)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          px: { xs: 3, md: 8 },
          pb: { xs: 6, md: 10 },
          maxWidth: 900,
        }}
      >
        <Typography variant="subtitle2" sx={{ color: "primary.main", mb: 1.5 }}>
          Drop da semana
        </Typography>
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: 56, sm: 80, md: 112 }, mb: 1 }}
        >
          Ride dirty.
          <Box component="span" sx={{ color: "primary.main" }}>
            {" "}
            Shop clean.
          </Box>
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.78)", maxWidth: 460, mb: 3 }}>
          Shapes, tênis e streetwear para quem anda de verdade. A logo continua a mesma.
          O visual agora acompanha a sessão.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to={categoryPath("skate")}
            sx={{ px: 3.5, py: 1.2 }}
          >
            Shop skate
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to={categoryPath("tenis-nike")}
            sx={{ px: 3.5, py: 1.2, color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}
          >
            Ver tênis
          </Button>
        </Stack>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: "absolute",
          bottom: 20,
          right: { xs: 16, md: 40 },
          zIndex: 2,
        }}
      >
        {banners.map((banner, index) => (
          <IconButton
            key={banner.src}
            aria-label={`Ver banner ${index + 1}`}
            onClick={() => setCurrent(index)}
            size="small"
            sx={{
              width: 28,
              height: 6,
              borderRadius: 0,
              bgcolor: index === current ? "primary.main" : "rgba(255,255,255,0.35)",
              "&:hover": { bgcolor: index === current ? "primary.main" : "rgba(255,255,255,0.6)" },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
