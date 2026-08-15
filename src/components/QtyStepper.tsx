import { Button, Stack, Typography } from "@mui/material";
import { MinusIcon, PlusIcon } from "./Icons";

type QtyStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
};

export default function QtyStepper({ value, onChange, min = 1 }: QtyStepperProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ border: "1px solid rgba(255,255,255,0.2)" }}
    >
      <Button
        color="inherit"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Diminuir quantidade"
        sx={{ minWidth: 44 }}
      >
        <MinusIcon fontSize="small" />
      </Button>
      <Typography sx={{ width: 32, textAlign: "center" }}>{value}</Typography>
      <Button
        color="inherit"
        onClick={() => onChange(value + 1)}
        aria-label="Aumentar quantidade"
        sx={{ minWidth: 44 }}
      >
        <PlusIcon fontSize="small" />
      </Button>
    </Stack>
  );
}
