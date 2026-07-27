import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const secret = request.headers.get("x-revalidate-secret");

    if(secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const model = body?.model as string | undefined;
    const slug = body?.entry?.slug as string | undefined;

    const revalidated: string[] = [];
    revalidatePath("/");
    revalidatePath("/shop");
    revalidated.push("/", "/shop");

    if(model === "product" && slug) {
        revalidatePath(`/product/${slug}`);
        revalidated.push(`/product/${slug}`);
    }

    return NextResponse.json({ revalidated, at: Date.now() });
}