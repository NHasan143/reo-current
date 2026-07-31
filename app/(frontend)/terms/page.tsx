import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/StaticPage";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <StaticPage
      title="Terms of Use"
      intro="The terms governing your use of REO Current."
    >
      <p>
        This is placeholder terms text. Replace it with your organization&apos;s
        actual terms of use before launch.
      </p>
      <h2>Use of the site</h2>
      <p>
        REO Current&apos;s content is provided for informational purposes. You may
        read and share our articles for personal, non-commercial use with
        attribution.
      </p>
      <h2>Intellectual property</h2>
      <p>
        All content is © REO Current unless otherwise noted and may not be
        republished in full without permission.
      </p>
      <h2>Disclaimer</h2>
      <p>
        Coverage is not legal, financial, or compliance advice. Verify guidance
        with the relevant agency or a qualified professional.
      </p>
    </StaticPage>
  );
}
