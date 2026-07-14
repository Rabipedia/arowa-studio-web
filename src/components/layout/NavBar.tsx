import Link from "next/link";

export default function NavBar() {
    return (
        <header className="border-b border-gray-200">
            <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4">
                <Link href="/" className="text-xl font-bold">
                    Arowa Studio
                </Link>
                <form action="/shop" className="flex-1">
                    <input
                    type="search"
                    name="search"
                    placeholder="Search products"
                    className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm"
                    />
                </form>
                <div className="flex items-center gap-4 text-sm">
                    <Link href="/auth/login">Account</Link>
                    <Link href="/cart">Cart</Link>
                </div>
            </nav>
        </header>
    )
}