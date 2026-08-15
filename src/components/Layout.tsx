import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import Footer from "./Footer";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <Box component="main" id="conteudo" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
