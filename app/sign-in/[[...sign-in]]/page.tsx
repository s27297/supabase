import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignIn } from '@clerk/nextjs'

export default async function SignInPage() {
    const { isAuthenticated } = await auth()

    if (isAuthenticated) {
        redirect('/todo-list')
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
            <SignIn
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                forceRedirectUrl="/todo-list"
            />
        </div>
    )
}