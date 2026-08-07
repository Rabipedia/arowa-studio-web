import type { Category, StrapiEntity } from "@/types/catalog";

export interface GuideSection {
    id: number;
    heading: string;
    body: string;
}

export interface GuideFaq {
    id: number;
    question: string;
    answer: string;
}

export interface Guide extends StrapiEntity {
    title: string;
    slug: string;
    intro: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    sections?: GuideSection[];
    faqs?: GuideFaq[];
    category?: Category | null;
}