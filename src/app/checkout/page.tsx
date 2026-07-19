'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { fetchStrapi, postStrapi } from "@/lib/strapi";
import { formatPrice } from "@/lib/format";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validation/checkout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { StrapiResponse, ShippingMethod } from "@/types/catalog";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [quote, setQuote] = useState<any>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "AE", email: user?.email ?? "" },
  });

  const shippingMethodId = watch("shippingMethodId");

  useEffect(() => {
    fetchStrapi<StrapiResponse<ShippingMethod>>("/shipping-methods", {
      "filters[isActive][$eq]": "true",
    }).then((res) => setShippingMethods(res.data));
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    postStrapi("/checkout/quote", {
      items,
      shippingMethodId: shippingMethodId || undefined,
      paymentMethod: "cash_on_delivery",
    })
      .then(setQuote)
      .catch(() => setQuote(null));
  }, [items, shippingMethodId]);

  async function onSubmit(data: CheckoutFormData) {
    setError("");
    setSubmitting(true);
    try {
      const result = await postStrapi<{ orderNumber: string, accessToken: string }>(
        "/checkout/place-cod-order",
        {
          items,
          shippingMethodId: data.shippingMethodId,
          contact: { email: data.email, name: data.name, phone: data.phone },
          shippingAddress: {
            fullName: data.name,
            phone: data.phone,
            line1: data.line1,
            line2: data.line2,
            city: data.city,
            region: data.region,
            postalCode: data.postalCode,
            country: data.country,
          },
        }
      );
      clear();
      router.push(`/order/${result.orderNumber}?token=${result.accessToken}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-gray-500">
        Your cart is empty.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto grid max-w-5xl gap-10 px-4 py-10 md:grid-cols-[1fr_20rem]"
    >
      <div>
        <h1 className="mb-6 text-2xl font-semibold">Checkout</h1>

        <h2 className="mb-2 font-medium">Contact</h2>
        <div className="mb-6 space-y-3">
          <div>
            <Input placeholder="Email" {...register("email")} />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <Input placeholder="Full name" {...register("name")} />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <Input placeholder="Phone" {...register("phone")} />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
          </div>
        </div>

        <h2 className="mb-2 font-medium">Shipping address</h2>
        <div className="mb-6 space-y-3">
          <div>
            <Input placeholder="Address line 1" {...register("line1")} />
            {errors.line1 && <p className="mt-1 text-sm text-red-500">{errors.line1.message}</p>}
          </div>
          <Input placeholder="Address line 2 (optional)" {...register("line2")} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input placeholder="City" {...register("city")} />
              {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
            </div>
            <div>
              <Input placeholder="Emirate" {...register("region")} />
              {errors.region && <p className="mt-1 text-sm text-red-500">{errors.region.message}</p>}
            </div>
          </div>
          <Input placeholder="Postal code (optional)" {...register("postalCode")} />
        </div>

        <h2 className="mb-2 font-medium">Shipping method</h2>
        <div className="mb-6 space-y-2">
          {shippingMethods.map((m) => (
            <label key={m.documentId} className="flex items-center gap-3 rounded border border-gray-300 px-3 py-2 text-sm">
              <input type="radio" value={m.documentId} {...register("shippingMethodId")} />
              <span className="flex-1">{m.name} {m.estimatedDays ? `· ${m.estimatedDays}` : ""}</span>
              <span>{formatPrice(m.cost)}</span>
            </label>
          ))}
          {errors.shippingMethodId && (
            <p className="text-sm text-red-500">{errors.shippingMethodId.message}</p>
          )}
        </div>

        <h2 className="mb-2 font-medium">Payment</h2>
        <div className="mb-6 rounded border border-gray-300 px-3 py-2 text-sm">
          Cash on delivery
        </div>
      </div>

      <aside className="h-fit rounded-lg border border-gray-200 p-5">
        <h2 className="mb-4 font-medium">Order summary</h2>
        {quote ? (
          <div className="space-y-2 text-sm">
            {quote.lines.map((l: any) => (
              <div key={l.variantId} className="flex justify-between">
                <span>{l.productName} × {l.quantity}</span>
                <span>{formatPrice(l.lineTotal)}</span>
              </div>
            ))}
            <div className="mt-3 border-t border-gray-200 pt-3 space-y-1">
              <Row label="Subtotal" value={quote.subtotal} />
              <Row label="Shipping" value={quote.shippingCost} />
              <Row label={`Tax (${quote.taxRatePercent}%)`} value={quote.taxAmount} />
              {quote.codFee > 0 && <Row label="COD fee" value={quote.codFee} />}
            </div>
            <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(quote.total)}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Calculating…</p>
        )}

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={submitting} className="mt-5 w-full">
          {submitting ? "Placing order…" : "Place order"}
        </Button>
      </aside>
    </form>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-gray-600">
      <span>{label}</span>
      <span>{formatPrice(value)}</span>
    </div>
  );
}