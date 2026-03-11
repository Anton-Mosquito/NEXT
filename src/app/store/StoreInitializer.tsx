'use client'

import { useRef } from 'react'
import { useAppDispatch } from './hooks'
import type { AppDispatch } from './makeStore'

interface StoreInitializerProps {
  onInitialize: (dispatch: AppDispatch) => void
}

export function StoreInitializer({ onInitialize }: StoreInitializerProps) {
  const isInitialized = useRef(false)
  const dispatch = useAppDispatch()

  if (!isInitialized.current) {
    onInitialize(dispatch)
    isInitialized.current = true
  }

  return null
}