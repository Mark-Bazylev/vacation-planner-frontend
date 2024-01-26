import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      This is the Main Layout
      <div>
        <Outlet />
      </div>
    </div>
  );
}
