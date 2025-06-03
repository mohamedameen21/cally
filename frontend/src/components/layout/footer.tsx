import React from "react";
import { CalendarDays } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t py-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row mx-auto">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold">Cally</span>
        </div>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Help
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Cally. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
