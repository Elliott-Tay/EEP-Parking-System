import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import "@testing-library/jest-dom";

jest.mock("react-router-dom");

//Navbar component
describe('NavBar component', () => {
  test('renders logo and system name', () => {
    render(<NavBar />);
    const logo = screen.getByAltText(/G.tech Logo/i);
    const systemName = screen.getByText(/Car Park/i);
    expect(logo).toBeInTheDocument();
    expect(systemName).toBeInTheDocument();
  });
});

// Footer Component Tests
describe("Footer Component", () => {
  test("renders current year copyright", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    const copyrightText = screen.getByText(
      new RegExp(`© ${year} G\\.tech\\. All rights reserved\\.`)
    );

    expect(copyrightText).toBeInTheDocument();
  });
});


