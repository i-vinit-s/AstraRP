import LegalLayout from "@/components/legal/LegalLayout";
import terms from "@/data/terms";

export const metadata = {
  title: "Terms of Service | Astra Roleplay",
  description:
    "Read the Terms of Service governing your use of Astra Roleplay.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      badge="Legal"
      title="Terms of Service"
      description="By accessing Astra Roleplay, you agree to follow these Terms of Service. These terms govern your use of our website, Discord community, FiveM server, and any related services."
      lastUpdated="1 July 2026"
      sections={terms}
    />
  );
}
