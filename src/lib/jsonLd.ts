import { mediaUrl } from "@/lib/strapi";
import type { Product } from "@/types/catalog";
import { deriveOffer, productDescription } from "@/lib/product";
import {
  absoluteUrl,
  BUSINESS_ADDRESS,
  BUSINESS_PHONE_E164,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";


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

export function buildLocalBusinessJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    name: SITE_NAME,
    url: SITE_URL,
    telephone: BUSINESS_PHONE_E164,
    priceRange: "AED 25 - AED 500",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_ADDRESS.street,
      addressLocality: BUSINESS_ADDRESS.locality,
      addressRegion: BUSINESS_ADDRESS.region,
      addressCountry: BUSINESS_ADDRESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.175663721802216,
      longitude: 55.412400023833726,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "22:00",
    },
    sameAs: [
      "REPLACE_GOOGLE_BUSINESS_PROFILE_URL",
      "https://www.trustpilot.com/review/arowastudio.com",
    ],
  };
}