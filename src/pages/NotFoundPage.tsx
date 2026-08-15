import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Página não encontrada");

  return (
    <EmptyState
      eyebrow="404"
      title="Pista errada"
      description="Essa página não existe. Volta pra loja e escolhe outro drop."
      action={
        <Button variant="contained" component={RouterLink} to="/">
          Ir para a loja
        </Button>
      }
    />
  );
}
