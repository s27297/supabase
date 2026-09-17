import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/monitoring(.*)'])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()
    console.log('[proxy]', req.nextUrl.pathname, 'userId:', userId)

    if (isPublicRoute(req)) {
        return
    }

    // API routes should get a clean 401, never an HTML redirect
    if (req.nextUrl.pathname.startsWith('/api')) {
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return
    }

    await auth.protect()
})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}