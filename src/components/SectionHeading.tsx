import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  titleComponent?: "h2" | "h3";
};

export default function SectionHeading({
  eyebrow,
  title,
  action,
  titleComponent = "h3",
}: SectionHeadingProps) {
  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      justifyContent="space-between"
      sx={{ mb: 3 }}
    >
      <Box>
        <Typography variant="subtitle2" sx={{ color: "primary.main", mb: 1 }}>
          {eyebrow}
        </Typography>
        <Typography
          variant={titleComponent}
          sx={{ fontSize: titleComponent === "h2" ? { xs: 48, md: 80 } : { xs: 36, md: 52 } }}
        >
          {title}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}
