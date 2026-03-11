// // src/widgets/post-detail/ui/PostDetail.tsx
// "use client";

// // ✅ ПАТЕРН 1 в дії:
// // Отримуємо initialPost та initialComments як props від Server Component
// // Додаємо клієнтську інтерактивність (лайк, коментарі)

// import { useState } from "react";
// import Link from "next/link";
// import { Card, Badge, Avatar, Button } from "@/shared/ui";
// import { LikeButton } from "@/features/like-post";
// import { getReadingTime, formatDate } from "@/shared/lib";
// import type { Post } from "@/entities/post";

// interface Comment {
//   id: number;
//   postId: number;
//   name: string;
//   email: string;
//   body: string;
// }

// interface PostDetailProps {
//   initialPost: Post; // ← від Server Component
//   initialComments: Comment[]; // ← від Server Component
//   postId: number;
// }

// export function PostDetail({
//   initialPost,
//   initialComments,
//   postId,
// }: PostDetailProps) {
//   // ✅ Клієнтський стан поверх серверних даних
//   const [showAllComments, setShowAllComments] = useState(false);
//   const [newComment, setNewComment] = useState("");

//   const readingTime = getReadingTime(initialPost.body);
//   const visibleComments = showAllComments
//     ? initialComments
//     : initialComments.slice(0, 3);

//   return (
//     <div className="space-y-5 max-w-2xl mx-auto">
//       {/* Навігація */}
//       <Link
//         href="/posts"
//         className="text-sm text-blue-500 hover:underline flex items-center gap-1"
//       >
//         ← Назад до постів
//       </Link>

//       {/* Пост */}
//       <Card padding="lg">
//         <div className="flex items-center gap-2 mb-4">
//           <Badge variant="default">Post #{initialPost.id}</Badge>
//           <Badge variant="primary">User #{initialPost.userId}</Badge>
//           <span className="text-xs text-gray-400 ml-auto">
//             📖 {readingTime} хв читання
//           </span>
//         </div>

//         <h1 className="text-2xl font-bold text-gray-800 capitalize mb-4 leading-tight">
//           {initialPost.title}
//         </h1>

//         <p className="text-gray-600 leading-relaxed">{initialPost.body}</p>

//         {/* Клієнтська інтерактивність */}
//         <div className="mt-5 pt-4 border-t flex items-center gap-3">
//           {/* ✅ LikeButton — Client Component, вставлений у Client Widget */}
//           <LikeButton postId={postId} size="md" />
//           <Button variant="ghost" size="sm">
//             💬 {initialComments.length} коментарів
//           </Button>
//           <Button variant="ghost" size="sm">
//             🔗 Поділитись
//           </Button>
//         </div>
//       </Card>

//       {/* Коментарі (від сервера, але з клієнтською взаємодією) */}
//       <div>
//         <h2 className="font-bold text-lg mb-3">
//           💬 Коментарі ({initialComments.length})
//         </h2>

//         <div className="space-y-3">
//           {visibleComments.map((comment) => (
//             <Card key={comment.id} padding="sm">
//               <div className="flex items-center gap-2 mb-2">
//                 <Avatar name={comment.name} size="sm" />
//                 <div>
//                   <p className="text-sm font-medium">{comment.name}</p>
//                   <p className="text-xs text-gray-400">{comment.email}</p>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600">{comment.body}</p>
//             </Card>
//           ))}
//         </div>

//         {initialComments.length > 3 && (
//           <Button
//             variant="secondary"
//             size="sm"
//             className="mt-3 w-full"
//             onClick={() => setShowAllComments((s) => !s)}
//           >
//             {showAllComments
//               ? "↑ Згорнути"
//               : `↓ Показати всі ${initialComments.length} коментарів`}
//           </Button>
//         )}
//       </div>

//       {/* Форма додавання коментаря (симуляція) */}
//       <Card>
//         <h3 className="font-bold mb-3">✍️ Додати коментар</h3>
//         <textarea
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Напиши коментар..."
//           rows={3}
//           className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400 mb-3"
//         />
//         <Button
//           disabled={!newComment.trim()}
//           onClick={() => {
//             alert("Коментар додано (симуляція)!");
//             setNewComment("");
//           }}
//         >
//           Опублікувати
//         </Button>
//       </Card>
//     </div>
//   );
// }

