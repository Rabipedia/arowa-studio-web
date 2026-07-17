import { getCurrentUser, getToken } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { redirect } from "next/navigation";


const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

type Order = {
    documentId: string;
    orderNumber: string;
    orderStatus: string;
    total: number;
    placedAt: string | null;
    createdAt: string;
};

export default async function OrdersPage() {
    const user = await getCurrentUser();
    if(!user) redirect("/auth/login");

    const token = await getToken();
    const res = await fetch(
        `${STRAPI_URL}/api/orders?filters[customer][id][$eq]=${user.id}&sort=createdAt:desc`,
        {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        }
    );
    const orders: Order[] = res.ok ? (await res.json()).data : [];

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <Link href="/account" className="">
                ← Account
            </Link>
            <h1 className="mb-6 mt-3 text-2xl font-semibold">Orders</h1>
            {
                orders.length === 0 ? (
                    <p className="py-16 text-center text-gray-500">You have not placed an order yet!</p>
                ) : (
                    <ul className="divide-y divide-gray-200 border-y border-gray-200">
                        {
                            orders.map(order => (
                                <li key={order.documentId} className="flex items-center justify-between py-4">
                                    <div>
                                        <p className="font-medium">{order.orderNumber}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.placedAt ?? order.createdAt).toLocaleDateString()} .{" "}
                                            {order.orderStatus.replace(/_/g, " ")}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </div>
    )
}