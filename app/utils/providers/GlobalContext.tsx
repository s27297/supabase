'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import {useAuth, useUser} from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
// import type { UserResource } from '@clerk/types'

type GlobalContextType = {
    isLoaded: boolean
    isSignedIn: boolean | undefined
    // user: UserResource | null | undefined
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalProvider({ children }: { children: ReactNode }) {
    const { isLoaded, isSignedIn } = useAuth()

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