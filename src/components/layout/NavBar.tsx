import Link from "next/link";

export default function NavBar() {
    return (
        <header className="border-b border-gray-200">
            <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4">
                <Link href="/" className="text-xl font-bold">
                    Arowa Studio
                </Link>
                <input
                    type="search"
                    placeholder="Search products"
                    className="h-10 flex-1 rounded-md border border-gray-300 px-3 text-sm"
                />
                <div className="flex items-center gap-4 text-sm">
                    <Link href="/auth/login">Account</Link>
                    <Link href="/cart">Cart</Link>
                </div>
            </nav>
        </header>
    )
}