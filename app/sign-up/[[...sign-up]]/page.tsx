import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignUp } from '@clerk/nextjs'

export default async function SignInPage() {
    const { isAuthenticated } = await auth()

    if (isAuthenticated) {
        redirect('/todo-list')
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
            <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
        </div>
    )
}