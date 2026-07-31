import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/StaticPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <StaticPage
      title="Privacy Policy"
      intro="How REO Current collects, uses, and protects your information."
    >
      <p>
        This is placeholder policy text. Replace it with your organization&apos;s
        actual privacy policy before launch.
      </p>
      <h2>Information we collect</h2>
      <p>
        When you subscribe to a newsletter we collect your email address. When you
        browse the site we collect standard analytics such as pages viewed and
        approximate location.
      </p>
      <h2>How we use it</h2>
      <p>
        We use your email only to send the newsletters you request and to
        communicate about your subscription. You can unsubscribe at any time.
      </p>
      <h2>Your choices</h2>
      <p>
        You may request access to, or deletion of, your data by contacting{" "}
        <a href="mailto:privacy@reocurrent.com">privacy@reocurrent.com</a>.
      </p>
    </StaticPage>
  );
}
