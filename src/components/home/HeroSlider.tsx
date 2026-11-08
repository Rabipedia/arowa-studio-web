'use client';

import { mediaUrl } from "@/lib/strapi";
import type { HeroBanner } from "@/types/catalog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSlider({ banners }: { banners: HeroBanner[] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (banners.length === 0) return;
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    if (banners.length === 0) {
        return (
            <section className="mb-12 flex h-56 w-full flex-col justify-center overflow-hidden rounded-2xl bg-deep px-5 text-white sm:h-96 sm:px-12">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gold sm:mb-3 sm:text-sm">
                    Arowa Studio
                </p>
                <h2 className="max-w-xl font-display text-2xl font-semibold leading-tight sm:text-5xl">
                    Illuminate your space
                </h2>
                <p className="mt-2 max-w-md text-sm text-white/80 sm:mt-4 sm:text-base">
                    Statement chandeliers, pendant lights, and electrical accessories, delivered across the UAE.
                </p>
                <Link
                    href="/shop"
                    className="mt-4 w-fit rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-deep transition hover:bg-gold-hover sm:mt-6 sm:px-6 sm:py-3"
                >
                    Shop the collection
                </Link>
            </section>
        );
    }

    const banner = banners[index];

    return (
        <section className="relative mb-12 h-56 w-full overflow-hidden rounded-2xl sm:h-96">
            <Image
                src={mediaUrl(banner.image.url)}
                alt={banner.image.alternativeText ?? banner.title}
                fill
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="object-cover"
                priority={index === 0}
            />
            <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-black/70 via-black/40 to-transparent px-5 text-white sm:px-12">
                <h2 className="max-w-xl font-display text-2xl font-semibold leading-tight sm:text-5xl">
                    {banner.title}
                </h2>
                {banner.subtitle && (
                    <p className="mt-2 max-w-md text-sm text-white/85 sm:mt-3 sm:text-lg">
                        {banner.subtitle}
                    </p>
                )}
                {banner.linkUrl && (
                    <Link
                        href={banner.linkUrl}
                        className="mt-4 w-fit rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-deep transition hover:bg-gold-hover sm:mt-6 sm:px-6 sm:py-3"
                    >
                        Shop now
                    </Link>
                )}
            </div>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-gold" : "w-2 bg-white/50"}`}
                    />
                ))}
            </div>
        </section>
    );
}