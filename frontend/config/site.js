import {
  ShieldCheck,
  Building2,
  ScrollText,
} from "lucide-react";

const siteConfig = {
  name: "Astra Roleplay",
  subtitle: "Craft your legacy.",
  description:
    "Astra Roleplay is a serious, community-driven FiveM roleplay server focused on immersive storytelling, meaningful player interactions, and a balanced economy. Whether you're building a business, serving the city, or creating your own criminal empire, every decision helps shape the world around you.",
  logo: "/logo.png",
  discordUrl: "https://discord.gg/ss3sPyZZrU",
  applyUrl: "/apply",
  stats: {
    playersOnline: "—",
    discordMembers: "—",
  },
  pillars: [
    {
      icon: Building2,
      title: "Balanced Economy",
      copy: "Businesses, jobs, and a city economy tuned so wealth is earned, not handed out.",
    },
    {
      icon: ShieldCheck,
      title: "Active Departments",
      copy: "Police, EMS, and civilian factions staffed and active around the clock.",
    },
    {
      icon: ScrollText,
      title: "Player-Driven Stories",
      copy: "No scripts. The plot of this city is written by the people living in it.",
    },
  ],
};

export default siteConfig;
