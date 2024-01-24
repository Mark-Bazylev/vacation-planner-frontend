import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import { useEffect } from "react";

export default function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/auth") navigate("/auth/login");
  }, [navigate, location]);
  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
        backgroundRepeat: "no-repeat",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[50]
            : theme.palette.grey[900],
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Outlet />
    </Container>
  );
}
