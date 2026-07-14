'use client'

import { useSearchParams, useRouter } from "next/navigation";

const OPTIONS = [
    { value: 'newest', label: 'Newest'},
    { value: 'price-asc', label: 'price low to high'},
    { value: 'price-desc', label: 'price high to low'}
];

export default function SortSelect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const current = searchParams.get('sort') ?? 'newest';

    function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', e.target.value);
        params.delete('page');
        router.push(`/shop?${params.toString()}`);
    }

    return(
        <select
            value={current}
            onChange={onChange}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm"
        >
            {
                OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))
            }
        </select>
    )
}