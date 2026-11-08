'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Category } from "@/types/catalog";

export default function CategoryMenu({
    categories,
    openOnHover = false,
}: {
    categories: Category[];
    openOnHover?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        function onEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onEscape);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onEscape);
        };
    }, []);

    const hoverProps = openOnHover
        ? {
              onMouseEnter: () => setOpen(true),
              onMouseLeave: () => setOpen(false),
          }
        : {};

    return (
        <div ref={ref} className="relative" {...hoverProps}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="Categories"
                className="flex items-center gap-1.5 text-sm font-medium text-foreground transition hover:text-brand"
            >
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                    className="sm:hidden"
                >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>

                <span className="hidden sm:inline">Categories</span>
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={`hidden transition-transform sm:block ${open ? "rotate-180" : ""}`}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 pt-2 sm:left-0 sm:right-auto sm:pt-3">
                    <div className="w-52 overflow-hidden rounded-xl border border-line bg-surface py-1.5 shadow-lg sm:w-64 sm:py-2">
                        <Link
                            href="/shop"
                            onClick={() => setOpen(false)}
                            className="block px-4 py-1.5 text-[13px] font-medium text-foreground transition hover:bg-brand hover:text-white sm:py-2.5 sm:text-sm"
                        >
                            All Products
                        </Link>

                        <div className="my-1 border-t border-line" />

                        {categories.map((category) => (
                            <Link
                                key={category.documentId}
                                href={`/shop?category=${category.slug}`}
                                onClick={() => setOpen(false)}
                                className="block px-4 py-1.5 text-[13px] text-foreground transition hover:bg-brand hover:text-white sm:py-2.5 sm:text-sm"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}