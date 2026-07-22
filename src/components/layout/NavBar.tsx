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
            <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4">
                <Link
                    href="/"
                    className="order-1 font-display text-2xl font-bold tracking-tight whitespace-nowrap"
                >
                    <span className="text-brand">Arowa</span>{" "}
                    <span className="text-deep">Studio</span>
                </Link>

                <form
                    action="/shop"
                    className="relative order-3 w-full sm:order-2 sm:w-auto sm:flex-1"
                >
                    <input
                        type="search"
                        name="search"
                        placeholder="Search products"
                        className="h-11 w-full rounded-full border border-line bg-surface pl-5 pr-14 text-sm text-foreground placeholder:text-muted shadow-sm focus:border-brand focus:outline-none"
                    />
                    <button
                        type="submit"
                        aria-label="Search"
                        className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand-hover"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </button>
                </form>

                <div className="order-2 ml-auto flex items-center gap-4 text-sm sm:order-3 sm:ml-0">
                    <AccountNav/>
                    <CartBadge/>
                </div>
            </nav>
        </header>
    )
}