import { absoluteUrl } from "@/lib/seo";
import { mediaUrl } from "@/lib/strapi";
import type { Product } from "@/types/catalog";

function toPlainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_`>~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildProductJsonLd(product: Product): Record<string, unknown> {
  const variants = product.variants ?? [];
  const prices = variants
    .map((v) => v.discountPrice ?? v.price)
    .filter((p): p is number => typeof p === "number");

  const price = prices.length > 0 ? Math.min(...prices) : product.displayPrice;
  const inStock = variants.some((v) => v.stock > 0);
  const defaultVariant = variants.find((v) => v.isDefault) ?? variants[0];
  const images = (product.images ?? []).map((img) => mediaUrl(img.url));
  const url = absoluteUrl(`/product/${product.slug}`);

  const description =
    product.seoDescription ??
    (product.description
      ? toPlainText(product.description).slice(0, 300)
      : undefined);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url,
  };

  if (description) jsonLd.description = description;
  if (images.length > 0) jsonLd.image = images;
  if (defaultVariant?.sku) jsonLd.sku = defaultVariant.sku;
  if (product.category?.name) jsonLd.category = product.category.name;

  if (price != null) {
    jsonLd.offers = {
      "@type": "Offer",
      url,
      priceCurrency: "AED",
      price: price.toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    };
  }

  if (product.averageRating != null && product.reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
    };
  }

  return jsonLd;
}