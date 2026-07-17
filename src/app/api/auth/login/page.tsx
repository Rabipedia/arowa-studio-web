'use client';
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Login() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try{
            await login(email, password)
            router.push("/account");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally{
            setSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-sm px-4 py-16">
            <h1 className="mb-6 text-2xl font-semibold">Sign In</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required                
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Signing in..." : "Sign in"}
                </Button>
            </form>
            <p className="mt-4 text-sm text-gray-500">
                No account?{" "}
                <Link href="/auth/register">Register</Link>
            </p>
        </div>
    )
}