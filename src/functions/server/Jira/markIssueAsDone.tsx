export default async function markIssueAsDone(epicKey: string, summaryExpression: string) {

    try {
        
        const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')

        const epic = await fetch(`https://3dteam.atlassian.net/rest/api/3/search?jql="parent" = ${epicKey}`, {
            //@ts-ignore -- without the first two headers, data is not returned in English
            headers: {
                'X-Force-Accept-Language': true,
                'Accept-Language': 'en',
                'Authorization': `Basic ${base64}`,
                'Content-Type': 'application/json',
            },
        }).then(res => res.json()).then(json => json)

        for (let i in epic.issues) {
            
            if (epic.issues[i].fields.summary.includes(summaryExpression)) {

                const transitionData = {
                    transition: { id: 31 }
                }

                await fetch(`https://3dteam.atlassian.net/rest/api/3/issue/${epic.issues[i].key}/transitions`, {
                    method: 'POST',
                    //@ts-ignore -- without the first two headers, data is not returned in English
                    headers: {
                        'X-Force-Accept-Language': true,
                        'Accept-Language': 'en',
                        'Authorization': `Basic ${base64}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(transitionData)
                })
            }
        }
    }
    catch(e: any){} // TODO : Send Email
}