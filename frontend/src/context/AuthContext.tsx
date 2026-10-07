import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { setAccessToken } from "../services/axiosClient";
import {
  login as loginRequest,
  logout as logoutRequest,
  refreshAccessToken,
} from "../services/authService";

interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Update Access Token
  const updateAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    setAccessToken(token);
  };

  // Restore session when React starts or page is refreshed
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await refreshAccessToken();

        const newAccessToken = response.accessToken;

        updateAccessToken(newAccessToken);
      } catch {
        updateAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<void> => {
    const response = await loginRequest({
      email,
      password,
    });
    console.log(response)

    const newAccessToken = response.accessToken;

    // Access Token chỉ lưu trong memory
    // Refresh Token nằm trong HttpOnly Cookie
    updateAccessToken(newAccessToken);
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      updateAccessToken(null);
    }
  };

  const isAuthenticated = accessToken !== null;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
