export function GET(request: Request){
    return Response.json({data: 'GotKey', response:process.env.PLANTID_KEY})
}