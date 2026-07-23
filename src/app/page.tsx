import CategoryCard from "@/components/home/CategoryCard";
import HeroSlider from "@/components/home/HeroSlider";
import ProductSection from "@/components/product/ProductSection";
import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse, Category, Product, HeroBanner } from "@/types/catalog";


export default async function HomePage(){
  const [categories, trending, best, banners] = await Promise.all([
    fetchStrapi<StrapiResponse<Category>>("/categories", { populate: "image"}),
    fetchStrapi<StrapiResponse<Product>>('/products', {
      "filters[isTrending][$eq]": "true",
      "pagination[pageSize]": "8",
      populate: "*",
    }),
    fetchStrapi<StrapiResponse<Product>>("/products", {
      "filters[isBest][$eq]": 'true',
      "pagination[pageSize]": "8",
      populate: "*",
    }),
    fetchStrapi<StrapiResponse<HeroBanner>>("/hero-banners", {
      populate: "image",
      sort: "displayOrder:asc"
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <HeroSlider banners={banners.data} />

      <section className="mb-16">
        <h2 className="mb-6 font-display text-3xl font-semibold text-foreground">
          Shop by Category
        </h2>
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {categories.data.map((category) => (
            <li key={category.documentId}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </section>

      <ProductSection title="Trending Products" products={trending.data} />
      <ProductSection title="Best Products" products={best.data} />
    </div>
  );
}

  // return (
  //   <div className="mx-auto max-w-6xl px-4 py-10">
  //     <HeroSlider banners={banners.data}/>
  //     <section className="mb-12">
  //       <h2 className="mb-4 text-2xl font-semibold">Shop by Category</h2>
  //       <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
  //         {
  //           categories.data.map((category) => (
  //             <li
  //               key={category.documentId}
  //             >
  //               <CategoryCard category={category}/>
  //             </li>
  //           ))
  //         }
  //       </ul>
  //     </section>

  //     <ProductSection title="Trending Products" products={trending.data}/>
  //     <ProductSection title="Best Products" products={best.data}/>
  //   </div>
  // )
  //}