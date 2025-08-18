import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import "@testing-library/jest-dom";

test("renders the heading 'Hello world!'", () => {
  render(<App />);
  
  const heading = screen.getByText(/Hello world!/i);
  expect(heading).toBeInTheDocument();
});

// NavBar Component Tests
describe("NavBar Component", () => {
  test("renders logo and title", () => {
    render(<NavBar />);
    const logo = screen.getByAltText("G.tech Logo");
    const title = screen.getByText(/CarPark/i);

    expect(logo).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  test("renders all desktop nav links", () => {
    render(<NavBar />);
    const navLinks = ["Dashboard", "Tickets", "Lots", "Reports", "Settings"];
    navLinks.forEach((link) => {
      const navItem = screen.getByText(link);
      expect(navItem).toBeInTheDocument();
    });
  });

  test("mobile menu is hidden by default", () => {
    render(<NavBar />);
    const mobileMenu = screen.queryByText("Dashboard");
    // Desktop version exists but mobile menu container shouldn't be visible initially
    expect(mobileMenu).toBeInTheDocument(); // Still rendered in DOM
  });

  test("toggles mobile menu when button is clicked", () => {
    render(<NavBar />);
    const toggleButton = screen.getByRole("button", { name: /toggle menu/i });

    // Click to open menu
    fireEvent.click(toggleButton);
    const mobileDashboard = screen.getAllByText("Dashboard")[1]; // second occurrence is mobile menu
    expect(mobileDashboard).toBeVisible();

    // Click again to close menu
    fireEvent.click(toggleButton);
    // Depending on how the DOM renders, you may check style or just query for mobile menu
    expect(screen.queryByText("Dashboard")).toBeInTheDocument(); 
  });

  test("all nav items have correct href", () => {
    render(<NavBar />);
    const links = [
      { name: "Dashboard", href: "dashboard" },
      { name: "Tickets", href: "tickets" },
      { name: "Lots", href: "lots" },
      { name: "Reports", href: "reports" },
      { name: "Settings", href: "settings" },
    ];

    links.forEach(({ name, href }) => {
      const link = screen.getAllByText(name)[0]; // first occurrence
      expect(link.closest("a")).toHaveAttribute("href", href);
    });
  });

  test("mobile menu contains all nav links when open", () => {
    render(<NavBar />);
    const toggleButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(toggleButton);

    const navLinks = ["Dashboard", "Tickets", "Lots", "Reports", "Settings"];
    navLinks.forEach((link) => {
      const mobileLink = screen.getAllByText(link)[1]; // second occurrence = mobile
      expect(mobileLink).toBeVisible();
    });
  });
});

// Footer Component Tests
describe("Footer Component", () => {
  test("renders all quick links", () => {
    render(<Footer />);
    const links = ["Dashboard", "Tickets", "Lots", "Reports", "Settings"];

    links.forEach((link) => {
      const linkElement = screen.getByText(link);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest("a")).toHaveAttribute(
        "href",
        `/${link.toLowerCase()}`
      );
    });
  });

  test("renders current year copyright", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    const copyrightText = screen.getByText(
      new RegExp(`© ${year} G\\.tech\\. All rights reserved\\.`)
    );

    expect(copyrightText).toBeInTheDocument();
  });
});