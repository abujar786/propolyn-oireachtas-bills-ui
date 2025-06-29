// src/__tests__/App.test.tsx
import { render, screen } from "@testing-library/react";
import App from "./App";
import { describe, it, expect } from "vitest";

// If your App.tsx does NOT include providers, import them here
import { FavouriteProvider } from "./context/FavouriteProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

describe("App Component", () => {
  it("renders the Home component inside all providers", () => {
    const theme = createTheme();

    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FavouriteProvider>
          <App />
        </FavouriteProvider>
      </ThemeProvider>
    );

    expect(screen.getByText(/Bills Information/i)).toBeInTheDocument();
  });
});
