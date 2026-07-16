import {
  LayoutDashboard,
  FileText,
  Settings2,
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
    permission: "canViewApplications",
  },

  {
    title: "Manage Applications",
    href: "/staff/application-management",
    icon: Settings2,
    permission: "canManageApplications",
  },
];

export default navigation;
