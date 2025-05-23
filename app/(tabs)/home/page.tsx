import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { PlusIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

const getCachedProducts = nextCache(getInitialProducts, ["home-products"]);

async function getInitialProducts() {
	console.log("hit!");
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        // take: 1,
        orderBy: {
            created_at: "desc",
        },
    });
    return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
    typeof getInitialProducts
>;

export const metadata = {
	title: "Home",
};

//export const dynamic = "force-dynamic"; //static 페이지를 dynamic 페이지로 변경

export const revalidate = 60;//특정한 시간에 페이지를 재검증

export default async function Products() {
    const initialProducts = await getInitialProducts();
	const revalidate = async ()=>{
		"use server";
		revalidatePath("/home");
	};
    return (
        <div>
            <ProductList initialProducts={initialProducts} />
			<form action={revalidate}>
				<button>Revalidate</button>
			</form>
            <Link
                href="/products/add"
                className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
            >
                <PlusIcon className="size-10" />
            </Link>
        </div>
    );
}
