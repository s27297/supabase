'use client'

import { useEffect } from 'react'
import {useUser} from "@clerk/nextjs";

declare global {
  interface Window {
    ProductBridge?: {
      init: (config: Record<string, unknown>) => void
      identify: (token: string) => void
      destroy: () => void
    }
  }
}

export default function ProductBridgeWidget() {
  const { isLoaded, isSignedIn, user } = useUser()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.productbridge.io/sdk/pb-widget.js'
    script.async = true
    script.onload = () => {
      window.ProductBridge?.init({
        organizationId: process.env.NEXT_PUBLIC_PRODUCTBRIDGE_ORG_ID,
        mode: 'popup',
        position: 'bottom-right',
        theme: 'auto',
        defaultTab: 'feedback',
        buttonColor: '#6366f1',
        buttonText: 'Feedback',
      })
    }
    document.head.appendChild(script)

    return () => {
      window.ProductBridge?.destroy()
    }
  }, [])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return

    let cancelled = false

    async function fetchTokenWithRetry(attempt = 1): Promise<void> {
      try {
        const res = await fetch('/api/productbridge-token', {
          headers: { Accept: 'application/json' },
        })

        if (res.status === 401 && attempt < 3) {
          await new Promise((r) => setTimeout(r, 400 * attempt))
          if (!cancelled) return fetchTokenWithRetry(attempt + 1)
        }

        const contentType = res.headers.get('content-type') ?? ''
        if (!res.ok || !contentType.includes('application/json')) {
          const text = await res.text()
          throw new Error(`Unexpected response (${res.status}): ${text.slice(0, 200)}`)
        }

        const { token } = await res.json()
        if (!cancelled) {
          window.ProductBridge?.identify(token)
        }
      } catch (err) {
        console.error('ProductBridge identify failed:', err)
      }
    }

    fetchTokenWithRetry()
    return () => {
      cancelled = true
    }
  }, [isLoaded, isSignedIn, user])

  return null
}