import * as React from "react";
import { X, Menu } from "lucide-react";
import { Link } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-primary mr-6">
          Cally
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link to="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link to="/about">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] border border-primary rounded-md">
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/services/scheduling"
                      className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none focus:shadow-md bg-white hover:bg-muted group"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium group-hover:text-primary">
                        Scheduling
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground group-hover:text-primary">
                        Automated appointment scheduling and reminders
                      </p>
                    </Link>
                    <Link
                      to="/services/messaging"
                      className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none focus:shadow-md bg-white hover:bg-muted group"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium group-hover:text-primary">
                        Messaging
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground group-hover:text-primary">
                        Secure client communication and file sharing
                      </p>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/services/payments"
                      className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none focus:shadow-md bg-white hover:bg-muted group"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium group-hover:text-primary">
                        Payments
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground group-hover:text-primary">
                        Integrated payment processing and invoicing
                      </p>
                    </Link>
                    <Link
                      to="/services/analytics"
                      className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none focus:shadow-md bg-white hover:bg-muted group"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium group-hover:text-primary">
                        Analytics
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground group-hover:text-primary">
                        Business insights and performance tracking
                      </p>
                    </Link>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link to="/contact">Contact</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Auth Buttons - Desktop */}
      <div className="hidden md:flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link to="/login">Log in</Link>
        </Button>
        <Button asChild>
          <Link to="/signup">Sign up</Link>
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background pt-16 px-4 md:hidden">
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col space-y-6">
            <Link to="/" className="text-xl font-medium" onClick={toggleMenu}>
              Home
            </Link>
            <Link
              to="/about"
              className="text-xl font-medium"
              onClick={toggleMenu}
            >
              About
            </Link>
            <div className="space-y-3">
              <div className="text-xl font-medium">Services</div>
              <div className="pl-4 space-y-3">
                <Link
                  to="/services/scheduling"
                  className="block text-muted-foreground"
                  onClick={toggleMenu}
                >
                  Scheduling
                </Link>
                <Link
                  to="/services/messaging"
                  className="block text-muted-foreground"
                  onClick={toggleMenu}
                >
                  Messaging
                </Link>
                <Link
                  to="/services/payments"
                  className="block text-muted-foreground"
                  onClick={toggleMenu}
                >
                  Payments
                </Link>
                <Link
                  to="/services/analytics"
                  className="block text-muted-foreground"
                  onClick={toggleMenu}
                >
                  Analytics
                </Link>
              </div>
            </div>
            <Link
              to="/contact"
              className="text-xl font-medium"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <div className="pt-6 flex flex-col space-y-4">
              <Button variant="outline" asChild>
                <Link to="/login" onClick={toggleMenu}>
                  Log in
                </Link>
              </Button>
              <Button asChild>
                <Link to="/signup" onClick={toggleMenu}>
                  Sign up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
