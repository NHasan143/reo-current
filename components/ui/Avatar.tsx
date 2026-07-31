import Image from "next/image";

/** Circular avatar: photo when available, else serif initials on taupe. */
export function Avatar({
  initials,
  src,
  name = "",
  size = 42,
  className = "",
}: {
  initials: string;
  src?: string;
  name?: string;
  size?: number;
  className?: string;
}) {
  const dimension = { width: size, height: size };

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        {...dimension}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      style={dimension}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-avatar font-serif font-bold text-[#7a7364] ${className}`}
    >
      <span style={{ fontSize: Math.round(size * 0.36) }}>{initials}</span>
    </span>
  );
}
