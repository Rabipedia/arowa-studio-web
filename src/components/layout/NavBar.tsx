// import Link from "next/link";
// import CartBadge from "./CartBadge";
// import AccountNav from "./AccountNav";

// export default function NavBar() {
//     return (
//         <header className="border-b border-gray-200">
//             <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4">
//                 <Link href="/" className="text-xl font-bold">
//                     Arowa Studio
//                 </Link>
//                 <form action="/shop" className="flex-1">
//                     <input
//                     type="search"
//                     name="search"
//                     placeholder="Search products"
//                     className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm"
//                     />
//                 </form>
//                 <div className="flex items-center gap-4 text-sm">
//                     <AccountNav/>
//                     <CartBadge/>
//                 </div>
//             </nav>
//         </header>
//     )
// }

import Link from "next/link";
import CartBadge from "./CartBadge";
import AccountNav from "./AccountNav";

export default function NavBar() {
    return (
        <header className="border-b border-line bg-surface">
            <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4">
                <Link
                    href="/"
                    className="font-display text-2xl font-bold tracking-tight whitespace-nowrap"
                >
                    <span className="text-brand">Arowa</span>{" "}
                    <span className="text-deep">Studio</span>
                </Link>
                <form action="/shop" className="flex-1">
                    <input
                        type="search"
                        name="search"
                        placeholder="Search products"
                        className="h-10 w-full rounded-md border border-line bg-background px-3 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none"
                    />
                </form>
                <div className="flex items-center gap-4 text-sm">
                    <AccountNav/>
                    <CartBadge/>
                </div>
            </nav>
        </header>
    )
}