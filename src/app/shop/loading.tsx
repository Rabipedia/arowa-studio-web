export default function ShopLoading() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="mb-5">
                <div className="h-8 w-48 animate-pulse rounded bg-deep/10" />
                <div className="mt-2 h-4 w-24 animate-pulse rounded bg-deep/10" />
            </div>

            <ul className="grid grid-cols-2 gap-5 md:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                    <li key={i}>
                        <div className="aspect-square animate-pulse rounded-lg bg-deep/10" />
                        <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-deep/10" />
                        <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-deep/10" />
                    </li>
                ))}
            </ul>
        </div>
    );
}