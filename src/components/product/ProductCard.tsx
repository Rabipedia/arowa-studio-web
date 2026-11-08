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
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition hover:shadow-md"
        >
            <div className="relative aspect-square w-full overflow-hidden bg-background">
                {image ? (
                    <Image
                        src={mediaUrl(image.url)}
                        alt={image.alternativeText ?? product.name}
                        width={400}
                        height={400}
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                        No image
                    </div>
                )}
                {originalPrice != null && (
                    <span className="absolute left-2 top-2 rounded-md bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white sm:left-3 sm:top-3 sm:px-2 sm:py-1 sm:text-xs">
                        -{discountPercent}%
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-2.5 sm:p-4">
                <h3 className="mb-1 line-clamp-2 min-h-[2rem] text-xs font-medium leading-4 text-foreground sm:min-h-[2.5rem] sm:text-sm sm:leading-5">
                    {product.name}
                </h3>

                {hasRating && (
                    <p className="mb-1 flex items-center gap-1 text-[10px] text-muted sm:text-xs">
                        <span className="text-gold">★</span>
                        <span className="font-medium text-foreground">
                            {product.averageRating!.toFixed(1)}
                        </span>
                        <span>({product.reviewCount})</span>
                    </p>
                )}

                <div className="mt-auto">
                    {price != null ? (
                        <div className="flex items-baseline gap-1.5 sm:gap-2">
                            <span className="text-sm font-semibold text-deep sm:text-base">
                                {formatPrice(price)}
                            </span>
                            {originalPrice != null && (
                                <span className="text-[11px] text-muted line-through sm:text-sm">
                                    {formatPrice(originalPrice)}
                                </span>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs text-muted sm:text-sm">Price unavailable</p>
                    )}
                </div>
            </div>
        </Link>
    );
}