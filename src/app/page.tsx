import ProductCard from "@/components/product/productCard";
import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse, Category, Product } from "@/types/catalog";

export default async function HomePage(){
  const [catergories, products] = await Promise.all([
    fetchStrapi<StrapiResponse<Category>>("/categories"),
    fetchStrapi<StrapiResponse<Product>>('/products', { populate: '*' }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Shop by Category</h2>
        <ul className="flex flex-wrap gap-3">
          {
            catergories.data.map((category) => (
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

      <section>
          <h2 className="mb-4 text-2xl font-semibold">Products</h2>
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {products.data.map((product) => (
              <li key={product.documentId}>
                <ProductCard product={product}/>
              </li>
            ))}
          </ul>
      </section>
    </div>
  )
}