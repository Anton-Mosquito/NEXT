// src/app/profile/page.tsx
"use client";

import { useAppSelector } from "@/app/store";
import { selectCurrentUser, selectIsAuthenticated } from "@/entities/auth";
import { Card, Avatar, Badge, Button, SkeletonList } from "@/shared/ui";
import { useGetPostsByUserQuery } from "@/entities/post";
import { PostCard } from "@/entities/post";
import { LikeButton } from "@/features/like-post";

export default function ProfilePage() {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const { data: userPosts, isLoading } = useGetPostsByUserQuery(
    parseInt(user?.id ?? "1", 10),
    {
      skip: !user,
    },
  );

  if (!isAuthenticated || !user) {
    return (
      <Card className="text-center py-12">
        <p className="text-4xl mb-3">🔒</p>
        <p className="font-semibold text-gray-700">Необхідна авторизація</p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Профіль */}
      <Card>
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="lg" />
          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <Badge variant="primary" className="mt-1">
              {user.role}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Пости юзера */}
      <div>
        <h2 className="font-bold text-lg mb-3">
          Мої пости
          {userPosts && (
            <Badge variant="default" className="ml-2">
              {userPosts.length}
            </Badge>
          )}
        </h2>

        {isLoading ? (
          <SkeletonList count={3} />
        ) : (
          <div className="space-y-3">
            {userPosts?.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                compact
                actions={<LikeButton postId={post.id} />}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
