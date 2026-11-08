import { mediaUrl } from "@/lib/strapi";
import { Category } from "@/types/catalog";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ category }: { category: Category }) {
    return (
        <Link href={`/shop?category=${category.slug}`} className="group block">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-deep/5 p-4 transition group-hover:bg-deep/10 sm:p-5">
                {category.image ? (
                    <Image
                        src={mediaUrl(category.image.url)}
                        alt={category.image.alternativeText ?? category.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <span className="font-display text-3xl text-brand sm:text-4xl">
                        {category.name.charAt(0)}
                    </span>
                )}
            </div>
            <p className="mt-3 text-center text-xs font-medium leading-tight text-foreground transition group-hover:text-brand sm:text-sm">
                {category.name}
            </p>
        </Link>
    );
}