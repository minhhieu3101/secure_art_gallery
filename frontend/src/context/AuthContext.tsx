import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { jwtDecode } from 'jwt-decode';
import { setAccessToken } from '../services/axiosClient';

import { login as loginRequest, logout as logoutRequest, refreshAccessToken } from '../services/authService';

export type Role = 'Admin' | 'Employee' | 'User';

interface AccessTokenPayload {
    id: string;
    sid: string;
    role?: Role;
    username?: string;
    exp?: number;
}

interface AuthContextType {
    accessToken: string | null;
    role: Role | null;
    username: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

function isValidRole(value: unknown): value is Role {
    return value === 'Admin' || value === 'Employee' || value === 'User';
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [accessToken, setAccessTokenState] = useState<string | null>(null);

    const [role, setRole] = useState<Role | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const updateAccessToken = (token: string | null) => {
        setAccessTokenState(token);
        setAccessToken(token);

        if (!token) {
            setRole(null);
            setUsername(null);
            return;
        }

        try {
            const payload = jwtDecode<AccessTokenPayload>(token);

            setRole(isValidRole(payload.role) ? payload.role : null);

            setUsername(payload.username ?? null);
        } catch {
            setRole(null);
            setUsername(null);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const restoreSession = async () => {
            const currentPath = window.location.pathname;

            if (currentPath === '/login' || currentPath === '/register') {
                setIsLoading(false);
                return;
            }

            try {
                const response = await refreshAccessToken();

                if (!cancelled) {
                    updateAccessToken(response?.accessToken ?? null);
                }
            } catch {
                if (!cancelled) {
                    updateAccessToken(null);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        void restoreSession();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        const response = await loginRequest({
            email,
            password,
        });

        if (!response?.accessToken) {
            updateAccessToken(null);

            throw new Error('Login response does not contain an access token.');
        }

        updateAccessToken(response.accessToken);
    };

    const logout = async (): Promise<void> => {
        try {
            await logoutRequest();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            updateAccessToken(null);
        }
    };

    const isAuthenticated = accessToken !== null;

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                role,
                username,
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
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}
