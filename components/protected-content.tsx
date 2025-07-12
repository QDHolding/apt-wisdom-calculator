"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ContentProtection } from "@/services/content-protection-service"

interface ProtectedContentProps {
  children: React.ReactNode
  isProtected?: boolean
  watermarkText?: string
}

export function ProtectedContent({
  children,
  isProtected = true,
  watermarkText = "PREVIEW ONLY",
}: ProtectedContentProps) {
  const [isClient, setIsClient] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    setIsClient(true)

    if (isProtected) {
      cleanupRef.current = ContentProtection.applyAllProtections(watermarkText)
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
  }, [isProtected, watermarkText])

  if (!isClient) {
    return null
  }

  return (
    <div className="protected-content relative">
      {isProtected && (
        <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 px-3 py-1 text-xs font-medium rounded-bl-md z-10">
          Protected Content
        </div>
      )}
      {children}
    </div>
  )
}

