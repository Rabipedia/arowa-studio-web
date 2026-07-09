import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-gray-200">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4">
                <div>
                    <h3 className="mb-3 font-semibold">Arowa Studio</h3>
                    <p className="text-sm text-gray-600">
                        Lighting and electrical products for modern homes.
                    </p>
                </div>
                <div>
                    <h3 className="mb-3 font-semibold">Shop</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><Link href="/shop">All Products</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-3 font-semibold">Customer Service</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><Link href="/track-order">Track Order</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-3 font-semibold">Account</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><Link href="/auth/login">Sign in</Link></li>
                        <li><Link href="/auth/register">Register</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-500">
                © 2026 Arowa Studio
            </div>
        </footer>
    )
}