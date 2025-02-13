/**
 * @file src/functions/server/user.ts
 * 
 * @fileoverview user logic file
 */

// Typical imports
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth/next"

// SINGLETON
import prisma from "@/functions/server/utils/prisma"

/**
 * 
 * @param provider 
 * @returns 
 */
export const isAccountLinked = async (provider: 'inaturalist' | 'sketchfab') => {

    // Get session, user ID and accoutns
    const session = await getServerSession(authOptions)
    if(!session)
    const userId = session.user.id
    const userAccounts = await prisma.account.findMany({ where: { userId: userId } })

    // Iterate accounts checking for provider argument; return true if found
    for (let i in userAccounts) if (userAccounts[i].provider === provider) return true
    return false
}   