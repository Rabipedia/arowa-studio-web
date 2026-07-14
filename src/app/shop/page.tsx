import ProductCard from "@/components/product/ProductCard";
import FilterBar from "@/components/shop/FilterBar";
import { fetchStrapi } from "@/lib/strapi";
import type { Category, Product, StrapiResponse } from "@/types/catalog";
import Link from "next/link";
import SortSelect from "@/components/shop/SortSelect";


const PAGE_SIZE = 12;

const SORTS: Record<string, string> = {
    newest: "createdAt:desc",
    "price-asc": "displayPrice:asc",
    "price-desc": "displayPrice:desc",
};

function first(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
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

    const [products, categories] = await Promise.all([
        fetchStrapi<StrapiResponse<Product>>("/products", query),
        fetchStrapi<StrapiResponse<Category>>("/categories", )
    ]);

    const { page: current, pageCount, total } = products.meta.pagination;

    return(
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex gap-8">
                <FilterBar categories={categories.data}/>

                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold">
                                {
                                    category ? categories.data.find((c) => c.slug === category)?.name ?? "Shop"
                                        : search ?  `Results for "${search}"` : "All Products"
                                }
                            </h1>
                            <p className="text-sm text-gray-500">{total} products</p>
                        </div>
                        <SortSelect/>
                    </div>
                    {
                        products.data.length === 0 ? (
                            <p className="py-16 text-center text-gray-500">No products match your filters.</p>
                        ) : (
                            <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
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
            className={`h-9 w-9 rounded border text-center text-sm leading-9 ${
            page === current ? "border-black font-medium" : "border-gray-300 text-gray-600"
            }`}
        >
            {page}
        </Link>
    )
}