import { MiniSignup } from "@/components/forms/MiniSignup";

export function MorningWire({
  description =
    "Daily briefing on preservation, inspections, and REO — in your inbox by 9 AM.",
}: {
  description?: string;
}) {
  return (
    <MiniSignup
      title="The Morning Wire"
      description={description}
      cta="Sign Up Free"
      className="min-h-[300px]"
    />
  );
}
