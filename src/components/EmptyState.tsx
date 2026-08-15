import { Box, Container, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type EmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export default function EmptyState({
  eyebrow,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="subtitle2" sx={{ color: "primary.main" }}>
          {eyebrow}
        </Typography>
        <Typography variant="h3">{title}</Typography>
        <Typography sx={{ color: "text.secondary", maxWidth: 420 }}>{description}</Typography>
        {action ? <Box sx={{ pt: 1 }}>{action}</Box> : null}
      </Stack>
    </Container>
  );
}
