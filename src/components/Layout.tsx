import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <AnnouncementBar />
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
