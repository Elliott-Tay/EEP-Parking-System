import React, { useState } from "react";
import { LayoutDashboard, Car, Ticket, FileChartColumn, Settings } from "lucide-react";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Tickets", href: "tickets", icon: <Ticket size={18} /> },
    { name: "Lots", href: "lots", icon: <Car size={18} /> },
    { name: "Reports", href: "reports", icon: <FileChartColumn size={18} /> },
    { name: "Settings", href: "settings", icon: <Settings size={18} /> },
  ];

  return (
    <nav className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Name */}
          <div className="flex items-center flex-shrink-0 space-x-3">
            <img
              src="/logo_svg_white.svg"
              alt="G.tech Logo"
              className="h-8 w-auto sm:h-10"
            />
            <span className="text-sm sm:text-lg md:text-xl font-bold text-blue-400 leading-tight">
              CarPark{" "}
              <br className="block sm:hidden" /> Management Sys
            </span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-2 items-right">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-right space-x-2 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-right md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-gray-700">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center space-x-2 block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-600 hover:text-white transition"
            >
              {item.icon}
              <span>{item.name}</span>
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
