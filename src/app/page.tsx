import ProductCard from "@/components/product/productCard";
import ProductSection from "@/components/product/ProductSection";
import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse, Category, Product } from "@/types/catalog";
import { Z_BEST_COMPRESSION } from "zlib";

export default async function HomePage(){
  const [categories, trending, best] = await Promise.all([
    fetchStrapi<StrapiResponse<Category>>("/categories"),
    fetchStrapi<StrapiResponse<Product>>('/products', {
      "filters[isTrending][$eq]": "true",
      "pagination[pageSize]": "8",
      populate: "*",
    }),
    fetchStrapi<StrapiResponse<Product>>("/products", {
      "filters[isBest]": 'true',
      "pagination[pageSize]": "8",
      populate: "*",
    })
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Shop by Category</h2>
        <ul className="flex flex-wrap gap-3">
          {
            categories.data.map((category) => (
              <li
                key={category.documentId}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm"
              >
                {category.name}
              </li>
            ))
          }
        </ul>
      </section>

      <ProductSection title="Trending Products" products={trending.data}/>
      <ProductSection title="Best Products" products={best.data}/>
    </div>
  )
}