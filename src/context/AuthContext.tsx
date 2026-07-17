'use client';

import { createContext, useContext, useEffect, useState } from "react";

type User = { id: number; username: string; email: string} | null;

type AuthContextValue = {
    user: User;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout:() => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode}) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => setUser(data.user))
            .finally(() => setLoading(false));
    }, []);

    async function login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if(!res.ok) throw new Error(data.error ?? "Login Failed");
    setUser(data.user);
}

async function register(email: string, password: string) {
    const res = await fetch('/api/auth/register', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if(!res.ok) throw new Error(data.error ?? "Registration Failed");
    setUser(data.user);
}

async function logout() {
    await fetch('/api/auth/logout', { method: "POST" });
    setUser(null);
}

return (
    <AuthContext value={{ user, loading, login, register, logout }}>
        {children}
    </AuthContext>
)
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

