'use client'
import { SignIn } from '@clerk/nextjs'
import {useEffect, useLayoutEffect} from "react";
import {useGlobalContext} from "@/app/utils/providers/GlobalContext";
import { useRouter } from 'next/navigation'

export default function Page() {
    const {isLoaded, isSignedIn} = useGlobalContext()
    const router = useRouter()
    useLayoutEffect(() => {
        console.log(isSignedIn,isLoaded)
        if (isLoaded && isSignedIn) {
            router.replace('/todo-list')
        }
    }, [isLoaded, isSignedIn, router])
    if (!isLoaded) return <p>Loading...</p>
    if (isSignedIn) return <p>Redirecting...</p>

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>
    )
}