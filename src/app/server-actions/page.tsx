// src/app/server-actions/page.tsx
import { Suspense } from 'react'
import { Card } from '@/shared/ui'
import { CreatePostServerAction } from '@/features/create-post/ui/CreatePostServerAction'
import { PostFeed } from '@/widgets/post-feed'

export const metadata = {
  title: 'Server Actions + Redux',
}

export default function ServerActionsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">🚀 Server Actions + Redux</h1>
        <p className="text-gray-500 text-sm mt-1">
          Server Actions виконуються на сервері, результат інвалідує RTK Query кеш
        </p>
      </div>

      {/* Архітектурна схема */}
      <Card>
        <h2 className="font-bold mb-3">🏗️ Архітектура</h2>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          {[
            { label: "Client Form", color: "bg-blue-100 text-blue-700" },
            { label: "→", color: "" },
            { label: "Server Action", color: "bg-green-100 text-green-700" },
            { label: "→", color: "" },
            { label: "DB / API", color: "bg-purple-100 text-purple-700" },
            { label: "→", color: "" },
            { label: "revalidatePath()", color: "bg-yellow-100 text-yellow-700" },
            { label: "+", color: "" },
            { label: "invalidateTags()", color: "bg-red-100 text-red-700" },
            { label: "→", color: "" },
            { label: "UI оновлено ✅", color: "bg-green-100 text-green-700" },
          ].map(({ label, color }, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded text-xs font-medium ${color}`}
            >
              {label}
            </span>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Форма з Server Action */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg">📝 Форма (Server Action)</h2>
          <CreatePostServerAction />
        </div>

        {/* Список постів (оновлюється після Server Action) */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg">
            📋 Список (RTK Query, автооновлення)
          </h2>
          <Suspense
            fallback={
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white rounded-xl border p-4 h-20"
                  />
                ))}
              </div>
            }
          >
            <PostFeed />
          </Suspense>
        </div>
      </div>

      {/* Server Actions vs RTK Query Mutations */}
      <Card>
        <h2 className="font-bold mb-3">⚖️ Server Actions vs RTK Query Mutations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 text-gray-600 w-1/3">Критерій</th>
                <th className="pb-2 text-gray-600 w-1/3">Server Action</th>
                <th className="pb-2 text-gray-600">RTK Query Mutation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ['Де виконується', '✅ Тільки сервер', '🔄 Клієнт → сервер'],
                ['Доступ до DB', '✅ Прямий', '❌ Тільки через API'],
                ['Безпека секретів', '✅ Не в bundle', '⚠️ URL видно'],
                ['File upload', '✅ FormData нативно', '⚠️ Складніше'],
                ['Optimistic update', '⚠️ Ручна', '✅ Вбудована'],
                ['Cache invalidation', '✅ revalidatePath', '✅ invalidateTags'],
                ['Loading state', 'useTransition', 'isLoading хук'],
                ['Коли використовувати', 'Auth, DB, files', 'CRUD через REST API'],
              ].map(([criterion, sa, rtk]) => (
                <tr key={criterion}>
                  <td className="py-2 font-medium text-gray-700">{criterion}</td>
                  <td className="py-2 text-green-700">{sa}</td>
                  <td className="py-2 text-blue-700">{rtk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}