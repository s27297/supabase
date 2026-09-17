'use client'

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import {useAuth, useUser} from '@clerk/nextjs'
import posthog from 'posthog-js'

type GlobalContextType = {
    isLoaded: boolean
    isSignedIn: boolean | undefined
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalProvider({ children }: { children: ReactNode }) {
    const { isLoaded, isSignedIn } = useAuth()
    const { isLoaded: isUserLoaded, user } = useUser()
    const identifiedUserId = useRef<string | null>(null)

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !process.env.NEXT_PUBLIC_POSTHOG_HOST) {
            return
        }

        if (!isLoaded || !isUserLoaded || isSignedIn === undefined) {
            return
        }

        if (isSignedIn && user?.id) {
            if (identifiedUserId.current && identifiedUserId.current !== user.id) {
                posthog.reset()
            }

            posthog.identify(user.id, {
                ...(user.primaryEmailAddress?.emailAddress && { email: user.primaryEmailAddress.emailAddress }),
                ...(user.fullName && { name: user.fullName }),
            })
            identifiedUserId.current = user.id
            return
        }

        if (identifiedUserId.current) {
            posthog.reset()
            identifiedUserId.current = null
        }
    }, [isLoaded, isSignedIn, isUserLoaded, user?.id])

    return (
        <GlobalContext.Provider value={{ isLoaded, isSignedIn }}>
            {children}
        </GlobalContext.Provider>
    )
}

export function useGlobalContext() {
    const context = useContext(GlobalContext)
    if (context === undefined) {
        throw new Error('useGlobalContext must be used within a GlobalProvider')
    }
    return context
}