import { Outlet } from "react-router";

function RootLayout() {
  return (
    <div>
      <h1 className="text-5xl font-bold text-red-400">Header Navigation</h1>
      <Outlet />
    </div>
  );
}

export default RootLayout;
