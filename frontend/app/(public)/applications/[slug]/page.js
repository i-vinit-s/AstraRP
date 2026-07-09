import ApplicationPageClient from "@/components/applications/form/ApplicationPageClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const formattedTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} | Astra Roleplay`,
    description: `Apply for ${formattedTitle} on Astra Roleplay.`,
  };
}

export default async function ApplicationPage({ params }) {
  const { slug } = await params;

  return <ApplicationPageClient slug={slug} />;
}
