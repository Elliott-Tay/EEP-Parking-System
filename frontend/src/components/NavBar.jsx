import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Car,
  Ticket,
  FileChartColumn,
  Settings,
  Menu,
  X,
} from "lucide-react";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Configuration", href: "configuration", icon: <Ticket size={18} /> },
    { name: "Lots", href: "lots", icon: <Car size={18} /> },
    { name: "Reports", href: "reports", icon: <FileChartColumn size={18} /> },
    { name: "Settings", href: "settings", icon: <Settings size={18} /> },
  ];

  return (
    <nav className="bg-red-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Name */}
          <div className="flex items-center space-x-3">
            <img src="/logo_svg_white.svg" alt="G.tech Logo" className="h-8 w-auto sm:h-10" />
            <span className="text-sm sm:text-lg md:text-xl font-semibold">
              Car Park <br className="block sm:hidden" /> Management System
            </span>
          </div>

          {/* Desktop nav + time */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-white hover:text-gray-200 transition"
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ))}
            <span className="ml-4 text-base md:text-2xl font-medium">
              {dateTime.toLocaleDateString("en-SG")}{" "}
              {dateTime.toLocaleTimeString("en-SG", { hour12: false })}
            </span>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-red-700 shadow-lg">
          {/* Date & Time */}
          <div className="px-3 py-2 text-gray-200 font-medium">
            {dateTime.toLocaleDateString("en-SG")}{" "}
            {dateTime.toLocaleTimeString("en-SG", { hour12: false })}
          </div>

          {/* Menu items */}
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center space-x-2 block px-3 py-2 rounded-md text-gray-200 hover:bg-red-500 hover:text-white transition"
              onClick={() => setIsOpen(false)} // close menu on click
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
