import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import jwt from 'jsonwebtoken'

export async function GET() {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()

    const token = jwt.sign(
        {
            userId: user!.id,
            email: user!.emailAddresses[0]?.emailAddress,
            name: `${user!.firstName ?? ''} ${user!.lastName ?? ''}`.trim(),
        },
        process.env.PRODUCTBRIDGE_WIDGET_SECRET!,
        { expiresIn: '1h' }
    )
    return NextResponse.json({ token })
}