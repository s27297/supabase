import { ClerkProvider, Show, SignInButton, UserButton } from '@clerk/nextjs'
import './globals.css'
import Navbar from '@/app/components/Navbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
                <html lang="en">
                <body>
                <ClerkProvider>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
                    <Navbar />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
                        <Show when="signed-out">
                            <SignInButton />
                        </Show>
                        <Show when="signed-in">
                            <UserButton />
                        </Show>
                    </div>
                </header>
                {children}
                </ClerkProvider>
                </body>
                </html>
    )
}