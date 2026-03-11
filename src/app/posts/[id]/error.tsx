// src/app/posts/[id]/error.tsx
"use client";

export default function PostDetailError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-12">
      <p className="text-4xl mb-3">⚠️</p>
      <h2 className="text-xl font-bold text-gray-700 mb-2">
        Щось пішло не так
      </h2>
      <p className="text-gray-500 text-sm mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
      >
        Спробувати знову
      </button>
    </div>
  );
}
