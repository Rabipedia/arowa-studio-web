import { fetchStrapi } from "@/lib/strapi";
import type { Product, StrapiResponse } from "@/types/catalog";
import ProductSection from "@/components/product/ProductSection";
import ProductView from "@/components/product/ProductView";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";



async function getProduct(slug:string): Promise<Product | null> {
    const res = await fetchStrapi<StrapiResponse<Product>>("/products", {
        "filters[slug][$eq]": slug,
        "populate[images]": "true",
        "populate[category]": "true",
        "populate[variants][populate][attributeValues][populate][attribute]": "true",
        "populate[variants][populate][images]": "true"
    });
    return res.data[0] ?? null;
}

export async function generateMetadata({
    params,
} : {
    params: Promise< {slug: string}>;
}) {
    const {slug} = await params;
    const product = await getProduct(slug);
    if(!product) return { title: "Product not found!"};

    return {
        title: product.seoTitle ?? `${product.name} - Arowa Studio`,
        description: product.seoDescription ?? undefined,
    };
}

export default async function ProductPage({
    params,
} : {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProduct(slug);
    if(!product) notFound();

    const related = await fetchStrapi<StrapiResponse<Product>>("/products", {
        "filters[category][slug][$eq]": product.category?.slug ?? "",
        "filters[slug][$ne]": product.slug,
        "pagination[pageSize]": "4",
        "populate": "*",
    });

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <p className="mb-6 text-sm text-gray-500">
                Home / {product.category?.name ?? "Shop"} / {product.name}
            </p>

            <ProductView product={product} />

            {product.description && (
                <section className="mb-12 max-w-3xl">
                    <h2 className="mb-3 text-xl font-semibold">Description</h2>
                    <div className="prose prose-sm">
                        <ReactMarkdown>{product.description}</ReactMarkdown>
                    </div>
                </section>
            )}

            <ProductSection title="Related Products" products={related.data} />
        </div>
    )
}