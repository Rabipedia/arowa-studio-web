import Link from "next/link";
import { fetchStrapi } from "@/lib/strapi";
import { BUSINESS_PHONE_DISPLAY } from "@/lib/seo";
import type { Category, StrapiResponse } from "@/types/catalog";

const BUSINESS_EMAIL = "info@arowastudio.com";

export default async function Footer() {
    const categories = await fetchStrapi<StrapiResponse<Category>>("/categories", {
        sort: "navOrder:asc",
        "fields[0]": "name",
        "fields[1]": "slug",
        "fields[2]": "showInNav",
    }).catch(() => ({ data: [] as Category[] }));

    const featured = categories.data.filter((category) => category.showInNav).slice(0, 6);

    return (
        <footer className="mt-16 bg-deep text-white">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
                <div>
                    <h3 className="mb-3 font-display text-xl font-bold">
                        <span className="text-white">Arowa</span>{" "}
                        <span className="text-gold">Studio</span>
                    </h3>
                    <p className="text-sm text-white/70">
                        Curated home and lifestyle products for modern living in the UAE.
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-white/70">
                        Free delivery to your door across the UAE: Dubai, Abu Dhabi,
                        Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah and Fujairah.
                        Cash on delivery available.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-white/70">
                        <li>
                            <a
                                href={`tel:${BUSINESS_PHONE_DISPLAY}`}
                                className="inline-flex items-center gap-2 transition hover:text-white"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                    className="shrink-0"
                                >
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                {BUSINESS_PHONE_DISPLAY}
                            </a>
                        </li>
                        <li>
                            <a
                                href={`mailto:${BUSINESS_EMAIL}`}
                                className="inline-flex items-center gap-2 transition hover:text-white"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                    className="shrink-0"
                                >
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                <span className="break-all">{BUSINESS_EMAIL}</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">Shop</h3>
                    <ul className="space-y-2 text-sm text-white/70">
                        <li><Link href="/shop" className="transition hover:text-white">All Products</Link></li>
                        {featured.map((category) => (
                            <li key={category.documentId}>
                                <Link
                                    href={`/shop?category=${category.slug}`}
                                    className="transition hover:text-white"
                                >
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">Customer Service</h3>
                    <ul className="space-y-2 text-sm text-white/70">
                        <li><Link href="/returns" className="transition hover:text-white">Returns &amp; Refunds</Link></li>
                        <li><Link href="/shipping" className="transition hover:text-white">Shipping</Link></li>
                        <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">Account</h3>
                    <ul className="space-y-2 text-sm text-white/70">
                        <li><Link href="/auth/login" className="transition hover:text-white">Sign in</Link></li>
                        <li><Link href="/auth/register" className="transition hover:text-white">Register</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
                © 2026 Arowa Studio
            </div>
        </footer>
    );
}