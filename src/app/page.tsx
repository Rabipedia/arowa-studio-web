import CategoryTiles from "@/components/home/CategoryTiles";
import HeroSlider from "@/components/home/HeroSlider";
import ProductCard from "@/components/product/ProductCard";
import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse, Category, Product, HeroBanner } from "@/types/catalog";
import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { buildLocalBusinessJsonLd } from "@/lib/jsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = false;

const HOME_PRODUCT_COUNT = 20;

export default async function HomePage() {
  const [categories, featured, recent, banners] = await Promise.all([
    fetchStrapi<StrapiResponse<Category>>("/categories", {
      populate: "image",
      sort: "navOrder:asc",
    }),
    fetchStrapi<StrapiResponse<Product>>("/products", {
      "filters[isActive][$eq]": "true",
      "filters[displayOrder][$gt]": "0",
      sort: "displayOrder:asc",
      "pagination[pageSize]": String(HOME_PRODUCT_COUNT),
      "populate[images]": "true",
    }),
    fetchStrapi<StrapiResponse<Product>>("/products", {
      "filters[isActive][$eq]": "true",
      sort: "createdAt:desc",
      "pagination[pageSize]": String(HOME_PRODUCT_COUNT),
      "populate[images]": "true",
    }),
    fetchStrapi<StrapiResponse<HeroBanner>>("/hero-banners", {
      populate: "image",
      sort: "displayOrder:asc",
    }),
  ]);

  const featuredIds = new Set(featured.data.map((product) => product.documentId));
  const products = [
    ...featured.data,
    ...recent.data.filter((product) => !featuredIds.has(product.documentId)),
  ].slice(0, HOME_PRODUCT_COUNT);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={buildLocalBusinessJsonLd()} />
      <HeroSlider banners={banners.data} />

      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Shop by Category
        </h2>
        <CategoryTiles categories={categories.data} />
      </section>

      <section className="mb-12">
        <h2 className="mb-6 font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Our Products
        </h2>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.documentId}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <Link
            href="/shop"
            className="rounded-full bg-brand px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-hover"
          >
            View all products
          </Link>
        </div>
      </section>
    </div>
  );
}