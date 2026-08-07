import ProductCard from "@/components/product/ProductCard";
import FilterBar from "@/components/shop/FilterBar";
import { fetchStrapi } from "@/lib/strapi";
import type { Category, Product, StrapiResponse } from "@/types/catalog";
import Link from "next/link";
import SortSelect from "@/components/shop/SortSelect";
import type { Metadata } from "next";
import type { Guide } from "@/types/guide";

export const revalidate = false;
const PAGE_SIZE = 12;

const SORTS: Record<string, string> = {
    newest: "createdAt:desc",
    "price-asc": "displayPrice:asc",
    "price-desc": "displayPrice:desc",
};

function first(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

function metaDescription(text: string, max = 155): string {
    if (text.length <= max) return text;
    return text.slice(0, text.lastIndexOf(" ", max)) + "…";
}

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
    const sp = await searchParams;
    const categorySlug = first(sp.category);
    const search = first(sp.search);
    const page = first(sp.page);

    if (search) {
        return {
            title: `Search results for "${search}"`,
            robots: { index: false, follow: true },
        };
    }

    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (page && page !== "1") params.set("page", page);
    const query = params.toString();
    const canonical = query ? `/shop?${query}` : "/shop";

    if (!categorySlug) {
        return {
            title: "Shop All Products",
            description:
                "Browse the full Arowa Studio collection. Home, decor, lighting, drinkware and more, with cash on delivery across the UAE.",
            alternates: { canonical },
        };
    }

    const categories = await fetchStrapi<StrapiResponse<Category>>("/categories", {
        "filters[slug][$eq]": categorySlug,
        "fields[0]": "name",
        "fields[1]": "description",
    });
    const category = categories.data[0];
    if (!category) return { title: "Shop", alternates: { canonical } };

    return {
        title: `${category.name} in the UAE`,
        description: category.description
            ? metaDescription(category.description)
            : `Shop ${category.name.toLowerCase()} at Arowa Studio. Delivered across Dubai and all Emirates with cash on delivery.`,
    };
}

