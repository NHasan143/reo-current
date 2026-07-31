import Image from "next/image";

/**
 * Renders a featured/thumbnail image when a source is available, otherwise the
 * warm taupe placeholder shown throughout the mockups. `label` is drawn inside
 * the empty state (e.g. "Lead Photo", "Featured Photo").
 */
export function Photo({
  src,
  alt = "",
  label = "",
  className = "",
  sizes,
  priority = false,
}: {
  src?: string;
  alt?: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-photo ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "100vw"}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`photo-ph ${className}`} aria-hidden="true">
      {label}
    </div>
  );
}
