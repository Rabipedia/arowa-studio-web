import {formatPrice} from "@/lib/format";
import { mediaUrl } from "@/lib/strapi";
import type { Product } from "@/types/catalog";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product } : {product: Product}) {
const price = product.displayPrice;
const image = product.images?.[0];

return (
    <Link 
        href={`/product/${product.slug}`}
        className="block rounded-lg border border-gray-200 p-4 transition hover:border-gray-400"
    >
     {image ? (
        <Image
            src={mediaUrl(image.url)}
            alt={image.alternativeText ?? product.name}
            width={300}
            height={300}
            className="mb-3 h-40 w-full rounded object-cover"
        />
     ) : (
        <div className="mb-3 flex h-40 w-full items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
            No image
        </div>
     )}

     <h3 className="mb-1 text-sm font-medium">{product.name}</h3>
     {price != null ? (
        <p className="text-sm font-semibold">{formatPrice(price)}</p>
     ) : (
        <p className="text-sm text-gray-400">Price unavailable</p>
     )}
    </Link>
)
}