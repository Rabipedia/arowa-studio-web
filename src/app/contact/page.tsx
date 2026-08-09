import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Visit Arowa Studio at EBK-01, Dragon Mart 1, Dubai. Open daily 10 AM to 10 PM. WhatsApp +971 50 433 1603 or email info@arowastudio.com.",
    alternates: { canonical: "/contact" },
};

export default function ContactPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="mb-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">
                Contact Us
            </h1>
            <p className="mb-10 text-sm text-muted">
                We reply to messages during shop hours, every day.
            </p>

            <div className="prose prose-neutral max-w-none">
                <h2>Visit our shop</h2>
                <p>
                    <strong>Arowa Studio</strong>
                    <br />
                    EBK-01, Dragon Mart 1
                    <br />
                    Dubai, United Arab Emirates
                </p>
                <p>
                    <strong>Opening hours:</strong> 10:00 AM to 10:00 PM, daily
                </p>

                <h2>Get in touch</h2>
                <p>
                    <strong>WhatsApp:</strong>{" "}
                    <a
                        href="https://wa.me/971504331603"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        +971 50 433 1603
                    </a>
                    <br />
                    <strong>Phone:</strong>{" "}
                    <a href="tel:+971557519880">+971 55 751 9880</a>
                    <br />
                    <strong>Email:</strong>{" "}
                    <a href="mailto:info@arowastudio.com">info@arowastudio.com</a>
                </p>
                <p>
                    WhatsApp is the fastest way to reach us. You can message us about a
                    product, an existing order, or a return.
                </p>

                <h2>Orders</h2>
                <p>
                    For questions about an existing order, please have your order number
                    ready. It looks like ARW-XXXXXXXX and appears on your order
                    confirmation page.
                </p>

                <h2>Policies</h2>
                <p>
                    See our <Link href="/returns">returns and refunds policy</Link> and{" "}
                    <Link href="/shipping">shipping information</Link>.
                </p>
            </div>
        </div>
    );
}