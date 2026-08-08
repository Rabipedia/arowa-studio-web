'use client';

import type { Category } from "@/types/catalog";
import { useShopFilters } from "@/hooks/useShopFilters";
import { useState } from "react";

const SORT_OPTIONS = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Lowest → Highest Price" },
    { value: "price-desc", label: "Highest → Lowest Price" },
];

type Sheet = "category" | "sort" | "price" | null;

function Chip({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${
                active
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-surface text-foreground"
            }`}
        >
            {children}
        </button>
    );
}

export default function MobileFilterBar({ categories }: { categories: Category[] }) {
    const filters = useShopFilters();
    const { category: currentCategory, sort: currentSort, onSale, update, clearAll } = filters;

    const [sheet, setSheet] = useState<Sheet>(null);
    const [minPrice, setMinPrice] = useState(filters.minPrice);
    const [maxPrice, setMaxPrice] = useState(filters.maxPrice);

    function apply(overrides: Record<string, string | null>) {
        update(overrides);
        setSheet(null);
    }

    const activeCategoryName =
        categories.find((c) => c.slug === currentCategory)?.name ?? "Category";

    return (
        <div className="md:hidden">
            <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
                <Chip active={!!currentCategory} onClick={() => setSheet("category")}>
                    {activeCategoryName}
                </Chip>
                <Chip active={currentSort !== "newest"} onClick={() => setSheet("sort")}>
                    Sort
                </Chip>
                <Chip active={!!(minPrice || maxPrice)} onClick={() => setSheet("price")}>
                    Price
                </Chip>
                <Chip
                    active={onSale}
                    onClick={() => apply({ onSale: onSale ? null : "true" })}
                >
                    On sale
                </Chip>
            </div>

            {sheet && (
                <>
                    <div
                        className="fixed inset-0 z-[60] bg-black/40"
                        onClick={() => setSheet(null)}
                    />
                    <div className="fixed inset-x-0 bottom-0 z-[70] max-h-[75vh] overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-display text-lg font-semibold text-foreground">
                                {sheet === "category" && "Category"}
                                {sheet === "sort" && "Sort by"}
                                {sheet === "price" && "Price (AED)"}
                            </h2>
                            <button
                                onClick={() => setSheet(null)}
                                aria-label="Close"
                                className="text-2xl leading-none text-muted"
                            >
                                ×
                            </button>
                        </div>

                        {sheet === "category" && (
                            <ul className="space-y-1">
                                <li>
                                    <button
                                        onClick={() => apply({ category: null })}
                                        className={`flex w-full items-center justify-between py-3 text-left text-sm ${
                                            currentCategory === "" ? "font-medium text-brand" : "text-foreground"
                                        }`}
                                    >
                                        All Categories
                                        {currentCategory === "" && <span>●</span>}
                                    </button>
                                </li>
                                {categories.map((category) => (
                                    <li key={category.documentId}>
                                        <button
                                            onClick={() => apply({ category: category.slug })}
                                            className={`flex w-full items-center justify-between py-3 text-left text-sm ${
                                                currentCategory === category.slug
                                                    ? "font-medium text-brand"
                                                    : "text-foreground"
                                            }`}
                                        >
                                            {category.name}
                                            {currentCategory === category.slug && <span>●</span>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {sheet === "sort" && (
                            <ul className="space-y-1">
                                {SORT_OPTIONS.map((option) => (
                                    <li key={option.value}>
                                        <button
                                            onClick={() => apply({ sort: option.value })}
                                            className={`flex w-full items-center justify-between py-3 text-left text-sm ${
                                                currentSort === option.value
                                                    ? "font-medium text-brand"
                                                    : "text-foreground"
                                            }`}
                                        >
                                            {option.label}
                                            {currentSort === option.value && <span>●</span>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {sheet === "price" && (
                            <div className="flex items-center gap-3">
                                <input
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="Min"
                                    inputMode="numeric"
                                    className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none"
                                />
                                <span className="text-muted">–</span>
                                <input
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="Max"
                                    inputMode="numeric"
                                    className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none"
                                />
                            </div>
                        )}

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => {
                                    setMinPrice("");
                                    setMaxPrice("");
                                    clearAll();
                                    setSheet(null);
                                }}
                                className="flex-1 rounded-md border border-line py-3 text-sm font-medium text-foreground"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() =>
                                    sheet === "price"
                                        ? apply({
                                              minPrice: minPrice || null,
                                              maxPrice: maxPrice || null,
                                          })
                                        : setSheet(null)
                                }
                                className="flex-1 rounded-md bg-brand py-3 text-sm font-medium text-white"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}