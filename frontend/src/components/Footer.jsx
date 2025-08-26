import React from "react";
import { FaCar } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left: Logo + Name */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <FaCar className="text-blue-400 text-2xl" />
            <span className="text-lg font-semibold ml">
              G.tech CarPark Management
            </span>
          </div>

          {/* Middle: Quick Links */}
          <div className="flex space-x-6">
            <a
              href="/dashboard"
              className="hover:text-blue-400 transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/tickets"
              className="hover:text-blue-400 transition-colors"
            >
              Tickets
            </a>
            <a
              href="/lots"
              className="hover:text-blue-400 transition-colors"
            >
              Lots
            </a>
            <a
              href="/reports"
              className="hover:text-blue-400 transition-colors"
            >
              Reports
            </a>
            <a
              href="/settings"
              className="hover:text-blue-400 transition-colors"
            >
              Settings
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-4" />

        {/* Bottom: Copyright */}
        <div className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} G.tech. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
