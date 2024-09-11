import sendErrorEmail from "@/utils/Jira/sendErrorEmail"

export async function POST(request: Request) {

    try{
        const data = await request.json()

        const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')
    
        const response = await fetch('https://3dteam.atlassian.net/rest/api/3/issue', {
            method: 'POST',
            //@ts-ignore -- without the first two headers, data is not returned in English
            headers: {
                'X-Force-Accept-Language': true,
                'Accept-Language': 'en',
                'Authorization': `Basic ${base64}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json()).then(json => json).catch((e: any) => sendErrorEmail(e.message))
    
        return Response.json({data: "Success", response: response})
    }
    catch(e:any){return Response.json({data: "Error", response: e.message}, {status: 400, statusText: 'Error'})}
}