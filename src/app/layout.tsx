/**
 * @file src/app/layout.tsx
 * 
 * @fileoverview global application layout
 */

// Typical imports
import { Providers } from "./providers"
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { userIsAdmin } from "@/functions/server/queries"
import { cookies } from 'next/headers'

// Default imports
import SessionProvider from '@/components/Shared/SessionProvider'
import './globals.css'
import Script from "next/script"

// Layout
export default async function RootLayout({ children }: { children: React.ReactNode }) {

  // Get session
  const session = await getServerSession()

  // Check for an authenticated enironment
  if (process.env.AUTH === 'true') {

    // If there is no session in an authenticated environment, redirect to the signin page
    if (!session || !session.user) redirect('/api/auth/signin')

    // Else, check if the user email is in the authenticated list; return NOT AUTHORIZED if it is not.
    else {
      const email = session.user.email as string
      const isAdmin = userIsAdmin(email)
      if (!isAdmin) return <h1>NOT AUTHORIZED</h1>
    }
  }

  // Dark theme is stored in a cookie
  const theme = (await cookies()).get("theme")

  // JSX
  return <html id='layoutHTML' className={`${theme?.value} max-w-[100vw] bg-[#F5F3E7] dark:bg-[#181818] overflow-x-hidden`} lang="en">
    <body className="overflow-hidden min-h-[100vh] dark:bg-[#181818] text-[#004C46] dark:text-[#F5F3E7] min-w-[200px]">
      <Script defer data-domain="3dherbarium.org" src="https://plausible.io/js/script.outbound-links.js"></Script>
      <SessionProvider session={session}>
        <Providers>
            {children}
        </Providers>
      </SessionProvider>
    </body>
  </html>
}
