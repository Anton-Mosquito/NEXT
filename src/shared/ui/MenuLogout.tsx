import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

interface MenuLogoutProps {
  onClick?: () => void;
  className?: string;
}

export function MenuLogout({ onClick, className }: MenuLogoutProps) {
  return (
    <button
      type="button"
      onClick={async () => {
        if (onClick) {
          onClick();
          return;
        }
        await signOut();
        redirect("/settings");
      }}
      className={cn(
        "flex h-[48px] w-[224px] items-center gap-3 rounded-[4px] bg-white/8 px-4 py-3",
        "transition-colors opacity-75 hover:bg-white/10 hover:opacity-100",
        "focus:outline-none",
        className,
      )}
    >
      <LogOut size={24} className="shrink-0 text-white" strokeWidth={2} />
      <span className="text-left text-[16px] font-semibold leading-[24px] text-white">
        Logout
      </span>
    </button>
  );
}
