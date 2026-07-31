import { MiniSignup } from "@/components/forms/MiniSignup";

export function MorningWire({
  description = "Daily industry briefing, in your inbox by 7 AM.",
}: {
  description?: string;
}) {
  return (
    <MiniSignup
      title="The Morning Wire"
      description={description}
      cta="Sign Up Free"
    />
  );
}
