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
import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../auth";
import { useCart } from "../cart";
import { SITE_NAME } from "../constants";
import { groupedCategories, type NavGroup } from "../data/catalog";
import { categoryPath } from "../utils/paths";
import BrandLogo from "./BrandLogo";
import { BagIcon, ExpandMoreIcon, LoginIcon, LogoutIcon, MenuIcon } from "./Icons";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const [loggedIn, setLoggedIn] = useState(() => isLoggedIn());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{
    group: NavGroup;
    element: HTMLElement;
  } | null>(null);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setMobileOpen(false);
    setMenuAnchor(null);
  }, [location]);

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

        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <BrandLogo size={52} />
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, mr: 3 }}>
          <BrandLogo size={64} />
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
                aria-expanded={menuAnchor?.group === group}
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
                    to={categoryPath(item.slug)}
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
          <BrandLogo size={72} to={false} />
          <Typography variant="h6" sx={{ mt: 1 }}>
            {SITE_NAME}
          </Typography>
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
                    to={categoryPath(item.slug)}
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
