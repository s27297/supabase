'use client'

import { useAuth } from '@clerk/nextjs'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export function useClerkSupabaseClient() {
    const { getToken } = useAuth()

    const [client, setClient] = useState<SupabaseClient | null>(null)

    useEffect(() => {
        const initClient = () => {
            setClient(
                createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    {
                        accessToken: async () => {
                            return await getToken()
                        },
                    }
                )
            )
        }
        initClient()

    }, [getToken])

    return client
}