// src/features/create-post/api/__tests__/createPostApi.test.tsx
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { server } from "@/__mocks__/server";
import { rest } from "msw";
import { useCreatePostMutation } from "../createPostApi";

// Тестовий компонент для мутації
function CreatePostTestComponent() {
  const [createPost, { isLoading, isSuccess, isError, data }] =
    useCreatePostMutation();

  const handleCreate = () => {
    createPost({ title: "New Post", body: "New body content", userId: 1 });
  };

  return (
    <div>
      <button
        onClick={handleCreate}
        disabled={isLoading}
        data-testid="create-button"
      >
        {isLoading ? "Creating..." : "Create Post"}
      </button>
      {isSuccess && (
        <div data-testid="success">
          Created: {data?.title} (ID: {data?.id})
        </div>
      )}
      {isError && <div data-testid="error">Error!</div>}
    </div>
  );
}

describe("useCreatePostMutation", () => {
  it("успішно створює пост", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreatePostTestComponent />);

    await user.click(screen.getByTestId("create-button"));

    await waitFor(() => {
      expect(screen.getByTestId("success")).toBeInTheDocument();
    });

    expect(screen.getByTestId("success")).toHaveTextContent("New Post");
    expect(screen.getByTestId("success")).toHaveTextContent("ID: 101");
  });

  it("показує loading під час запиту", async () => {
    // Затримуємо відповідь MSW
    server.use(
      rest.post("https://jsonplaceholder.typicode.com/posts", async (req, res, ctx) => {
        await new Promise((r) => setTimeout(r, 100));
        return res(ctx.json({
          id: 101,
          title: "New Post",
          body: "",
          userId: 1,
        }), ctx.status(201));
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<CreatePostTestComponent />);

    await user.click(screen.getByTestId("create-button"));

    // Одразу після кліку — loading
    expect(screen.getByTestId("create-button")).toHaveTextContent(
      "Creating...",
    );
    expect(screen.getByTestId("create-button")).toBeDisabled();

    // Після відповіді — success
    await waitFor(() => {
      expect(screen.getByTestId("success")).toBeInTheDocument();
    });
  });

  it("показує error при помилці сервера", async () => {
    server.use(
      rest.post("https://jsonplaceholder.typicode.com/posts", (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<CreatePostTestComponent />);

    await user.click(screen.getByTestId("create-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });
  });
});