// src/widgets/post-detail/ui/PostDetail.tsx — ОНОВЛЕНИЙ
"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Card, Badge, Avatar, Button } from "@/shared/ui";
import { StoreInitializer } from "@/app/store/StoreInitializer";
import { LikeButton } from "@/features/like-post";
import { getReadingTime } from "@/shared/lib";
import { initializePost } from "@/entities/post/model/currentPostSlice";
import { useAppSelector } from "@/app/store";
import {
  selectCurrentPost,
  selectCurrentPostHydrated,
} from "@/entities/post/model/currentPostSlice";
import type { PostWithMeta } from "@/entities/post";

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

interface PostDetailProps {
  initialPost: PostWithMeta;
  initialComments: Comment[];
  postId: number;
}

export function PostDetail({
  initialPost,
  initialComments,
  postId,
}: PostDetailProps) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  // ✅ Читаємо з Redux store (буде ініціалізований через StoreInitializer)
  const currentPost = useAppSelector(selectCurrentPost);
  const isHydrated = useAppSelector(selectCurrentPostHydrated);

  // Використовуємо store дані якщо є, інакше — props
  const post = currentPost ?? initialPost;

  const readingTime = getReadingTime(post.body);
  const visibleComments = showAllComments
    ? initialComments
    : initialComments.slice(0, 3);

  // Мемоізована функція ініціалізації
  const handleInitialize = useCallback(
    (
      dispatch: Parameters<typeof StoreInitializer>[0]["onInitialize"] extends (
        d: infer D,
      ) => void
        ? D
        : never,
    ) => {
      // ✅ Синхронний dispatch під час render
      dispatch(initializePost(initialPost));
    },
    [initialPost],
  );

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/*
        ✅ StoreInitializer виконує dispatch ДО рендеру решти
        Коли PostDetailContent рендериться — store вже має пост
      */}
      <StoreInitializer onInitialize={handleInitialize} />

      {/* Hydration статус badge */}
      <div className="flex items-center gap-2">
        <Badge variant={isHydrated ? "success" : "warning"}>
          {isHydrated
            ? "✅ Store hydrated з серверних даних"
            : "⏳ Очікування hydration..."}
        </Badge>
      </div>

      {/* Навігація */}
      <Link
        href="/posts"
        className="text-sm text-blue-500 hover:underline flex items-center gap-1"
      >
        ← Назад до постів
      </Link>

      {/* Пост */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="default">Post #{post.id}</Badge>
          <Badge variant="primary">User #{post.userId}</Badge>
          <span className="text-xs text-gray-400 ml-auto">
            📖 {readingTime} хв читання
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 capitalize mb-4 leading-tight">
          {post.title}
        </h1>
        <p className="text-gray-600 leading-relaxed">{post.body}</p>

        <div className="mt-5 pt-4 border-t flex items-center gap-3">
          <LikeButton postId={postId} size="md" />
          <Button variant="ghost" size="sm">
            💬 {initialComments.length} коментарів
          </Button>
        </div>
      </Card>

      {/* Коментарі */}
      <div>
        <h2 className="font-bold text-lg mb-3">
          💬 Коментарі ({initialComments.length})
        </h2>
        <div className="space-y-3">
          {visibleComments.map((comment) => (
            <Card key={comment.id} padding="sm">
              <div className="flex items-center gap-2 mb-2">
                <Avatar name={comment.name} size="sm" />
                <div>
                  <p className="text-sm font-medium">{comment.name}</p>
                  <p className="text-xs text-gray-400">{comment.email}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{comment.body}</p>
            </Card>
          ))}
        </div>
        {initialComments.length > 3 && (
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 w-full"
            onClick={() => setShowAllComments((s) => !s)}
          >
            {showAllComments
              ? "↑ Згорнути"
              : `↓ Показати всі ${initialComments.length}`}
          </Button>
        )}
      </div>

      {/* Форма коментаря */}
      <Card>
        <h3 className="font-bold mb-3">✍️ Додати коментар</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Напиши коментар..."
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400 mb-3"
        />
        <Button
          disabled={!newComment.trim()}
          onClick={() => {
            alert("Коментар додано (симуляція)!");
            setNewComment("");
          }}
        >
          Опублікувати
        </Button>
      </Card>
    </div>
  );
}
