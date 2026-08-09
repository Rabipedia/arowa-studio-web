import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Returns & Refunds",
    description:
        "Return any Arowa Studio order within 14 days. Free returns at the door, refunds processed within 7 business days. Delivery across the UAE.",
    alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="mb-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">
                Returns &amp; Refunds
            </h1>
            <p className="mb-10 text-sm text-muted">Last updated: August 2026</p>

            <div className="prose prose-neutral max-w-none">
                <p>
                    We want you to be happy with what you order. If something is not
                    right, here is how returns work.
                </p>

                <h2>Return window</h2>
                <p>
                    You can return any item within <strong>14 days</strong> of receiving
                    it.
                </p>

                <h2>Condition</h2>
                <p>
                    Items must be unused, in their original packaging, and in resalable
                    condition. Items that have been used, washed, or damaged after
                    delivery cannot be returned.
                </p>

                <h2>Return shipping</h2>
                <ul>
                    <li>
                        <strong>Returned at the door.</strong> If you decide not to keep an
                        item, hand it back to the delivery driver at the time of delivery.
                        There is no charge.
                    </li>
                    <li>
                        <strong>Returned later.</strong> If you request a return after
                        delivery, we arrange a collection and the return collection fee is
                        paid by the customer.
                    </li>
                </ul>

                <h2>How to start a return</h2>
                <p>
                    Message us on WhatsApp at{" "}
                    <a
                        href="https://wa.me/971504331603"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        +971 50 433 1603
                    </a>{" "}
                    or email{" "}
                    <a href="mailto:info@arowastudio.com">info@arowastudio.com</a> with
                    your order number and which items you are returning. We will confirm
                    the return and arrange collection if needed.
                </p>

                <h2>Refunds</h2>
                <p>
                    Once we receive and inspect the returned item, your refund is
                    processed within <strong>7 business days</strong>.
                </p>
                <ul>
                    <li>
                        <strong>Cash on delivery orders</strong> are refunded by bank
                        transfer. We will ask for your account details when the return is
                        confirmed.
                    </li>
                    <li>
                        <strong>Card orders</strong> are refunded to the original card.
                    </li>
                </ul>
                <p>
                    Delivery is free on all orders, so there is no delivery charge to
                    deduct from your refund.
                </p>

                <h2>Damaged or incorrect items</h2>
                <p>
                    If an item arrives damaged or is not what you ordered, contact us
                    within 48 hours with photos. We will replace it or refund it in full,
                    and we cover the return collection.
                </p>

                <h2>Questions</h2>
                <p>
                    See our <Link href="/shipping">shipping information</Link> or{" "}
                    <Link href="/contact">get in touch</Link>.
                </p>
            </div>
        </div>
    );
}