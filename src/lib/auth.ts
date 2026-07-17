import { cookies } from "next/headers";
import { NextResponse } from "next/server";


const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

export const TOKEN_COOKIE = "token";

export async function getToken(): Promise<string | null> {
    const store = await cookies();
    return store.get(TOKEN_COOKIE)?.value ?? null;
}

export async function getCurrentUser() {
    const token = await getToken();
    if(!token) return null;

    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}`},
        cache: "no-store",
    })
    if(!res.ok) return null;
    return res.json();
}

export async function authenticateAndSetCookie(
    strapiPath: string,
    body: Record<string, unknown>,
    errorFallback: string
) {
    const res = await fetch(`${STRAPI_URL}/api/${strapiPath}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    });
    const data = await res.json();

    if(!res.ok) {
        return NextResponse.json(
            { error: data.error?.message ?? errorFallback},
            { status: 400}
        );
    }

    const response = NextResponse.json({ user: data.user });

    response.cookies.set(TOKEN_COOKIE, data.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
    });
    return response;
}