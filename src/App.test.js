import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders main navigation after lazy routes load", async () => {
  render(<App />);
  expect(await screen.findByRole("navigation", {}, { timeout: 5000 })).toBeInTheDocument();
});
