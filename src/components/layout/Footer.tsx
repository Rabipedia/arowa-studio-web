import Link from "next/link";
import {
  BUSINESS_ADDRESS,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_E164,
} from "@/lib/seo";

export default function Footer() {
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
                    <address className="mt-4 text-sm not-italic leading-relaxed text-white/70">
                        {BUSINESS_ADDRESS.street}<br />
                        {BUSINESS_ADDRESS.locality}, {BUSINESS_ADDRESS.region}<br />
                        <a
                            href={`tel:${BUSINESS_PHONE_E164}`}
                            className="transition hover:text-white"
                        >
                            {BUSINESS_PHONE_DISPLAY}
                        </a>
                    </address>
                </div>
                <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">Shop</h3>
                    <ul className="space-y-2 text-sm text-white/70">
                        <li><Link href="/shop" className="transition hover:text-white">All Products</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">Customer Service</h3>
                                        <ul className="space-y-2 text-sm text-white/70">
                        <li><Link href="/returns" className="transition hover:text-white">Returns &amp; Refunds</Link></li>
                        <li><Link href="/shipping" className="transition hover:text-white">Shipping</Link></li>
                        <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
                        <li><Link href="/track-order" className="transition hover:text-white">Track Order</Link></li>
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