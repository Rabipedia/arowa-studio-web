import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Shipping & Delivery",
    description:
        "Free delivery across all seven emirates. Orders arrive within 0 to 3 days. Cash on delivery available with no extra fee.",
    alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="mb-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">
                Shipping &amp; Delivery
            </h1>
            <p className="mb-10 text-sm text-muted">Last updated: August 2026</p>

            <div className="prose prose-neutral max-w-none">
                <h2>Where we deliver</h2>
                <p>
                    We deliver to all seven emirates: Dubai, Abu Dhabi, Sharjah, Ajman,
                    Umm Al Quwain, Ras Al Khaimah and Fujairah.
                </p>

                <h2>Delivery cost</h2>
                <p>
                    <strong>Free delivery on every order</strong>, anywhere in the UAE.
                    No minimum spend.
                </p>

                <h2>Delivery time</h2>
                <p>
                    Orders arrive within <strong>0 to 3 days</strong> across the UAE.
                    Dubai orders are often delivered same day or next day.
                </p>

                <h2>Order cut-off</h2>
                <p>
                    Orders placed before <strong>2:00 PM</strong> are processed the same
                    day. Orders placed after 2:00 PM are processed the next working day.
                </p>

                <h2>Cash on delivery</h2>
                <p>
                    Cash on delivery is available on all orders, anywhere in the UAE,
                    with <strong>no extra fee</strong>. Pay the driver in cash when your
                    order arrives.
                </p>

                <h2>Card payment</h2>
                <p>You can also pay securely by card at checkout.</p>

                <h2>Tracking your order</h2>
                <p>
                    We contact you on WhatsApp to confirm your order and arrange
                    delivery. For any update, message us at{" "}
                    <a
                        href="https://wa.me/971504331603"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        +971 50 433 1603
                    </a>
                    .
                </p>

                <h2>Questions</h2>
                <p>
                    See our <Link href="/returns">returns policy</Link> or{" "}
                    <Link href="/contact">get in touch</Link>.
                </p>
            </div>
        </div>
    );
}