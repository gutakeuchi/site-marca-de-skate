import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth";
import { assetUrl } from "../utils/assets";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (login(email, password)) {
      navigate("/");
      return;
    }

    setError("Usuário ou senha inválidos.");
  }

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background:
          "radial-gradient(circle at top, rgba(225,6,0,0.18), transparent 42%), #070707",
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            component="img"
            src={assetUrl("IMG/inicio/LOGO.png")}
            alt="Logo Wolf Board"
            sx={{ width: 96, height: 96, objectFit: "contain", mb: 2 }}
          />
          <Typography variant="subtitle2" sx={{ color: "primary.main", mb: 1 }}>
            Members only
          </Typography>
          <Typography variant="h3">Entrar</Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 3, md: 4 },
            border: "1px solid rgba(255,255,255,0.12)",
            bgcolor: "#0d0d0d",
          }}
        >
          <Stack spacing={2.5}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <TextField
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              required
              fullWidth
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              label="Senha"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              fullWidth
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" variant="contained" size="large">
              Entrar
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
