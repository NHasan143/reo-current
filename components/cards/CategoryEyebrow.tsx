import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryEyebrow({
  category,
  className = "",
}: {
  category: Category;
  className?: string;
}) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className={`eyebrow hover:text-brand-dark ${className}`}
    >
      {category.name}
    </Link>
  );
}
