import { ClerkProvider, Show, SignInButton, UserButton } from '@clerk/nextjs'
import './globals.css'
import Navbar from '@/app/components/Navbar'
import { GlobalProvider } from '@/app/utils/providers/GlobalContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
                <html lang="en">
                <body>
                <ClerkProvider>
                <GlobalProvider>
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
                </GlobalProvider>
                </ClerkProvider>
                </body>
                </html>
    )
}