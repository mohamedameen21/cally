import React from "react";
import { MainNav } from "@/components/main-nav";

export const Header: React.FC = () => {
  return (
    <header className="container mx-auto px-4">
      <MainNav />
    </header>
  );
};
