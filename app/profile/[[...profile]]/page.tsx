import { UserProfile } from '@clerk/nextjs'

export default function ProfilePage() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
    <UserProfile path="/profile" />
        </div>
)
}