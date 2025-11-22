import { useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  const setAuthToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    document.cookie = `token=${newToken}; path=/; max-age=${30 * 24 * 60 * 60}`;
    setToken(newToken);
  };

  const clearAuthToken = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    setToken(null);
  };

  return {
    token,
    isLoading,
    isAuthenticated: !!token,
    setAuthToken,
    clearAuthToken,
  };
}
