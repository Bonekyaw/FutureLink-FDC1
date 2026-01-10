import { Outlet } from "react-router";

import NavigationHeader from "@/components/layout/header";
import FooterNavigation from "@/components/layout/footer";

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <NavigationHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterNavigation />
    </div>
  );
}

export default RootLayout;