export default async function ShopPage({
    searchParams
}: {searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const sp = await searchParams;
    const category = first(sp.category);
    const search = first(sp.search);
    const sortKey = first(sp.sort) ?? "newest";
    const page = Number(first(sp.page) ?? "1");
    const minPrice = first(sp.minPrice);
    const maxPrice = first(sp.maxPrice);
    const onSale = first(sp.onSale) === 'true';

    const query: Record<string, string> = {
        "filters[isActive][$eq]": "true",
        "pagination[page]": String(page),
        "pagination[pageSize]": String(PAGE_SIZE),
        sort: SORTS[sortKey] ?? SORTS.newest,
        "populate[images]": "true"
    };

    if(category) query["filters[category][slug][$eq]"] = category;
    if(search) query["filters[name][$containsi]"] = search;
    if(minPrice) query["filters[displayPrice][$gte]"] = minPrice;
    if(maxPrice) query["filters[displayPrice][$lte]"] = maxPrice;
    if(onSale) query["filters[variants][discountPrice][$notNull]"] = "true";

    const [products, categories, guides] = await Promise.all([
        fetchStrapi<StrapiResponse<Product>>("/products", query),
        fetchStrapi<StrapiResponse<Category>>("/categories"),
        category
            ? fetchStrapi<StrapiResponse<Guide>>("/guides", {
                  "filters[category][slug][$eq]": category,
                  "fields[0]": "slug",
                  "fields[1]": "title",
                  "pagination[pageSize]": "1",
              })
            : Promise.resolve(null),
    ]);

    const { page: current, pageCount, total } = products.meta.pagination;

    const activeCategory = category
        ? categories.data.find((c) => c.slug === category)
        : undefined;

    const guide = guides?.data[0] ?? null;

    return(
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-col gap-8 md:flex-row">
                <FilterBar categories={categories.data}/>

                                <div className="flex-1">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-display text-3xl font-semibold text-foreground">
                                    {category
                                        ? activeCategory?.name ?? "Shop"
                                        : search
                                          ? `Results for "${search}"`
                                          : "All Products"}
                                </h1>
                                <p className="text-sm text-muted">{total} products</p>
                            </div>
                            <SortSelect/>
                        </div>

                        {activeCategory?.description && (
                            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
                                {activeCategory.description}
                            </p>
                        )}

                        {guide && (
                            <p className="mt-3 text-sm">
                                <Link
                                    href={`/guide/${guide.slug}`}
                                    className="text-brand underline underline-offset-4 hover:text-brand-hover"
                                >
                                    {guide.title}
                                </Link>
                            </p>
                        )}
                    </div>
                    {
                        products.data.length === 0 ? (
                            <p className="py-16 text-center text-muted">No products match your filters.</p>
                        ) : (
                            <ul className="grid grid-cols-2 gap-5 md:grid-cols-3">
                                {
                                    products.data.map((product) => (
                                        <li key={product.documentId}>
                                            <ProductCard product={product}/>
                                        </li>
                                    ))
                                }
                            </ul>
                        )
                    }
                    { 
                        pageCount > 1 && (
                            <div className="mt-10 flex justify-center gap-2">
                                {
                                    Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                                        <PageLink key={p} page={p} current={current} sp={sp}/>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

function buildHref(
    sp: Record<string, string | string[] | undefined>,
    overrides: Record<string, string>
) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
        const v = Array.isArray(value) ? value[0]: value;

        if(v) params.set(key, v);
    }
    for(const [key, value] of Object.entries(overrides)) {
        params.set(key, value);
    }
    return `/shop?${params.toString()}`;
}

function PageLink({
    page,
    current,
    sp,
}: {
    page: number;
    current: number;
    sp: Record<string, string | string[] | undefined>;
}) {
    return (
        <Link
            href={buildHref(sp, { page: String(page)})}
            className={`h-9 w-9 rounded-md border text-center text-sm leading-9 transition ${
            page === current ? "border-brand bg-brand font-medium text-white" : "border-line text-muted hover:border-brand"
            }`}
        >
            {page}
        </Link>
    )
}

// import ProductCard from "@/components/product/ProductCard";
// import FilterBar from "@/components/shop/FilterBar";
// import { fetchStrapi } from "@/lib/strapi";
// import type { Category, Product, StrapiResponse } from "@/types/catalog";
// import Link from "next/link";
// import SortSelect from "@/components/shop/SortSelect";


// const PAGE_SIZE = 12;

// const SORTS: Record<string, string> = {
//     newest: "createdAt:desc",
//     "price-asc": "displayPrice:asc",
//     "price-desc": "displayPrice:desc",
// };

// function first(value: string | string[] | undefined): string | undefined {
//     return Array.isArray(value) ? value[0] : value;
// }

// export default async function ShopPage({
//     searchParams
// }: {searchParams: Promise<Record<string, string | string[] | undefined>>;
// }) {
//     const sp = await searchParams;
//     const category = first(sp.category);
//     const search = first(sp.search);
//     const sortKey = first(sp.sort) ?? "newest";
//     const page = Number(first(sp.page) ?? "1");
//     const minPrice = first(sp.minPrice);
//     const maxPrice = first(sp.maxPrice);
//     const onSale = first(sp.onSale) === 'true';

//     const query: Record<string, string> = {
//         "filters[isActive][$eq]": "true",
//         "pagination[page]": String(page),
//         "pagination[pageSize]": String(PAGE_SIZE),
//         sort: SORTS[sortKey] ?? SORTS.newest,
//         "populate[images]": "true"
//     };

//     if(category) query["filters[category][slug][$eq]"] = category;
//     if(search) query["filters[name][$containsi]"] = search;
//     if(minPrice) query["filters[displayPrice][$gte]"] = minPrice;
//     if(maxPrice) query["filters[displayPrice][$lte]"] = maxPrice;
//     if(onSale) query["filters[variants][discountPrice][$notNull]"] = "true";

//     const [products, categories] = await Promise.all([
//         fetchStrapi<StrapiResponse<Product>>("/products", query),
//         fetchStrapi<StrapiResponse<Category>>("/categories", )
//     ]);

//     const { page: current, pageCount, total } = products.meta.pagination;

//     return(
//         <div className="mx-auto max-w-6xl px-4 py-10">
//             <div className="flex gap-8">
//                 <FilterBar categories={categories.data}/>

//                 <div className="flex-1">
//                     <div className="mb-6 flex items-center justify-between">
//                         <div>
//                             <h1 className="text-2xl font-semibold">
//                                 {
//                                     category ? categories.data.find((c) => c.slug === category)?.name ?? "Shop"
//                                         : search ?  `Results for "${search}"` : "All Products"
//                                 }
//                             </h1>
//                             <p className="text-sm text-gray-500">{total} products</p>
//                         </div>
//                         <SortSelect/>
//                     </div>
//                     {
//                         products.data.length === 0 ? (
//                             <p className="py-16 text-center text-gray-500">No products match your filters.</p>
//                         ) : (
//                             <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
//                                 {
//                                     products.data.map((product) => (
//                                         <li key={product.documentId}>
//                                             <ProductCard product={product}/>
//                                         </li>
//                                     ))
//                                 }
//                             </ul>
//                         )
//                     }
//                     { 
//                         pageCount > 1 && (
//                             <div className="mt-10 flex justify-center gap-2">
//                                 {
//                                     Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
//                                         <PageLink key={p} page={p} current={current} sp={sp}/>
//                                     ))
//                                 }
//                             </div>
//                         )
//                     }
//                 </div>
//             </div>
//         </div>
//     )
// }

// function buildHref(
//     sp: Record<string, string | string[] | undefined>,
//     overrides: Record<string, string>
// ) {
//     const params = new URLSearchParams();
//     for (const [key, value] of Object.entries(sp)) {
//         const v = Array.isArray(value) ? value[0]: value;

//         if(v) params.set(key, v);
//     }
//     for(const [key, value] of Object.entries(overrides)) {
//         params.set(key, value);
//     }
//     return `/shop?${params.toString()}`;
// }

// function PageLink({
//     page,
//     current,
//     sp,
// }: {
//     page: number;
//     current: number;
//     sp: Record<string, string | string[] | undefined>;
// }) {
//     return (
//         <Link
//             href={buildHref(sp, { page: String(page)})}
//             className={`h-9 w-9 rounded border text-center text-sm leading-9 ${
//             page === current ? "border-black font-medium" : "border-gray-300 text-gray-600"
//             }`}
//         >
//             {page}
//         </Link>
//     )
// }