import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const toneClass = {
  neutral: "bg-muted text-muted-foreground",
  green: "bg-emerald-500/15 text-emerald-500",
  orange: "bg-orange-500/15 text-orange-500",
  red: "bg-red-500/15 text-red-500",
  blue: "bg-blue-500/15 text-blue-500",
};

export function Badge({ className, tone = "neutral", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof toneClass }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", toneClass[tone], className)} {...props} />;
}

