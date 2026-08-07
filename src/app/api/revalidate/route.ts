import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { fetchStrapi } from "@/lib/strapi";
import type { StrapiResponse } from "@/types/catalog";
import type { Guide } from "@/types/guide";

export async function POST(request: Request) {
    const secret = request.headers.get("x-revalidate-secret");

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const model = body?.model as string | undefined;
    const slug = body?.entry?.slug as string | undefined;

    const revalidated: string[] = [];
    revalidatePath("/");
    revalidatePath("/shop");
    revalidated.push("/", "/shop");

    if (model === "product" && slug) {
        revalidatePath(`/product/${slug}`);
        revalidated.push(`/product/${slug}`);
    }

    if (model === "guide" && slug) {
        revalidatePath(`/guide/${slug}`);
        revalidated.push(`/guide/${slug}`);
    }

    if (model === "category" && slug) {
        const guides = await fetchStrapi<StrapiResponse<Guide>>("/guides", {
            "filters[category][slug][$eq]": slug,
            "fields[0]": "slug",
        }).catch(() => null);

        for (const guide of guides?.data ?? []) {
            revalidatePath(`/guide/${guide.slug}`);
            revalidated.push(`/guide/${guide.slug}`);
        }
    }

    return NextResponse.json({ revalidated, at: Date.now() });
}