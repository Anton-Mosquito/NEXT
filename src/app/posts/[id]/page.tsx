// src/app/posts/[id]/page.tsx
// ✅ ПАТЕРН 1: Server fetches → passes as props to Client
import { notFound } from "next/navigation";
import { PostDetail } from "@/widgets/post-detail";
import type { Metadata } from "next";

// Серверний fetch (симуляція)
async function getPost(id: number) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    // Next.js кешування — важлива деталь!
    next: { revalidate: 60 }, // кеш 60 секунд
  });
  if (!res.ok) return null;
  return res.json();
}

async function getPostComments(postId: number) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`,
    { next: { revalidate: 30 } },
  );
  return res.json();
}

// ✅ Dynamic metadata — SEO для кожного поста
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(Number(id));
  if (!post) return { title: "Пост не знайдено" };
  return {
    title: `${post.title} | FSD App`,
    description: post.body.slice(0, 160),
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);

  // ✅ Паралельний fetch на сервері (швидше!)
  const [post, comments] = await Promise.all([
    getPost(postId),
    getPostComments(postId),
  ]);

  if (!post) notFound();

  return (
    // PostDetail — Client Component
    // Отримує дані через props (Патерн 1)
    <PostDetail initialPost={post} initialComments={comments} postId={postId} />
  );
}
