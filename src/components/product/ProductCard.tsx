import { formatPrice } from "@/lib/format";
import { mediaUrl } from "@/lib/strapi";
import type { Product } from "@/types/catalog";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
    const price = product.displayPrice;
    const image = product.images?.[0];
    const hasRating = product.averageRating != null && product.reviewCount > 0;

    const saleVariant =
        price != null
            ? product.variants?.find((v) => v.discountPrice === price && v.price > price)
            : undefined;
    const originalPrice = saleVariant?.price ?? null;
    const discountPercent =
        originalPrice != null && price != null
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : 0;

    return (
        <Link
            href={`/product/${product.slug}`}
            className="group block overflow-hidden rounded-xl border border-line bg-surface transition hover:shadow-md"
        >
            <div className="relative aspect-square w-full overflow-hidden bg-background">
                {image ? (
                    <Image
                        src={mediaUrl(image.url)}
                        alt={image.alternativeText ?? product.name}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                        No image
                    </div>
                )}
                {originalPrice != null && (
                    <span className="absolute left-3 top-3 rounded-md bg-brand px-2 py-1 text-xs font-semibold text-white">
                        -{discountPercent}%
                    </span>
                )}
            </div>

            <div className="p-4">
                <h3 className="mb-1 line-clamp-2 text-sm font-medium text-foreground">
                    {product.name}
                </h3>

                {hasRating && (
                    <p className="mb-1 flex items-center gap-1 text-xs text-muted">
                        <span className="text-gold">★</span>
                        <span className="font-medium text-foreground">
                            {product.averageRating!.toFixed(1)}
                        </span>
                        <span>({product.reviewCount})</span>
                    </p>
                )}

                {price != null ? (
                    <div className="flex items-baseline gap-2">
                        <span className="text-base font-semibold text-deep">
                            {formatPrice(price)}
                        </span>
                        {originalPrice != null && (
                            <span className="text-sm text-muted line-through">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-muted">Price unavailable</p>
                )}
            </div>
        </Link>
    );
}