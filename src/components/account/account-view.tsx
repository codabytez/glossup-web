"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { WordmarkLogo } from "@/components/icons/wordmark";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useLogOut } from "@/hooks/use-session";
import { useWishlist } from "@/hooks/use-wishlist";

interface AccountViewProps {
  customer: Customer;
  products: Product[];
}

export function AccountView({ customer, products }: AccountViewProps) {
  const router = useRouter();
  const { data: wishlistHandles = [] } = useWishlist();
  const logOut = useLogOut();
  const savedProducts = products.filter((p) => wishlistHandles.includes(p.slug));

  const displayName =
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") || customer.email;

  const handleLogOut = async () => {
    await logOut.mutateAsync();
    router.refresh();
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <nav className="border-grey-100 sticky top-0 z-10 flex w-full items-center justify-between border-b px-4 py-6 sm:px-8 sm:py-8">
        <Link href="/" className="relative block h-6 w-40">
          <WordmarkLogo className="h-6 w-40" color="#990B33" />
        </Link>
        <Button
          variant="ghost"
          size="pill"
          onClick={handleLogOut}
          disabled={logOut.isPending}
          className="bg-grey-100 text-grey-950"
        >
          {logOut.isPending ? "Logging out…" : "Log out"}
        </Button>
      </nav>

      <div className="mx-auto flex w-full max-w-384 flex-col gap-10 px-4 py-10 sm:px-8 lg:px-20">
        <div className="flex flex-col gap-1">
          <p className="text-header-h1 text-grey-950 font-normal">Hi, {displayName}</p>
          <p className="text-grey-600 text-sm">{customer.email}</p>
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-header-h2 text-grey-950 font-normal">My Wishlist</p>
          {savedProducts.length === 0 ? (
            <p className="text-grey-600 text-sm">
              Nothing saved yet — tap the heart icon on any product to save it here.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {savedProducts.map((product) => (
                <ProductCard key={product.slug} {...product} className="w-full" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
