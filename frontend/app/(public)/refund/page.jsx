import LegalLayout from "@/components/legal/LegalLayout";
import refund from "@/data/refund";

export const metadata = {
  title: "Refund Policy | Astra Roleplay",
  description:
    "Read Astra Roleplay's official Refund Policy regarding purchases and digital products.",
};

export default function RefundPage() {
  return (
    <LegalLayout
      badge="Legal"
      title="Refund Policy"
      description="This Refund Policy explains how purchases made through Astra Roleplay are handled. By completing a purchase, you acknowledge that all products and services are digital and subject to the terms outlined below."
      lastUpdated="1 July 2026"
      sections={refund}
    />
  );
}
