'use client'

import { SignUp } from '@clerk/nextjs'
import {useGlobalContext} from "@/app/utils/providers/GlobalContext";
import {useEffect, useLayoutEffect} from "react";
import {useRouter} from "next/navigation";

export default function Page() {
    const {isLoaded, isSignedIn} = useGlobalContext()
    const router = useRouter()
    useLayoutEffect(() => {
        console.log(isSignedIn,isLoaded)
        if (isLoaded && isSignedIn) {
            router.replace('/todo-list')
        }
    }, [isLoaded, isSignedIn, router])

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
            <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
        </div>
    )
}