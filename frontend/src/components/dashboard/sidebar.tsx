import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Settings, Users, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  isActive,
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      icon: <Home className="h-4 w-4" />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Availability",
      href: "/dashboard/availability",
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Bookings",
      href: "/dashboard/bookings",
    },
  ];

  return (
    <div className="w-64 border-r bg-card p-4">
      <div className="mb-6 px-3 py-2">
        <h2 className="text-lg font-semibold">Cally</h2>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={location.pathname === item.href}
          />
        ))}
      </nav>
    </div>
  );
};