import { fetchStrapi, mediaUrl } from "@/lib/strapi";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";
import { deriveOffer, productDescription } from "@/lib/product";
import type { Product, StrapiResponse } from "@/types/catalog";

export const revalidate = 3600;

const PAGE_SIZE = 100;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchAllProducts(): Promise<Product[]> {
  const all: Product[] = [];
  let page = 1;
  let pageCount = 1;

  do {
    const res = await fetchStrapi<StrapiResponse<Product>>("/products", {
      "filters[isActive][$eq]": "true",
      "pagination[page]": String(page),
      "pagination[pageSize]": String(PAGE_SIZE),
      "populate[images]": "true",
      "populate[category]": "true",
      "populate[variants]": "true",
    });

    all.push(...res.data);
    pageCount = res.meta.pagination.pageCount;
    page += 1;
  } while (page <= pageCount);

  return all;
}

function buildItem(product: Product): string | null {
  const { price, salePrice, inStock } = deriveOffer(product);
  const images = (product.images ?? []).map((img) => mediaUrl(img.url));

  if (images.length === 0) {
    console.warn(`[feed] skipped "${product.name}" (${product.slug}): no images`);
    return null;
  }

  if (price == null) {
    console.warn(`[feed] skipped "${product.name}" (${product.slug}): no price`);
    return null;
  }

  const url = absoluteUrl(`/product/${product.slug}`);
  const description = productDescription(product, 5000) ?? product.name;

  const parts = [
    `<g:id>${escapeXml(product.documentId)}</g:id>`,
    `<title>${escapeXml(product.name.slice(0, 150))}</title>`,
    `<description>${escapeXml(description)}</description>`,
    `<link>${escapeXml(url)}</link>`,
    `<g:image_link>${escapeXml(images[0])}</g:image_link>`,
    ...images
      .slice(1, 11)
      .map(
        (img) =>
          `<g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`,
      ),
    `<g:availability>${inStock ? "in_stock" : "out_of_stock"}</g:availability>`,
    `<g:price>${price.toFixed(2)} AED</g:price>`,
  ];

  if (salePrice != null) {
    parts.push(`<g:sale_price>${salePrice.toFixed(2)} AED</g:sale_price>`);
  }

  parts.push(`<g:condition>new</g:condition>`);
  parts.push(`<g:identifier_exists>false</g:identifier_exists>`);

  if (product.category?.name) {
    parts.push(
      `<g:product_type>${escapeXml(product.category.name)}</g:product_type>`,
    );
  }

  return `    <item>\n      ${parts.join("\n      ")}\n    </item>`;
}

export async function GET() {
  const products = await fetchAllProducts();
  const items = products
    .map(buildItem)
    .filter((item): item is string => item !== null);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>Product feed for ${escapeXml(SITE_NAME)}</description>
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}