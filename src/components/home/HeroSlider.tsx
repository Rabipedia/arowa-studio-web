'use client';

import { mediaUrl } from "@/lib/strapi";
import type { HeroBanner  } from "@/types/catalog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";



export default function HeroSlider({ banners }: {banners: HeroBanner[]}) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((i) => (i+1) % banners.length)
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    if(banners.length === 0) return null;

    const banner = banners[index];
    const next = () => setIndex((i) => (i+1) % banners.length);
    const prev = () => setIndex((i) => (i - 1 + banners.length) % banners.length);

    return (
        <section className="relative mb-12 h-80 w-full overflow-hidden rounded-lg">
            <Image
                src={mediaUrl(banner.image.url)}
                alt={banner.image.alternativeText ?? banner.title}
                fill
                className="object-cover"
                priority={index === 0}          
            />
            <div className="absolute inset-0 flex flex-col justify-center bg-black/30 px-10 text-white">
                <h2 className="text-3xl font-bold">{banner.title}</h2>
                {banner.subtitle && <p className="mt-2 text-lg">{banner.subtitle}</p>}
                {banner.linkUrl && (
                    <Link 
                        href={banner.linkUrl}
                        className="mt-4 w-fit rounded bg-white px-5 py-2 text-sm font-medium text-black"
                    >Shop now</Link>
                )}
            </div>

            <button
                onClick={prev}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2"
            >
                ‹
            </button>

            <button
                onClick={next}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2"
            >
                ›
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {
                    banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={()=> setIndex(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
                        />
                    ))
                }
            </div>
        </section>
    )
}