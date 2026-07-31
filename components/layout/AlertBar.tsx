import Link from "next/link";
import type { Alert } from "@/lib/types";

export function AlertBar({ alert }: { alert: Alert }) {
  return (
    <div className="border-b border-alertline bg-alertbg">
      <div className="container-page flex items-center gap-3.5 py-2.5 text-[13px]">
        <span className="shrink-0 bg-brand px-2.5 py-[3px] text-[11px] font-extrabold uppercase tracking-[1px] text-white">
          {alert.label}
        </span>
        <Link href={alert.href} className="truncate font-semibold text-ink hover:text-brand">
          {alert.text}
        </Link>
      </div>
    </div>
  );
}
