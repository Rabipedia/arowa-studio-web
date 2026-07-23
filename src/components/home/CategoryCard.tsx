// import { mediaUrl } from "@/lib/strapi";
// import { Category } from "@/types/catalog";
// import Image from "next/image";
// import Link from "next/link";


// export default function CategoryCard({ category } : {category: Category}) {
//     return (
//         <Link
//             href={`/shop?category=${category.slug}`}
//             className="group flex flex-col items-center gap-2"
//         >
//             {
//                 category.image ? (
//                     <Image
//                         src={mediaUrl(category.image.url)}
//                         alt={category.image.alternativeText ?? category.name}
//                         width={160}
//                         height={160}
//                         className="h-28 w-28 rounded-full object-cover transition group-hover:scale-105"
//                     />
//                 ) : (
//                     <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-400">
//                         {category.name.charAt(0)}
//                     </div>
//                 )
//             }
//             <span className="text-sm group-hover:underline">{category.name}</span>
//         </Link>

//     )
// }

import { mediaUrl } from "@/lib/strapi";
import { Category } from "@/types/catalog";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ category }: { category: Category }) {
    return (
        <Link
            href={`/shop?category=${category.slug}`}
            className="group flex flex-col items-center gap-3"
        >
            {category.image ? (
                <Image
                    src={mediaUrl(category.image.url)}
                    alt={category.image.alternativeText ?? category.name}
                    width={160}
                    height={160}
                    className="h-28 w-28 rounded-full border border-line object-cover transition group-hover:scale-105 group-hover:border-gold"
                />
            ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-line bg-surface font-display text-3xl text-brand transition group-hover:border-gold">
                    {category.name.charAt(0)}
                </div>
            )}
            <span className="text-sm font-medium text-foreground transition group-hover:text-brand">
                {category.name}
            </span>
        </Link>
    );
}