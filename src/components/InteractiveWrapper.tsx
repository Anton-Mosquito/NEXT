// src/components/InteractiveWrapper.tsx
'use client'

import { useState } from 'react'
import { Card } from '@/shared/ui'

// ✅ ПАТЕРН 2 в дії:
// Client Component з клієнтським станом
// але children — це Server-rendered JSX (вже HTML на клієнті)
export function InteractiveWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [highlight, setHighlight] = useState(false)

  return (
    <div
      className={`rounded-xl border-2 p-4 transition-all ${
        highlight ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
      }`}
    >
      {/* Клієнтські контролери */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setIsExpanded((s) => !s)}
          className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200"
        >
          {isExpanded ? '▲ Згорнути' : '▼ Розгорнути'}
        </button>
        <button
          onClick={() => setHighlight((s) => !s)}
          className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-200"
        >
          🎨 Highlight
        </button>
      </div>

      {/* 
        children = Server Component output
        Це НЕ викликає re-render Server Component при зміні стану!
        Server content заморожений як HTML
      */}
      {isExpanded && (
        <div className="border-t pt-3">
          {children}
        </div>
      )}
    </div>
  )
}