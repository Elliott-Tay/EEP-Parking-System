import React from "react";
import { FaCar } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="flex flex-col items-center">
          {/* Centered Logo + Name */}
          <div className="flex items-center space-x-3 mb-4">
            <FaCar className="text-blue-400 text-2xl" />
            <span className="text-lg font-semibold">
              G.tech CarPark Management
            </span>
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