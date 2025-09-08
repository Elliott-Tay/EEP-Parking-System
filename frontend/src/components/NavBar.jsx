import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Car,
  Ticket,
  FileChartColumn,
  Settings,
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
    {
      name: "Dashboard",
      href: "dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "Tickets", href: "tickets", icon: <Ticket size={18} /> },
    { name: "Lots", href: "lots", icon: <Car size={18} /> },
    {
      name: "Reports",
      href: "reports",
      icon: <FileChartColumn size={18} />,
    },
    { name: "Settings", href: "settings", icon: <Settings size={18} /> },
  ];

  return (
    <nav className="bg-red-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-8xl px-2 sm:px-4 lg:px-6 ml-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo + Name LEFT aligned */}
          <div className="flex items-center space-x-5">
            <img
              src="/logo_svg_white.svg"
              alt="G.tech Logo"
              className="h-8 w-auto sm:h-10"
            />
            <span className="text-sm sm:text-lg md:text-xl text-white leading-tight">
              Car Park{" "}
              <br className="block sm:hidden" /> Management System
            </span>
          </div>

          {/* Date & Time RIGHT aligned (hidden on mobile) */}
          <div className="hidden md:flex">
            <span className="text-base md:text-2xl font-medium">
              {dateTime.toLocaleDateString("en-SG")}{" "}
              {dateTime.toLocaleTimeString("en-SG", { hour12: false })}
            </span>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden ml-2">
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

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-red-700 shadow-lg">
          {/* Date & Time for mobile */}
          <div className="px-3 py-2 text-gray-200 font-medium">
            {dateTime.toLocaleDateString("en-SG")}{" "}
            {dateTime.toLocaleTimeString("en-SG", { hour12: false })}
          </div>

          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center space-x-2 block px-3 py-2 rounded-md text-gray-200 hover:bg-red-500 hover:text-white transition"
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
