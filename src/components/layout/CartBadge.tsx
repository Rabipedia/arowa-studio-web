'use client'
import { useCart } from "@/context/CartContext";
import Link from "next/link";

 

 export default function CartBadge() {
    const { totalCount } = useCart();
    return(
        <Link href="/cart" className="relative">
            Cart
            {
                totalCount > 0 && (
                    <span className="absolute -right-4 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs text-white">
                        {totalCount}
                    </span>
                )
            }
        </Link>
    )
 }