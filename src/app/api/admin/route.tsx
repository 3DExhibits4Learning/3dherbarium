import { userIsAdmin } from "@/functions/server/queries";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    
    try {
        
        const searchParams = request.nextUrl.searchParams
        const email = searchParams.get('email')

        if (!email) throw Error('No email provided')

        const bool = userIsAdmin(email as string).catch((e) => {
            console.error(new Date().toDateString(), 'Route: /api/admin', 'Error: ', e.message)
            throw Error("Coulnd't query db")
        })
        
        return Response.json({ data: "Success", response: bool })
    }
    
    catch (e: any) { return Response.json({ data: e.message, response: null }, { status: 400, statusText: e.message }) }
}