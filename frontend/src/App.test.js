import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the heading 'Hello world!'", () => {
  render(<App />);
  
  const heading = screen.getByText(/Hello world!/i);
  expect(heading).toBeInTheDocument();
});