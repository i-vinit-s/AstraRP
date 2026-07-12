import {
  LayoutDashboard,
  FileText,
  Settings2,
  Megaphone,
  Users,
  Shield,
  ScrollText,
  Bell,
} from "lucide-react";

const navigation = [
  {
    title: "Dashboard",
    href: "/staff",
    icon: LayoutDashboard,
  },

  {
    title: "Applications",
    href: "/staff/applications",
    icon: FileText,
  },

  {
    title: "Manage Applications",
    href: "/staff/application-management",
    icon: Settings2,
  },
];

export default navigation;
