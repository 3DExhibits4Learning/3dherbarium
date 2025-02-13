import { getAccount } from "@/functions/server/queries";
import { Account } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {

    const session = await getServerSession(authOptions)

    try{
        let response
        const d = new Date()
        let date = Math.round(d.getTime() / 1000)
    
        const { searchParams } = new URL(request.url);
    
        const account = await getAccount(session.user.id, searchParams.get('provider') as string) as Account
    
        if (account.expires_at && account.expires_at <= date) response = false
        else response = true
    
        return Response.json({data:'record found', response: response, token: account.access_token})
    }
    catch(e: any) {return Response.json({data:'error', response: ''},{status: 400, statusText:'error'})}
}