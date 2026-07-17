import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function AddressesPage() {
    const user = await getCurrentUser();
    if(!user) redirect('/auth/login');

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <Link href="/account" className="text-sm text-gray-500 underline">
                ← Account
            </Link>
            <h1 className="mb-6 mt-3 text-2xl font-semibold">Addresses</h1>
            <p className="py-16 text-center text-gray-500">Saved address will appear here after your first order</p>
        </div>
    )
}