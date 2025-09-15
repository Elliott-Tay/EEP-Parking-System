import { useState, useEffect } from "react";
import { LayoutDashboard, Ticket, Menu, X, Clock, LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const navigate = useNavigate();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check login status
  const isLoggedIn = !!localStorage.getItem("token");

  const navItems = isLoggedIn
    ? [
        { name: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
        { name: "Configuration", href: "/configuration", icon: <Ticket size={18} /> },
      ]
    : [
      { name: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
      { name: "Register", href: "/register", icon: <Ticket size={18} /> },
    ];;

  const handleNavClick = (href) => {
    navigate(href); // just navigate directly
    setIsOpen(false);
  };
  
  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token"); // log out
      navigate("/login");
    } else {
      navigate("/login"); // go to login
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-red-600 text-white shadow-lg border-b border-red-500/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Name */}
          <button className="flex items-center space-x-4 group" onClick={() => navigate("/")}>
            <div className="flex-shrink-0 p-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/15 transition-all duration-200">
              <img src="/gtechfavicon.png" alt="G.tech Logo" className="h-8 w-auto sm:h-9" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-semibold tracking-tight leading-tight">
                Car Park Management
              </span>
              <span className="text-xs sm:text-sm text-red-100 leading-tight hidden sm:block">
                Real-time Monitoring System
              </span>
            </div>
          </button>

          {/* Desktop nav + time */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Navigation Items */}
            <div className="flex items-center space-x-1 mr-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 transition-all duration-200 group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Auth Button */}
            <button
              onClick={handleAuthClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 transition-all duration-200 group mr-6"
            >
              <span className="group-hover:scale-110 transition-transform duration-200">
                {isLoggedIn ? <LogOut size={16} /> : <LogIn size={16} />}
              </span>
              <span className="font-medium">{isLoggedIn ? "Logout" : "Login"}</span>
            </button>

            {/* Time Display */}
            <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <Clock className="h-6 w-6 text-red-100" /> {/* increased from h-4 w-4 to h-6 w-6 */}
              <div className="flex flex-col">
                <span className="text-base font-medium leading-tight">
                  {dateTime.toLocaleDateString("en-SG")}
                </span>
                <span className="text-2xl font-mono leading-tight tabular-nums">
                  {dateTime.toLocaleTimeString("en-SG", { hour12: false })}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm border border-transparent hover:border-white/20 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <div className={`absolute inset-0 transition-transform duration-200 ${isOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
                  <Menu size={24} />
                </div>
                <div className={`absolute inset-0 transition-transform duration-200 ${isOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'}`}>
                  <X size={24} />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-4 pt-2 pb-4 space-y-2 bg-red-700/95 backdrop-blur-md border-t border-red-500/20 shadow-inner">
          {/* Time Display Mobile */}
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
            <Clock className="h-4 w-4 text-red-100" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {dateTime.toLocaleDateString("en-SG")}
                </span>
                <span className="text-lg font-mono tabular-nums">
                  {dateTime.toLocaleTimeString("en-SG", { hour12: false })}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items Mobile */}
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.href)}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 transition-all duration-200 group"
            >
              <span className="group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}

          {/* Auth Button Mobile */}
          <button
            onClick={handleAuthClick}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 transition-all duration-200 group"
          >
            <span className="group-hover:scale-110 transition-transform duration-200">
              {isLoggedIn ? <LogOut size={18} /> : <LogIn size={18} />}
            </span>
            <span className="font-medium">{isLoggedIn ? "Logout" : "Login"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;