import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import "@testing-library/jest-dom";

jest.mock("react-router-dom");

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


