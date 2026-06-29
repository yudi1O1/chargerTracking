"use client";

import { Bell, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { logout } from "@/store/authSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  function handleLogout() {
    window.localStorage.removeItem("evision.accessToken");
    window.localStorage.removeItem("evision.refreshToken");
    dispatch(logout());
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur md:px-6">
      <button className="rounded-md border p-2 lg:hidden" aria-label="Open navigation">
        <Menu size={18} />
      </button>
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="absolute left-3 top-2.5 text-muted-foreground" size={17} />
        <input className="h-10 w-full rounded-md border bg-card pl-10 pr-3 text-sm outline-none focus:border-primary" placeholder="Search stations, sessions, cities..." />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button className="rounded-md border p-2" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <button className="rounded-md border p-2" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold">{user?.name ?? "EVision User"}</p>
          <p className="text-xs capitalize text-muted-foreground">{user?.role ?? "operator"}</p>
        </div>
        <button className="rounded-md border p-2 text-muted-foreground hover:text-foreground" aria-label="Logout" onClick={handleLogout}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

