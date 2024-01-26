import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";

export default function ProtectedRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    if (user === null) navigate("/auth/login");
    if (location.pathname === "/") navigate("/home");
  }, [user, navigate, location.pathname]);

  return <Outlet />;
}
