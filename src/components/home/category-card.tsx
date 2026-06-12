import Image from "next/image";

import type { Category } from "@/types/category";

type CategoryCardProps = Category;

export function CategoryCard({ name, count, description, image }: CategoryCardProps) {
  return (
    <div className="relative h-108 w-74 shrink-0 overflow-hidden rounded-sm">
      <Image src={image} alt={name} fill sizes="296px" className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_16%,rgba(0,0,0,0)_80%,rgba(0,0,0,0.4)_90%)]" />
      <div className="absolute inset-0 flex flex-col justify-end gap-2 p-4">
        <div className="flex items-center gap-1 leading-[1.24] whitespace-nowrap">
          <span className="text-header-h1 font-normal text-white">{name}</span>
          <span className="text-grey-200 text-[20.64px] font-light">{count}</span>
        </div>
        <p className="text-grey-50 text-sm font-medium">{description}</p>
      </div>
    </div>
  );
}
