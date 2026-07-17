import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function AccountPage() {
    const user = await getCurrentUser();
    if(!user) redirect("/auth/login");

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="mb-1 text-2xl font-semibold">My account</h1>
            <p className="mb-8 text-sm text-gray-500">{user.email}</p>

            <div className="grid gap-4 sm:grid-cols-3">
                <Link
                    href="/account/orders"
                    className="rounded-lg border border-gray-200 p-5 hover:border-gray-400"
                >
                    <h2 className="font-medium">Orders</h2>
                    <p className="text-sm text-gray-500">View your order history</p>
                </Link>
                <Link
                    href="/account/addresses"
                    className="rounded-lg border border-gray-200 p-5 hover:border-gray-400"
                >
                    <h2 className="font-medium">Addresses</h2>
                    <p className="text-sm text-gray-500">Managed saved addresses</p>
                </Link>
                <form action='/api/auth/logout' method="post" className="rounded-lg border border-gray-200 p-5">
                    <h2 className="font-medium">Sign out</h2>
                    <button type="submit" className="mt-1 text-sm text-red-500 underline">
                        Log out
                    </button>
                </form>
            </div>
        </div>
    )
}