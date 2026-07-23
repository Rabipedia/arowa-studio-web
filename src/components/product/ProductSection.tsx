// import type { Product } from "@/types/catalog";
// import ProductCard from "./ProductCard";

// export default function ProductSection({
//     title,
//     products
// } : {
//     title: string;
//     products: Product[];
// }) {
//     if(products.length === 0) return null;

//     return (
//         <section className="mb-12">
//             <h2 className="mb-4 text-2xl font-semibold">
//                 {title}
//             </h2>
//             <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
//                 {
//                     products.map((product) => (
//                         <li key={product.documentId}>
//                             <ProductCard product={product}/>
//                         </li>
//                     ))
//                 }
//             </ul>
//         </section>
//     )
// }

import type { Product } from "@/types/catalog";
import ProductCard from "./ProductCard";

export default function ProductSection({
    title,
    products
}: {
    title: string;
    products: Product[];
}) {
    if (products.length === 0) return null;

    return (
        <section className="mb-16">
            <h2 className="mb-6 font-display text-3xl font-semibold text-foreground">
                {title}
            </h2>
            <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                    <li key={product.documentId}>
                        <ProductCard product={product} />
                    </li>
                ))}
            </ul>
        </section>
    );
}