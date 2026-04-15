import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuLogoutProps {
  onClick?: () => void;
  className?: string;
}

export function MenuLogout({ onClick, className }: MenuLogoutProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-4 py-3",
        "transition-colors opacity-75 hover:bg-white/5 hover:opacity-100",
        "focus:outline-none ",
        className
      )}
    >
      <LogOut size={24} className="shrink-0 text-white" />
      <span
        className="w-39 text-base font-semibold leading-6 text-white text-left"
      >
        Logout
      </span>
    </button>
  );
}
