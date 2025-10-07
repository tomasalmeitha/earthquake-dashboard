import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../App";

beforeEach(() => {
  localStorage.clear();
});

function renderWithProviders() {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe("🔐 Auth workflow", () => {
  it("renders login page by default", () => {
    renderWithProviders();
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("logs in and navigates to dashboard", async () => {
    renderWithProviders();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "user" } });
    fireEvent.change(passwordInput, { target: { value: "pass" } });
    fireEvent.click(loginButton);

    expect(localStorage.getItem("auth_token")).toBeTruthy();
    expect(await screen.findByText(/earthquake dashboard/i)).toBeInTheDocument();
  });

  it("logs out and removes token", async () => {
    localStorage.setItem("auth_token", "fake-token");
    renderWithProviders();

    const logoutBtn = await screen.findByRole("button", { name: /logout/i });
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem("auth_token")).toBeNull();
  });
});
