import { ClerkProvider, Show, SignInButton, UserButton } from '@clerk/nextjs'
import './globals.css'
import {GlobalProvider} from "@/app/utils/providers/GlobalContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <ClerkProvider>
          <GlobalProvider>
        <html lang="en">
        <body>
        <header style={{ display: 'flex', justifyContent: 'flex-end', padding: 16, gap: 12 }}>
          <Show when="signed-out">
            <SignInButton />
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </header>
        {children}
        </body>
        </html>
          </GlobalProvider>
      </ClerkProvider>
  )
}