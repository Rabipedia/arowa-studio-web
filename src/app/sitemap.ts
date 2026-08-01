import type { MetadataRoute } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { absoluteUrl } from "@/lib/seo";
import type { Category, Product, StrapiResponse } from "@/types/catalog";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    fetchStrapi<StrapiResponse<Product>>("/products", {
      "filters[isActive][$eq]": "true",
      "fields[0]": "slug",
      "fields[1]": "updatedAt",
      "pagination[pageSize]": "100",
    }),
    fetchStrapi<StrapiResponse<Category>>("/categories", {
      "fields[0]": "slug",
      "fields[1]": "updatedAt",
      "pagination[pageSize]": "100",
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/shop"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.data.map((c) => ({
    url: absoluteUrl(`/shop?category=${c.slug}`),
    lastModified: new Date(c.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.data.map((p) => ({
    url: absoluteUrl(`/product/${p.slug}`),
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}