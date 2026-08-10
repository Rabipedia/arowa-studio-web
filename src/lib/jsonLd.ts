import { absoluteUrl } from "@/lib/seo";
import { mediaUrl } from "@/lib/strapi";
import type { Product } from "@/types/catalog";
import { deriveOffer, productDescription } from "@/lib/product";


export function buildProductJsonLd(product: Product): Record<string, unknown> {
  const { price, salePrice, inStock, defaultVariant } = deriveOffer(product);
  const effectivePrice = salePrice ?? price;
  const images = (product.images ?? []).map((img) => mediaUrl(img.url));
  const url = absoluteUrl(`/product/${product.slug}`);

  const description = productDescription(product, 300);

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

  if (effectivePrice != null) {
    jsonLd.offers = {
      "@type": "Offer",
      url,
      priceCurrency: "AED",
      price: effectivePrice.toFixed(2),
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