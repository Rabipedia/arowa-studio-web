import type { MetadataRoute } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { absoluteUrl } from "@/lib/seo";
import type { Category, Product, StrapiResponse } from "@/types/catalog";
import type { Guide } from "@/types/guide";

export const revalidate = 3600;

const PAGE_SIZE = 100;
const MAX_PAGES = 50;

async function fetchAll<T>(
  path: string,
  extraParams: Record<string, string> = {},
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  let pageCount = 1;

  do {
    const res = await fetchStrapi<StrapiResponse<T>>(path, {
      ...extraParams,
      "fields[0]": "slug",
      "fields[1]": "updatedAt",
      "pagination[page]": String(page),
      "pagination[pageSize]": String(PAGE_SIZE),
    });

    all.push(...res.data);
    pageCount = res.meta.pagination.pageCount;
    page += 1;
  } while (page <= pageCount && page <= MAX_PAGES);

  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, guideList] = await Promise.all([
    fetchAll<Product>("/products", { "filters[isActive][$eq]": "true" }),
    fetchAll<Category>("/categories"),
    fetchAll<Guide>("/guides"),
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
    {
      url: absoluteUrl("/contact"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/shipping"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/returns"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: absoluteUrl(`/shop?category=${c.slug}`),
    lastModified: new Date(c.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: absoluteUrl(`/product/${p.slug}`),
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guideList.map((g) => ({
    url: absoluteUrl(`/guide/${g.slug}`),
    lastModified: new Date(g.updatedAt),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...guideRoutes, ...productRoutes];
}