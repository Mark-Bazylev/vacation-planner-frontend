import { Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      Hi
      <div>
        <Outlet />
      </div>
    </div>
  );
}
