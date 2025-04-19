import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const { user, isAdmin, logoutMutation } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Predictions", href: "/predictions" },
    ...(isAdmin ? [{ name: "Admin", href: "/admin" }] : []),
  ];
  
  return (
    <nav className="bg-primary-800 border-b border-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="font-montserrat text-xl font-bold text-accent-400 cursor-pointer">
                  SportsMaster
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={cn(
                      "inline-flex items-center px-3 py-4 border-b-2 text-sm font-medium h-16",
                      location === item.href
                        ? "border-accent-400 text-white"
                        : "border-transparent text-gray-300 hover:border-gray-300 hover:text-white"
                    )}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4 h-16">
            {user ? (
              <>
                <Link href="/profile">
                  <a className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium h-full flex items-center">
                    Profile
                  </a>
                </Link>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white h-10"
                  onClick={() => logoutMutation.mutate()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <a className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium h-full flex items-center">
                    Sign In
                  </a>
                </Link>
                <Link href="/auth">
                  <Button className="bg-accent-500 hover:bg-accent-400 text-primary-900">
                    Try Premium
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="bg-primary-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-primary-700 focus:outline-none"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                    location === item.href
                      ? "bg-primary-700 text-white border-accent-400"
                      : "text-gray-300 hover:bg-primary-700 hover:text-white border-transparent"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              </Link>
            ))}
            
            <div className="pt-4 pb-3 border-t border-primary-700">
              {user ? (
                <>
                  <Link href="/profile">
                    <a 
                      className="text-gray-300 hover:bg-primary-700 hover:text-white block pl-3 pr-4 py-2 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </a>
                  </Link>
                  <a 
                    className="text-gray-300 hover:bg-primary-700 hover:text-white block pl-3 pr-4 py-2 text-base font-medium cursor-pointer"
                    onClick={() => {
                      logoutMutation.mutate();
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </a>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <a 
                      className="text-gray-300 hover:bg-primary-700 hover:text-white block pl-3 pr-4 py-2 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </a>
                  </Link>
                  <Link href="/auth">
                    <a 
                      className="bg-accent-500 text-primary-900 block mx-3 mt-2 px-4 py-2 rounded-md text-base font-medium text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Try Premium
                    </a>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
