'use client';

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { fetchStrapi, mediaUrl } from "@/lib/strapi";
import type { ProductVariant, StrapiResponse } from "@/types/catalog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function CartPage() {
    const {items, removeItem, updateQuantity} = useCart();
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(items.length === 0) {
            setVariants([]);
            setLoading(false);
            return;
        }
        const query: Record<string, string> = {
            'populate[product][populate]': 'images',
            'populate[images]': 'true',
            'populate[attributeValues]': 'true',
        };
        items.forEach((item, i) => {
            query[`filters[documentId][$in][${i}]`] = item.variantId;
        });
        setLoading(true);
        fetchStrapi<StrapiResponse<ProductVariant>>('/product-variants', query)
            .then((res) => setVariants(res.data))
            .finally(() => setLoading(false))
    }, [items]);

    const lines = items.map((item) => ({
        item,
        variant: variants.find((v) => v.documentId === item.variantId),
    }));

    const subtotal = lines.reduce((sum, {item, variant}) => {
        if(!variant) return sum;
        const price = variant.discountPrice ?? variant.price;
        return sum + price * item.quantity;
    }, 0);

    if(items.length === 0) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                <h1 className="mb-4 font-display text-3xl font-semibold text-foreground">Your cart is empty</h1>
                <p className="mb-6 text-sm text-muted">Browse the collection and add something you love.</p>
                <Link
                    href="/shop"
                    className="inline-block rounded-md bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-hover"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-semibold text-foreground">Your cart</h1>

      <ul className="divide-y divide-line border-y border-line">
        {lines.map(({ item, variant }) => {
          if (!variant) {
            return (
              <li
                key={item.variantId}
                className="flex items-center justify-between py-4 text-sm text-muted"
              >
                <span>This item is no longer available.</span>
                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-brand underline transition hover:text-brand-hover"
                >
                  Remove
                </button>
              </li>
            );
          }

          const price = variant.discountPrice ?? variant.price;
          const image = variant.images?.[0] ?? variant.product?.images?.[0];
          const label = variant.attributeValues
            ?.map((v) => v.value)
            .join(', ');

          return (
            <li key={item.variantId} className="flex gap-4 py-4">
              <div className="h-20 w-20 shrink-0">
                {image ? (
                  <Image
                    src={mediaUrl(image.url)}
                    alt={image.alternativeText ?? variant.product?.name ?? ''}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-md border border-line object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-md border border-line bg-background text-xs text-muted">
                    No image
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <Link
                  href={`/product/${variant.product?.slug ?? ''}`}
                  className="font-medium text-foreground transition hover:text-brand"
                >
                  {variant.product?.name ?? 'Product'}
                </Link>
                {label && <p className="text-sm text-muted">{label}</p>}
                <p className="text-sm text-muted">{formatPrice(price)}</p>

                <div className="mt-auto flex items-center gap-4">
                  <div className="flex items-center rounded-md border border-line">
                    <button
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity - 1)
                      }
                      className="px-2 py-1 text-foreground transition hover:text-brand"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-sm text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.variantId,
                          Math.min(variant.stock, item.quantity + 1)
                        )
                      }
                      className="px-2 py-1 text-foreground transition hover:text-brand"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-sm text-muted underline transition hover:text-brand"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right text-sm font-semibold text-deep">
                {formatPrice(price * item.quantity)}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-col items-end gap-3">
        <p className="text-lg text-foreground">
          Subtotal:{' '}
          <span className="font-semibold text-deep">
            {loading ? '…' : formatPrice(subtotal)}
          </span>
        </p>
        <Link
          href="/checkout"
          className="rounded-md bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-hover"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}

// 'use client';

// import { useCart } from "@/context/CartContext";
// import { formatPrice } from "@/lib/format";
// import { fetchStrapi, mediaUrl } from "@/lib/strapi";
// import type { ProductVariant, StrapiResponse } from "@/types/catalog";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";


// export default function CartPage() {
//     const {items, removeItem, updateQuantity} = useCart();
//     const [variants, setVariants] = useState<ProductVariant[]>([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if(items.length === 0) {
//             setVariants([]);
//             setLoading(false);
//             return;
//         }
//         const query: Record<string, string> = {
//             'populate[product][populate]': 'images',
//             'populate[images]': 'true',
//             'populate[attributeValues]': 'true',
//         };
//         items.forEach((item, i) => {
//             query[`filters[documentId][$in][${i}]`] = item.variantId;
//         });
//         setLoading(true);
//         fetchStrapi<StrapiResponse<ProductVariant>>('/product-variants', query)
//             .then((res) => setVariants(res.data))
//             .finally(() => setLoading(false))
//     }, [items]);

//     const lines = items.map((item) => ({
//         item,
//         variant: variants.find((v) => v.documentId === item.variantId),
//     }));

//     const subtotal = lines.reduce((sum, {item, variant}) => {
//         if(!variant) return sum;
//         const price = variant.discountPrice ?? variant.price;
//         return sum + price * item.quantity;
//     }, 0);

//     if(items.length === 0) {
//         return (
//             <div className="mx-auto max-w-3xl px-4 py-16 text-center">
//                 <h1 className="mb-4 text-2xl font-semibold">Your cart is empty</h1>
//                 <Link href="/shop">
//                     Continue Shopping
//                 </Link>
//             </div>
//         );
//     }

//     return (
//     <div className="mx-auto max-w-4xl px-4 py-10">
//       <h1 className="mb-6 text-2xl font-semibold">Your cart</h1>

//       <ul className="divide-y divide-gray-200 border-y border-gray-200">
//         {lines.map(({ item, variant }) => {
//           if (!variant) {
//             return (
//               <li
//                 key={item.variantId}
//                 className="flex items-center justify-between py-4 text-sm text-gray-500"
//               >
//                 <span>This item is no longer available.</span>
//                 <button
//                   onClick={() => removeItem(item.variantId)}
//                   className="underline"
//                 >
//                   Remove
//                 </button>
//               </li>
//             );
//           }

//           const price = variant.discountPrice ?? variant.price;
//           const image = variant.images?.[0] ?? variant.product?.images?.[0];
//           const label = variant.attributeValues
//             ?.map((v) => v.value)
//             .join(', ');

//           return (
//             <li key={item.variantId} className="flex gap-4 py-4">
//               <div className="h-20 w-20 shrink-0">
//                 {image ? (
//                   <Image
//                     src={mediaUrl(image.url)}
//                     alt={image.alternativeText ?? variant.product?.name ?? ''}
//                     width={80}
//                     height={80}
//                     className="h-20 w-20 rounded object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-20 w-20 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
//                     No image
//                   </div>
//                 )}
//               </div>

//               <div className="flex flex-1 flex-col">
//                 <Link
//                   href={`/product/${variant.product?.slug ?? ''}`}
//                   className="font-medium"
//                 >
//                   {variant.product?.name ?? 'Product'}
//                 </Link>
//                 {label && <p className="text-sm text-gray-500">{label}</p>}
//                 <p className="text-sm">{formatPrice(price)}</p>

//                 <div className="mt-auto flex items-center gap-4">
//                   <div className="flex items-center rounded border border-gray-300">
//                     <button
//                       onClick={() =>
//                         updateQuantity(item.variantId, item.quantity - 1)
//                       }
//                       className="px-2 py-1"
//                       aria-label="Decrease quantity"
//                     >
//                       −
//                     </button>
//                     <span className="min-w-8 text-center text-sm">
//                       {item.quantity}
//                     </span>
//                     <button
//                       onClick={() =>
//                         updateQuantity(
//                           item.variantId,
//                           Math.min(variant.stock, item.quantity + 1)
//                         )
//                       }
//                       className="px-2 py-1"
//                       aria-label="Increase quantity"
//                     >
//                       +
//                     </button>
//                   </div>
//                   <button
//                     onClick={() => removeItem(item.variantId)}
//                     className="text-sm text-gray-500 underline"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>

//               <div className="text-right text-sm font-medium">
//                 {formatPrice(price * item.quantity)}
//               </div>
//             </li>
//           );
//         })}
//       </ul>

//       <div className="mt-6 flex flex-col items-end gap-3">
//         <p className="text-lg">
//           Subtotal:{' '}
//           <span className="font-semibold">
//             {loading ? '…' : formatPrice(subtotal)}
//           </span>
//         </p>
//         <Link
//           href="/checkout"
//           className="rounded bg-black px-6 py-3 text-sm font-medium text-white"
//         >
//           Proceed to checkout
//         </Link>
//       </div>
//     </div>
//   );
// }