import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/StaticPage";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <StaticPage
      title="Contact"
      intro="Story tips, corrections, and advertising inquiries."
    >
      <h2>Newsroom</h2>
      <p>
        Have a tip or a correction? Email{" "}
        <a href="mailto:newsroom@reocurrent.com">newsroom@reocurrent.com</a>.
      </p>
      <h2>Advertising</h2>
      <p>
        For sponsorships and newsletter placements, see our{" "}
        <a href="/advertise">advertise page</a> or email{" "}
        <a href="mailto:advertising@reocurrent.com">advertising@reocurrent.com</a>.
      </p>
      <h2>General</h2>
      <p>
        For everything else, reach us at{" "}
        <a href="mailto:hello@reocurrent.com">hello@reocurrent.com</a>.
      </p>
    </StaticPage>
  );
}
