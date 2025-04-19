import { PredictionStatus } from "@shared/schema";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: PredictionStatus;
  className?: string;
  size?: "sm" | "md";
}

const statusConfig = {
  upcoming: {
    background: "bg-status-upcoming/20",
    text: "text-[#2EFFAF]"
  },
  won: {
    background: "bg-status-won/20",
    text: "text-[#00C897]"
  },
  lost: {
    background: "bg-status-lost/20",
    text: "text-[#FF6B6B]"
  },
  void: {
    background: "bg-status-void/20",
    text: "text-[#4A4A4A]"
  }
};

export default function StatusBadge({ status, className, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-md font-medium",
        config.background,
        config.text,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-0.5 text-xs",
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
