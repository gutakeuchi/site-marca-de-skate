import { createTheme } from "@mui/material/styles";

const fireRed = "#e10600";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: fireRed,
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f5f5f5",
    },
    background: {
      default: "#070707",
      paper: "#111111",
    },
    text: {
      primary: "#f4f4f4",
      secondary: "#b3b3b3",
    },
    divider: "rgba(255,255,255,0.12)",
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h1: {
      fontFamily: "'Bebas Neue', sans-serif",
      letterSpacing: "0.06em",
      lineHeight: 0.9,
    },
    h2: {
      fontFamily: "'Bebas Neue', sans-serif",
      letterSpacing: "0.06em",
      lineHeight: 0.95,
    },
    h3: {
      fontFamily: "'Bebas Neue', sans-serif",
      letterSpacing: "0.05em",
      lineHeight: 0.95,
    },
    h4: {
      fontFamily: "'Bebas Neue', sans-serif",
      letterSpacing: "0.05em",
    },
    h5: {
      fontFamily: "'Bebas Neue', sans-serif",
      letterSpacing: "0.04em",
    },
    h6: {
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    },
    button: {
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
    },
    subtitle2: {
      fontFamily: "'Barlow Condensed', sans-serif",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#070707",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#000000",
          color: "#ffffff",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        contained: {
          boxShadow: "none",
          "&:hover": { boxShadow: "none", backgroundColor: "#ff2a2a" },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0c0c0c",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontSize: 15,
        },
      },
    },
  },
});

export default theme;
