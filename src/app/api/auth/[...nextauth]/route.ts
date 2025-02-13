/**
 * @file src/app/api/auth/[...nextauth]/route.ts
 * 
 * @fileoverview nextauth route handler
 */

// Typical imports
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Adapter } from "next-auth/adapters";
import { SessionStrategy } from "next-auth";
import { prismaClient } from "@/functions/server/queries";

// Default imports
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email";
import iNaturalistProvider from "@/providers/iNatualistProvider";
import SketchfabProvider from "@/providers/sketchfabProvider";

// singleton prisma client
const prisma = prismaClient()

export const authOptions = {
  //debug: true,
  adapter: PrismaAdapter(prismaClient()) as Adapter,
  session: { strategy: 'jwt' as SessionStrategy },
  providers: [
    
    // Google
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),

    // Sketchfab
    SketchfabProvider({
      clientId: process.env.SKETCHFAB_ID as string,
      clientSecret: process.env.SKETCHFAB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),

    // iNaturalist
    iNaturalistProvider({
      clientId: process.env.INATURALIST_ID as string,
      clientSecret: process.env.INATURALIST_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),

    // Email
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT as string),
        secure: true,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {

    // jwt callback, called whenever a new jwt is created
    // user is only available during sign-in
    async jwt({ token, user, account }: { token: any, user: any, account: any }) {

      if (user) {

        token.id = user.id
        token.provider = account.provider
        token.accessToken = account.access_token

        // If the user is in the database (has signed in before), and logged in with an oauth provider (not email), update their account data upon sign-in
        try {

          const userFromDatabase = await prisma.user.findUnique({
            where: { id: user.id }
          })

          if (userFromDatabase && token.provider !== 'email') {
            await prisma.account.update({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
              data: {
                access_token: account.access_token,
                expires_at: account.expires_at,
                id_token: account.id_token,
                refresh_token: account.refresh_token,
                session_state: account.session_state,
                scope: account.scope,
              },
            });
          }
        }
        catch (e: any) { console.error(e.message) }
      }
      return token
    },

    // session callback
    session({ session, token }: { session: any, token: any }) {
      session.user.id = token.id
      session.accessToken = token.accessToken
      session.provider = token.provider
      return session
    },
  },
}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };