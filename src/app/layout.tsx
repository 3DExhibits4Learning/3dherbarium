import { Providers } from "./providers";
import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import SessionProvider from '@/components/Shared/SessionProvider'
import { redirect } from 'next/navigation'
import {admin} from '@/utils/devAuthed'

import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getServerSession();
  
  if (process.env.AUTH == 'true') {
    if (!session || !session.user) {
      redirect('/api/auth/signin')
    }
    else {
      let email = session.user.email as string
      if (!admin.includes(email)) {
        return <h1>NOT AUTHORIZED</h1>
      }
    }

  }

  const theme = cookies().get("theme");

  return (
    <html className={`${theme?.value} max-w-[100vw] bg-[#F5F3E7] dark:bg-[#181818] overflow-x-hidden`} lang="en">
      <body className="overflow-hidden min-h-[100vh] dark:bg-[#181818] text-[#004C46] dark:text-[#F5F3E7]">
        <SessionProvider session={session}>
          <Providers>
            {children}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  )
}
