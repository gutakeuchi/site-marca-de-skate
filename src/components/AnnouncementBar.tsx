import { Box, Typography } from "@mui/material";

const messages = [
  "Frete grátis acima de R$ 399",
  "Nova sessão de shapes maple",
  "Tênis Nike SB, Vans, Adidas e ÖUS",
  "Wolf Board — skate shop desde o primeiro drop",
];

export default function AnnouncementBar() {
  const loop = [...messages, ...messages];

  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "#fff",
        overflow: "hidden",
        py: 0.8,
        borderBottom: "1px solid #000",
      }}
    >
      <Box className="marquee-track">
        {loop.map((message, index) => (
          <Typography
            key={`${message}-${index}`}
            variant="subtitle2"
            sx={{ px: 4, whiteSpace: "nowrap", fontSize: 13 }}
          >
            {message}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
