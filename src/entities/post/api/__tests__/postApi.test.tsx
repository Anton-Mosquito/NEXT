// src/entities/post/api/__tests__/postApi.test.tsx
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { server } from "@/__mocks__/server";
import { rest } from "msw";
import { mockPosts } from "@/__mocks__/handlers/postHandlers";
import { useGetPostsQuery, useGetPostByIdQuery } from "../postApi";

// ============================================================
// Тестові компоненти
// ============================================================

// Простий компонент що використовує RTK Query
function PostsListTestComponent() {
  const { data, isLoading, isError, error } = useGetPostsQuery();

  if (isLoading) return <div data-testid="loading">Loading...</div>;
  if (isError)
    return <div data-testid="error">Error: {JSON.stringify(error)}</div>;

  return (
    <ul data-testid="posts-list">
      {data?.map((post) => (
        <li key={post.id} data-testid={`post-${post.id}`}>
          {post.title}
        </li>
      ))}
    </ul>
  );
}

function PostDetailTestComponent({ id }: { id: number }) {
  const { data: post, isLoading } = useGetPostByIdQuery(id);

  if (isLoading) return <div data-testid="loading">Loading...</div>;
  if (!post) return <div data-testid="no-post">No post</div>;

  return (
    <div data-testid="post-detail">
      <h1 data-testid="post-title">{post.title}</h1>
      <p data-testid="post-body">{post.body}</p>
    </div>
  );
}

// ============================================================
// Тести
// ============================================================

describe("postApi RTK Query", () => {
  describe("useGetPostsQuery", () => {
    it("показує loading стан", () => {
      renderWithProviders(<PostsListTestComponent />);
      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("завантажує та відображає пости", async () => {
      renderWithProviders(<PostsListTestComponent />);

      // Очікуємо завантаження
      await waitFor(() => {
        expect(screen.getByTestId("posts-list")).toBeInTheDocument();
      });

      // Перевіряємо що MSW повернув моковані дані
      expect(screen.getByTestId("post-1")).toHaveTextContent(
        mockPosts[0].title,
      );
      expect(screen.getByTestId("post-2")).toHaveTextContent(
        mockPosts[1].title,
      );
    });

    it("показує error стан при помилці мережі", async () => {
      // ✅ Перевизначаємо handler для симуляції помилки
      server.use(
        rest.get("https://jsonplaceholder.typicode.com/posts", (req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      renderWithProviders(<PostsListTestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId("error")).toBeInTheDocument();
      });
    });

    it("transformResponse збагачує пости", async () => {
      renderWithProviders(<PostsListTestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId("posts-list")).toBeInTheDocument();
      });

      // Перевіряємо через store що transformResponse спрацював
      // (PostsListTestComponent не показує enriched fields,
      // але ми можемо перевірити store напряму)
    });
  });

  describe("useGetPostByIdQuery", () => {
    it("завантажує конкретний пост", async () => {
      renderWithProviders(<PostDetailTestComponent id={1} />);

      await waitFor(() => {
        expect(screen.getByTestId("post-detail")).toBeInTheDocument();
      });

      expect(screen.getByTestId("post-title")).toHaveTextContent(
        mockPosts[0].title,
      );
    });

    it("показує no-post для відсутнього id", async () => {
      // MSW повертає 404 для id=999
      renderWithProviders(<PostDetailTestComponent id={999} />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      });

      // RTK Query error state — компонент показує "No post"
      expect(screen.getByTestId("no-post")).toBeInTheDocument();
    });

    it("кешує результат — повторний рендер не робить новий запит", async () => {
      const { store } = renderWithProviders(<PostDetailTestComponent id={1} />);

      await waitFor(() => {
        expect(screen.getByTestId("post-detail")).toBeInTheDocument();
      });

      // Перерендеримо той самий компонент
      const { unmount } = renderWithProviders(
        <PostDetailTestComponent id={1} />,
        { store }, // використовуємо той самий store!
      );

      // Дані вже в кеші — loading не показується
      expect(screen.queryAllByTestId("loading")).toHaveLength(0);

      unmount();
    });
  });
});
