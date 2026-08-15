import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../auth";
import { useCart } from "../cart";
import { categories } from "../data/catalog";
import { assetUrl } from "../utils/assets";
import { BagIcon, ExpandMoreIcon, LoginIcon, LogoutIcon, MenuIcon } from "./Icons";

const LOGO_SRC = assetUrl("IMG/inicio/LOGO.png");
const groups = ["Masculino", "Feminino", "Tênis", "Skate"] as const;
type Group = (typeof groups)[number];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const [loggedIn, setLoggedIn] = useState(() => isLoggedIn());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{
    group: Group;
    element: HTMLElement;
  } | null>(null);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [location]);

  const groupedCategories = useMemo(
    () =>
      groups.map((group) => ({
        group,
        items: categories.filter((category) => category.group === group),
      })),
    [],
  );

  function handleLogout() {
    logout();
    setLoggedIn(false);
    navigate("/");
  }

  return (
    <AppBar position="sticky">
      <Toolbar
        sx={{
          minHeight: { xs: 68, md: 78 },
          px: { xs: 1.5, md: 4 },
          gap: 1,
        }}
      >
        <IconButton
          color="inherit"
          edge="start"
          aria-label="Abrir menu"
          onClick={() => setMobileOpen(true)}
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          component={RouterLink}
          to="/"
          aria-label="Wolf Board - página inicial"
          sx={{ display: "flex", alignItems: "center", mr: { md: 3 } }}
        >
          <Box
            component="img"
            src={LOGO_SRC}
            alt="Logo Wolf Board"
            sx={{ width: { xs: 52, md: 64 }, height: { xs: 52, md: 64 }, objectFit: "contain" }}
          />
        </Box>

        <Stack
          direction="row"
          spacing={0.25}
          sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}
        >
          {groupedCategories.map(({ group, items }) => (
            <Box key={group}>
              <Button
                color="inherit"
                endIcon={<ExpandMoreIcon />}
                onClick={(event) =>
                  setMenuAnchor({ group, element: event.currentTarget })
                }
                aria-haspopup="true"
                sx={{
                  fontSize: 15,
                  px: 1.5,
                  "&:hover": { color: "primary.main", backgroundColor: "transparent" },
                }}
              >
                {group}
              </Button>
              <Menu
                anchorEl={menuAnchor?.group === group ? menuAnchor.element : null}
                open={menuAnchor?.group === group}
                onClose={() => setMenuAnchor(null)}
              >
                {items.map((item) => (
                  <MenuItem
                    key={item.slug}
                    component={RouterLink}
                    to={`/categoria/${item.slug}`}
                    onClick={() => setMenuAnchor(null)}
                  >
                    {item.title}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ))}
        </Stack>

        <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

        <IconButton
          color="inherit"
          component={RouterLink}
          to="/carrinho"
          aria-label="Abrir carrinho"
          sx={{ mr: 0.5 }}
        >
          <Badge
            badgeContent={itemCount}
            color="primary"
            max={99}
            sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}
          >
            <BagIcon />
          </Badge>
        </IconButton>

        {loggedIn ? (
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Sair
          </Button>
        ) : (
          <Button
            color="inherit"
            startIcon={<LoginIcon />}
            component={RouterLink}
            to="/login"
            sx={{ "&:hover": { color: "primary.main", backgroundColor: "transparent" } }}
          >
            Conta
          </Button>
        )}
      </Toolbar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 320, bgcolor: "#0a0a0a", color: "#fff" } }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box
            component="img"
            src={LOGO_SRC}
            alt="Logo Wolf Board"
            sx={{ width: 72, height: 72, objectFit: "contain", mb: 1 }}
          />
          <Typography variant="h6">Wolf Board</Typography>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
        {groupedCategories.map(({ group, items }) => (
          <Accordion
            key={group}
            disableGutters
            elevation={0}
            sx={{ bgcolor: "transparent", color: "#fff", "&:before": { display: "none" } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
              <Typography variant="subtitle2">{group}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List>
                {items.map((item) => (
                  <ListItemButton
                    key={item.slug}
                    component={RouterLink}
                    to={`/categoria/${item.slug}`}
                    onClick={() => setMobileOpen(false)}
                    sx={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
                  >
                    {item.title}
                  </ListItemButton>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Drawer>
    </AppBar>
  );
}
