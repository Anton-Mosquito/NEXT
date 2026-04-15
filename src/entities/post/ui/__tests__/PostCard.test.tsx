// src/entities/post/ui/__tests__/PostCard.test.tsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { PostCard } from "../PostCard";
import { LikeButton } from "@/features/like-post";
import type { PostWithMeta } from "@/entities/post";

const mockPost: PostWithMeta = {
  id: 42,
  userId: 3,
  title: "Amazing Test Post",
  body: "This is a test post body with some content for testing purposes",
  excerpt: "This is a test post body...",
  wordCount: 12,
  readingTimeMin: 1,
};

describe("PostCard", () => {
  it("рендерить заголовок поста", () => {
    renderWithProviders(<PostCard post={mockPost} />);
    expect(screen.getByText(/amazing test post/i)).toBeInTheDocument();
  });

  it("показує metadata", () => {
    renderWithProviders(<PostCard post={mockPost} />);
    expect(screen.getByText(/user #3/i)).toBeInTheDocument();
    expect(screen.getByText(/1 хв/i)).toBeInTheDocument();
  });

  it("приймає та рендерить actions slot", () => {
    renderWithProviders(
      <PostCard
        post={mockPost}
        actions={<button data-testid="custom-action">Custom</button>}
      />,
    );
    expect(screen.getByTestId("custom-action")).toBeInTheDocument();
  });

  it("викликає onClick при кліку", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderWithProviders(<PostCard post={mockPost} onClick={handleClick} />);

    await user.click(screen.getByText(/amazing test post/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("compact режим приховує excerpt", () => {
    renderWithProviders(<PostCard post={mockPost} compact />);
    expect(
      screen.queryByText(/this is a test post body/i),
    ).not.toBeInTheDocument();
  });

  it("isSelected додає виділення", () => {
    const { container } = renderWithProviders(
      <PostCard post={mockPost} isSelected />,
    );
    // Перевіряємо що є ring клас або border-blue
    const card = container.firstChild;
    expect(card).toHaveClass("border-blue-400");
  });
});

describe("PostCard + LikeButton інтеграція", () => {
  it("LikeButton в actions slot оновлює Redux store", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <PostCard
        post={mockPost}
        actions={<LikeButton postId={mockPost.id} />}
      />,
    );

    // Початкові likes для поста #42 (fallback якщо немає в store)
    const initialState = store.getState();
    const initialLikes = initialState.likes.likes[mockPost.id] ?? {
      count: 0,
      isLiked: false,
    };

    // Клікаємо лайк
    const likeButton = screen.getByRole("button");
    await user.click(likeButton);

    // Перевіряємо що store оновився
    const newState = store.getState();
    const newLikes = newState.likes.likes[mockPost.id];

    expect(newLikes).toBeDefined();
    expect(newLikes.isLiked).toBe(!initialLikes.isLiked);
    expect(newLikes.count).toBe(
      initialLikes.count + (initialLikes.isLiked ? -1 : 1),
    );
  });
});
