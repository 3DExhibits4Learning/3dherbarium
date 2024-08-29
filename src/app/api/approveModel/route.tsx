import { approveModel } from "@/api/queries"

export async function POST(request: Request){
    const data = await request.json()
    try{
        const approved = await approveModel(data.confirmation)
        return Response.json({data: '3D Model Approved', prismaResponse: approved})
    }
    catch(e){return Response.json({error: 'Prisma ORM Update Error'}, {status: 400, statusText:'Prisma ORM udpate error'})}
}