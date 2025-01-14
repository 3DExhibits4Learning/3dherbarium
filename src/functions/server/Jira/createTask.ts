/**
 * @deprecated
 * @param epicKey 
 * @param summary 
 * @param description 
 * @param assigneeId 
 * @returns 
 */
export default async function createTask(epicKey: string, summary: string, description: string, assigneeId: string) {

    const data = {
        fields: {
            project: { key: 'SPRIN' },
            parent: { key: epicKey },
            summary: summary,
            description: {
                type: 'doc',
                version: 1,
                content: [{ type: 'paragraph', content: [{ type: 'text', text: description }] }]
            },
            issuetype: { name: 'Task' },
            assignee: { id: assigneeId }
        }
    }

    const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')

    const task = await fetch('https://3dteam.atlassian.net/rest/api/3/issue', {
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
        .then(res => res.json())
        .then(json => json)
        .catch(() => { throw new Error("Unable to create Task") })

    return task
}