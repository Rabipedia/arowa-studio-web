'use client';

import { useState } from "react";
import type { Category } from "@/types/catalog";
import CategoryCard from "./CategoryCard";

const INITIAL_COUNT = 6;

export default function CategoryTiles({ categories }: { categories: Category[] }) {
    const [expanded, setExpanded] = useState(false);

    if (categories.length === 0) return null;

    const visible = expanded ? categories : categories.slice(0, INITIAL_COUNT);
    const hiddenCount = categories.length - INITIAL_COUNT;

    return (
        <div>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-6 md:gap-6">
                {visible.map((category) => (
                    <li key={category.documentId}>
                        <CategoryCard category={category} />
                    </li>
                ))}
            </ul>

            {hiddenCount > 0 && (
                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setExpanded((value) => !value)}
                        className="rounded-full border border-line bg-deep/5 px-6 py-3 text-sm font-medium text-foreground transition hover:bg-deep/10"
                    >
                        {expanded ? "Show less" : `Show more (${hiddenCount})`}
                    </button>
                </div>
            )}
        </div>
    );
}