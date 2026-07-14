'use client'

import type { Category } from "@/types/catalog";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";


export default function FilterBar({categories}: {categories: Category[]}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get('category') ?? '';
    const onSale = searchParams.get('onSale') === 'true';
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');

    function update (overrides: Record<string, string | null>) {
        const params = new URLSearchParams(searchParams.toString());

        for(const [key, value] of Object.entries(overrides)) {
            if(value === null || value === '') params.delete(key);
            else params.set(key, value);
        }
        params.delete('page');
        router.push(`/shop?${params.toString()}`)
    }

    return (
        <aside className="w-56 shrink-0">
            <h2 className="mb-4 font-semibold">Filters</h2>

            <div className="mb-6">
                <p className="mb-2 text-sm font-medium">Category</p>
                <ul className="space-y-1 text-sm">
                    <li>
                        <button
                            onClick={() => update({category: null})}
                            className={currentCategory === '' ? 'font-medium' : 'text-gray-600'}
                        >
                            All Categories
                        </button>
                    </li>
                    {categories.map((category) => (
                        <li key={category.documentId}>
                            <button
                                onClick={() => update({ category: category.slug })}
                                className={
                                    currentCategory === category.slug ? 'font-medium' : 'text-gray-600'
                                }
                            >
                              {category.name}  
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-6">
                <p className="mb-2 text-sm font-medium">Price (AED)</p>
                <div className="flex items-center gap-2">
                    <input
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min"
                        inputMode="numeric"
                        className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                    <span>-</span>
                    <input
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        inputMode="numeric"
                        className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                </div>
                <button
                    onClick={() => update({minPrice: minPrice || null, maxPrice: maxPrice || null})} 
                    className="mt-2 rounded border border-gray-300 px-3 py-1 text-sm"              
                >
                    Apply
                </button>
            </div>

            <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={onSale}
                        onChange={(e) => update({ onSale: e.target.checked ? 'true' : null})}
                    />
                On Sale Only
            </label>

            <button
                onClick={() => router.push('/shop')}
                className="mt-6 block text-sm text-gray-500 underline"
            >
                Clear all filters.
            </button>
        </aside>
    )
}