"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getMe, logout as apiLogout } from "@/lib/api";
import { User } from "@/lib/types";

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMe()
            .then((res) => setUser(res.success ? res.data : null))
            .finally(() => setLoading(false));
    }, []);

    async function logout() {
        await apiLogout();
        setUser(null);
    }

    return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
