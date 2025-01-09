/**
 * @file src\functions\server\jira.ts
 * 
 * @fileoverview jira api project management logic file
 */

export const getChildIssues = async (parentKey: string) => {
    const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')

    const epic = await fetch(`https://3dteam.atlassian.net/rest/api/3/search?jql="parent" = ${parentKey}`, {
        //@ts-ignore -- without the first two headers, data is not returned in English
        headers: {
            'X-Force-Accept-Language': true,
            'Accept-Language': 'en',
            'Authorization': `Basic ${base64}`,
            'Content-Type': 'application/json',
        },
    }).then(res => res.json()).then(json => json)

    console.log(epic)
}


/**
 * 
 * @param data task data object
 */
export const jiraTaskFetch = async (data: any) => {

    const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')

    const taskFetch = await fetch('https://3dteam.atlassian.net/rest/api/3/issue', {
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

    if (!taskFetch.ok) throw Error(taskFetch.statusText)
    else return await taskFetch.json().then(json => json)
}

/**
 * 
 * @param epicKey key of parent epic
 * @param summary task summary
 * @param description task description
 * @param assigneeId task assignee jira ID
 * @returns jira api return object from jiraTaskFetch()
 */
export default async function createTask(epicKey: string, summary: string, description: string, assigneeId: string, type?: string, project?: string) {

    // Create jira task data object
    const data = {
        fields: {
            project: { key: project ? project : 'SPRIN' },
            parent: { key: epicKey },
            summary: summary,
            description: {
                type: 'doc',
                version: 1,
                content: [{ type: 'paragraph', content: [{ type: 'text', text: description }] }]
            },
            issuetype: { name: type ? type : 'Task' },
            assignee: { id: assigneeId }
        }
    }

    // Return object returned from jiraTaskFetch()
    return jiraTaskFetch(data)
}