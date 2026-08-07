import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse } from "@/types/catalog";
import type { Guide } from "@/types/guide";

export const revalidate = false;

async function getGuide(slug: string): Promise<Guide | null> {
    const res = await fetchStrapi<StrapiResponse<Guide>>("/guides", {
        "filters[slug][$eq]": slug,
        "populate[sections]": "true",
        "populate[faqs]": "true",
        "populate[category]": "true",
    });
    return res.data[0] ?? null;
}

export async function generateStaticParams() {
    const res = await fetchStrapi<StrapiResponse<Guide>>("/guides", {
        "fields[0]": "slug",
        "pagination[pageSize]": "100",
    });
    return res.data.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const guide = await getGuide(slug);
    if (!guide) return { title: "Guide not found" };

    return {
        title: guide.seoTitle ? { absolute: guide.seoTitle } : guide.title,
        description: guide.seoDescription ?? undefined,
        alternates: { canonical: `/guide/${slug}` },
    };
}

export default async function GuidePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const guide = await getGuide(slug);
    if (!guide) notFound();

    return (
        <article className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="font-display text-4xl font-semibold text-foreground">
                {guide.title}
            </h1>
            <p className="mt-2 text-xs text-muted">
                Updated{" "}
                {new Date(guide.updatedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })}
            </p>

            {guide.intro && (
                <div className="prose prose-sm mt-6 max-w-none text-foreground">
                    <ReactMarkdown>{guide.intro}</ReactMarkdown>
                </div>
            )}

            {guide.sections?.map((section) => (
                <section key={section.id} className="mt-10">
                    <h2 className="mb-3 font-display text-2xl font-semibold text-foreground">
                        {section.heading}
                    </h2>
                    <div className="prose prose-sm max-w-none text-muted">
                        <ReactMarkdown>{section.body}</ReactMarkdown>
                    </div>
                </section>
            ))}

            {guide.faqs && guide.faqs.length > 0 && (
                <section className="mt-12">
                    <h2 className="mb-4 font-display text-2xl font-semibold text-foreground">
                        Common questions
                    </h2>
                    {guide.faqs.map((item) => (
                        <div key={item.id} className="mb-5">
                            <h3 className="mb-1 text-sm font-semibold text-foreground">
                                {item.question}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted">
                                {item.answer}
                            </p>
                        </div>
                    ))}
                </section>
            )}

            {guide.category?.slug && (
                <Link
                    href={`/shop?category=${guide.category.slug}`}
                    className="mt-10 inline-block rounded-md bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-hover"
                >
                    Browse {guide.category.name.toLowerCase()}
                </Link>
            )}
        </article>
    );
}