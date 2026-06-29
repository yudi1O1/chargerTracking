import {
  BarChart3,
  Bell,
  Gauge,
  MapPinned,
  Settings,
  Shield,
  UserCircle,
  Users,
  Zap,
} from "lucide-react";

export const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/stations", label: "Stations", icon: MapPinned },
  { href: "/sessions", label: "Sessions", icon: Zap },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/users", label: "Users", icon: Users, adminOnly: true },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/security", label: "Access", icon: Shield, hidden: true },
];

