/**
 * @file src/app/api/user/route.ts
 * 
 * @fileoverview route handler for checking token status
 */

// Typical imports
import { Account } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error";
import { routeHandlerTypicalResponse } from "@/functions/server/response";

// SINGLETON
import prisma from "@/utils/prisma";

// PATH
const path = 'src/app/api/user/route.ts'

/**
 * 
 * @param request 
 * @returns 
 */
export async function GET(request: Request) {

    try {

        // Get session
        const session = await getServerSession(authOptions).catch(e => routeHandlerErrorHandler(e.message, path, 'getServerSession()', "Coldnt' get session"))

        // Date object with extra digits removed
        const dateObject = new Date()
        let date = Math.round(dateObject.getTime() / 1000)

        // Get provider from params
        const { searchParams } = new URL(request.url)
        const account = await prisma.account.findFirst({ where: { userId: session.user.id, provider: searchParams.get('provider') as string } }).catch(e => routeHandlerErrorHandler(e.message, path, 'getServerSession()', "Coldnt' get account")) as Account

        // Determine token validity
        const tokenValidity = account.expires_at && account.expires_at <= date ? false : true

        // Typical response including validity and token
        return routeHandlerTypicalResponse('Token found', { tokenValidity: tokenValidity, token: account.access_token })
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}