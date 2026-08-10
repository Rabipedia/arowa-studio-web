import type { Product, ProductVariant } from "@/types/catalog";

export function toPlainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_`>~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function deriveOffer(product: Product): {
  price: number | null;
  salePrice: number | null;
  inStock: boolean;
  defaultVariant: ProductVariant | undefined;
} {
  const variants = product.variants ?? [];

  const priced = variants.filter(
    (v) => typeof (v.discountPrice ?? v.price) === "number",
  );

  const cheapest = priced.reduce<ProductVariant | undefined>((best, v) => {
    if (!best) return v;
    return (v.discountPrice ?? v.price) < (best.discountPrice ?? best.price)
      ? v
      : best;
  }, undefined);

  let price: number | null = null;
  let salePrice: number | null = null;

  if (cheapest) {
    const discount = cheapest.discountPrice;
    if (discount != null && discount < cheapest.price) {
      price = cheapest.price;
      salePrice = discount;
    } else {
      price = discount ?? cheapest.price;
      salePrice = null;
    }
  } else {
    price = product.displayPrice;
  }

  return {
    price,
    salePrice,
    inStock: variants.some((v) => v.stock > 0),
    defaultVariant: variants.find((v) => v.isDefault) ?? variants[0],
  };
}

export function productDescription(
  product: Product,
  maxLength: number,
): string | undefined {
  return (
    product.seoDescription ??
    (product.description
      ? toPlainText(product.description).slice(0, maxLength).trim()
      : undefined)
  );
}