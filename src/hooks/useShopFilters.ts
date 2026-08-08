'use client';

import { useRouter, useSearchParams } from "next/navigation";

export function useShopFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const category = searchParams.get("category") ?? "";
    const sort = searchParams.get("sort") ?? "newest";
    const onSale = searchParams.get("onSale") === "true";
    const minPrice = searchParams.get("minPrice") ?? "";
    const maxPrice = searchParams.get("maxPrice") ?? "";

    function update(overrides: Record<string, string | null>) {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(overrides)) {
            if (value === null || value === "") params.delete(key);
            else params.set(key, value);
        }
        params.delete("page");
        router.push(`/shop?${params.toString()}`);
    }

    function clearAll() {
        router.push("/shop");
    }

    return { category, sort, onSale, minPrice, maxPrice, update, clearAll };
}