'use client';

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchStrapi } from "@/lib/strapi";
import { formatPrice } from "@/lib/format";

type OrderView = {
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  placedAt: string | null;
  subtotal: number;
  shippingCost: number;
  shippingMethodLabel: string | null;
  taxAmount: number;
  codFeeSnapshot: number | null;
  total: number;
  currency: string;
  guestName: string | null;
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    region: string;
    postalCode: string | null;
    country: string;
  } | null;
  items: {
    productNameSnapshot: string;
    variantLabelSnapshot: string | null;
    unitPriceSnapshot: number;
    quantity: number;
    lineTotal: number;
  }[];
};

export default function OrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = params.orderNumber as string;
  const token = searchParams.get("token");

  const [order, setOrder] = useState<OrderView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchStrapi<OrderView>(`/checkout/order/${orderNumber}`, { token })
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderNumber, token]);

  if (loading) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-gray-500">Loading…</div>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="mb-2 text-xl font-semibold">Order not found</h1>
        <p className="mb-6 text-sm text-gray-500">
          This order link is invalid or has expired.
        </p>
        <Link href="/shop" className="text-sm underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 text-center">
        <div className="mb-3 text-4xl">✓</div>
        <h1 className="mb-1 text-2xl font-semibold">Thank you for your order</h1>
        <p className="text-sm text-gray-500">
          Order <span className="font-medium">{order.orderNumber}</span>
          {order.placedAt && ` · ${new Date(order.placedAt).toLocaleDateString()}`}
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 p-5">
        <h2 className="mb-3 font-medium">Items</h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between">
              <span>
                {item.productNameSnapshot}
                {item.variantLabelSnapshot && ` (${item.variantLabelSnapshot})`} × {item.quantity}
              </span>
              <span>{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 border-t border-gray-200 pt-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping{order.shippingMethodLabel ? ` (${order.shippingMethodLabel})` : ""}</span>
            <span>{formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span><span>{formatPrice(order.taxAmount)}</span>
          </div>
          {order.codFeeSnapshot ? (
            <div className="flex justify-between">
              <span>Cash on delivery fee</span><span>{formatPrice(order.codFeeSnapshot)}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 font-semibold">
          <span>Total</span><span>{formatPrice(order.total)}</span>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="mb-6 rounded-lg border border-gray-200 p-5 text-sm">
          <h2 className="mb-2 font-medium">Delivery address</h2>
          <p className="text-gray-600">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 && <>, {order.shippingAddress.line2}</>}<br />
            {order.shippingAddress.city}, {order.shippingAddress.region}<br />
            {order.shippingAddress.phone}
          </p>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 p-5 text-sm">
        <h2 className="mb-2 font-medium">Payment</h2>
        <p className="text-gray-600">
          {order.paymentMethod === "cash_on_delivery" ? "Cash on delivery" : "Card"} ·{" "}
          {order.paymentStatus} · Order status: {order.orderStatus.replace(/_/g, " ")}
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        Save this page link to check your order status later.
      </p>
    </div>
  );
}