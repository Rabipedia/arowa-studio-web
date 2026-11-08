import Link from "next/link";
import CartBadge from "./CartBadge";
import AccountNav from "./AccountNav";
import CategoryMenu from "./CategoryMenu";
import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse, Category } from "@/types/catalog";

export default async function NavBar() {
    const categories = await fetchStrapi<StrapiResponse<Category>>("/categories", {
        sort: "navOrder:asc",
        "fields[0]": "name",
        "fields[1]": "slug",
        "fields[2]": "showInNav",
    }).catch(() => ({ data: [] as Category[] }));

    const featured = categories.data.filter((category) => category.showInNav).slice(0, 4);

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

                <div className="order-2 hidden sm:block">
                    <CategoryMenu categories={categories.data} openOnHover />
                </div>

                <div className="order-2 hidden items-center gap-5 lg:flex">
                    {featured.map((category) => (
                        <Link
                            key={category.documentId}
                            href={`/shop?category=${category.slug}`}
                            className="whitespace-nowrap text-sm text-foreground transition hover:text-brand"
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>

                <div className="order-2 ml-auto flex items-center gap-4 text-sm sm:order-4 sm:ml-0">
                    <AccountNav />
                    <CartBadge />
                </div>

                <div className="order-3 flex w-full items-center gap-3 sm:ml-auto sm:w-auto">
                    <form action="/shop" className="relative flex-1 sm:w-56 sm:flex-none md:w-72">
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

                    <div className="shrink-0 sm:hidden">
                        <CategoryMenu categories={categories.data} />
                    </div>
                </div>
            </nav>
        </header>
    );
}