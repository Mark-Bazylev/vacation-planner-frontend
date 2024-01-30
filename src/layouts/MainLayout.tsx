import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

export default function MainLayout() {
  return (
    <Container
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Outlet />
    </Container>
  );
}
