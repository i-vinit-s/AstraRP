import LegalLayout from "@/components/legal/LegalLayout";
import privacy from "@/data/privacy";

export const metadata = {
  title: "Privacy Policy | Astra Roleplay",
  description:
    "Learn how Astra Roleplay collects, stores and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      badge="Legal"
      title="Privacy Policy"
      description="This Privacy Policy explains what information Astra Roleplay collects, how we use it, and the choices you have regarding your personal data."
      lastUpdated="1 July 2026"
      sections={privacy}
    />
  );
}
