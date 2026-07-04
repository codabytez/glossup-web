import { Breadcrumb } from "@/components/ui/breadcrumb";

interface CollectionDetailViewProps {
  slug: string;
}

function slugToLabel(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function CollectionDetailView({ slug }: CollectionDetailViewProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collection" },
    { label: slugToLabel(slug) },
  ];

  return (
    <main className="flex flex-1 flex-col pt-24">
      <div className="px-4 pt-8 sm:px-8 sm:pt-10 lg:px-10 lg:pt-8 xl:px-20">
        <div className="2xl:mx-auto 2xl:max-w-384">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
    </main>
  );
}
