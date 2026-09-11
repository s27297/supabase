import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
    const { userId } = await auth()
    console.log(userId)

    if (!userId) {
        redirect('/sign-in')
    }
    console.log(userId)
    const client = await clerkClient()
    const currentUser = await client.users.getUser(userId)

    if (currentUser.publicMetadata.role !== 'admin') {
        redirect('/')
    }

    const { data: users, totalCount } = await client.users.getUserList()

    return (
        <div>
            <h1>All Users ({totalCount})</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.emailAddresses[0]?.emailAddress} — {user.firstName} {user.lastName}
                    </li>
                ))}
            </ul>
        </div>
    )
}