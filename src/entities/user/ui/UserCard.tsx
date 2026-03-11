// src/entities/user/ui/UserCard.tsx
import { Card, Badge, Avatar } from "@/shared/ui";
import type { User } from "../model/types";

interface UserCardProps {
  user: User;
  isSelected?: boolean;
  onClick?: () => void;
  actions?: React.ReactNode;
  compact?: boolean;
}

export function UserCard({
  user,
  isSelected,
  onClick,
  actions,
  compact,
}: UserCardProps) {
  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className={isSelected ? "border-purple-400 ring-1 ring-purple-300" : ""}
    >
      <div className="flex items-center gap-3">
        <Avatar name={user.name} size={compact ? "sm" : "md"} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 truncate">{user.name}</p>
          <p className="text-xs text-gray-400">@{user.username}</p>
          {!compact && (
            <div className="flex gap-2 mt-1.5 flex-wrap">
              <Badge variant="default">🏢 {user.company.name}</Badge>
              <Badge variant="primary">📍 {user.address.city}</Badge>
            </div>
          )}
        </div>
      </div>
      {!compact && (
        <div className="mt-3 grid grid-cols-2 gap-1 text-xs text-gray-500">
          <span>📧 {user.email}</span>
          <span>🌐 {user.website}</span>
        </div>
      )}
      {actions && (
        <div className="mt-3 pt-3 border-t border-gray-100">{actions}</div>
      )}
    </Card>
  );
}
