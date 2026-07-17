'use client'

import { useAuth } from "@/context/AuthContext"
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountNav() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    if(loading) return <span className="text-gray-400">...</span>

    if(!user) {
        return <Link href="/auth/login">Account</Link>
    }

    async function handleLogout () {
        await logout();
        router.push("/");
        router.refresh();
    }

    return (
        <div className="flex items-center gap-3">
            <Link href="/account">Account</Link>
            <button onClick={handleLogout} className="text-gray-500 underline">Logout</button>
        </div>
    )
}