/**
 * @file src\functions\server\jira.ts
 * 
 * @fileoverview jira api project management logic
 *  Transitions: // https://3dteam.atlassian.net/rest/api/2/issue/{epic key}/transitions
 *
 * 
 */

/**
 * 
 * @returns 
 */
export const getBase64ApiKey = () => Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')

/**
 * 
 * @param base64 
 * @returns 
 */
export const getJiraHeaders = (base64: string) => {
    return {
        'X-Force-Accept-Language': true,
        'Accept-Language': 'en',
        'Authorization': `Basic ${base64}`,
        'Content-Type': 'application/json',
    }
}

/**
 * 
 * @param epic 
 * @param uuidSlice8 
 * @returns 
 */
export const getTaskFromEpic = (epic: any, uuidSlice8: string) => epic.issues.find((issue: any) => issue.fields.summary.includes(uuidSlice8))

/**
 * 
 * @param task 
 * @param uuidSlice8 
 * @param subtaskKeyword 
 * @returns 
 */
export const getSubtaskFromTask = (task: any, uuidSlice8: string, subtaskKeyword: string) =>
    task.fields.subtasks.find((subtask: any) => subtask.fields.summary.includes(uuidSlice8) && subtask.fields.summary.includes(subtaskKeyword))

/**
 * 
 * @param transitionId 
 * @param issueKey 
 */
export const transitionIssue = async (transitionId: number, issueKey: string) => {

    const base64 = getBase64ApiKey()

    const transition = await fetch(`https://3dteam.atlassian.net/rest/api/3/issue/${issueKey}/transitions`, {
        method: 'POST',
        headers: getJiraHeaders(base64) as unknown as HeadersInit,
        body: JSON.stringify({ transition: { id: transitionId } })
    })

    if (!transition.ok) { throw Error(transition.statusText) }
    return transition
}

/**
 * 
 * @param parentKey 
 * @returns  
 */
export const getIssue = async (issueKey: string) => {

    // Get api key, get epi
    const base64 = getBase64ApiKey()
    const epic = await fetch(`https://3dteam.atlassian.net/rest/api/3/search/jql?jql=parent = ${issueKey}&fields=key,summary,parent,status,subtasks`, { headers: getJiraHeaders(base64) as unknown as HeadersInit })

    // Throw error on bad request; return epic
    if (!epic.ok) { throw Error(epic.statusText) }
    else return await epic.json().then(json => json).catch(e => { throw Error(e.message) })
}

/**
 * 
 * @param data task data object
 */
export const jiraTaskFetch = async (data: any) => {

    const base64 = getBase64ApiKey()

    const taskFetch = await fetch('https://3dteam.atlassian.net/rest/api/3/issue', {
        method: 'POST',
        headers: getJiraHeaders(base64) as unknown as HeadersInit,
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
export async function createTask(epicKey: string, summary: string, description: string, assigneeId: string, type?: string, project?: string) {

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

/**
 * @deprecated use transitionSubtask
 * @param issueKey 
 * @param uuidSlice10 
 * @param subtaskKeyword 
 */
export async function markSubtaskAsDone(issueKey: string, uuidSlice8: string, subtaskKeyword: string) {

    try {
        // Get epic JSON data
        const epic = await getIssue(issueKey).catch(e => { throw Error(e.message) })

        // Find the task including the first 10 chars of the spcimen uuid in the summary
        const task = getTaskFromEpic(epic, uuidSlice8)

        // Get the task JSON and find the subtask containing both the first 10 chars of the uuid and the subtask keyword
        const subtask = getSubtaskFromTask(task, uuidSlice8, subtaskKeyword)

        // Transition the issue to "done" with transition ID 31
        transitionIssue(31, subtask.key)
    }
    // throw error on catch
    catch (e: any) { throw Error(e.message) }
}

/**
 * @deprecated use transitionTask
 * @param issueKey 
 * @param uuidSlice10 
 * @param subtaskKeyword 
 */
export async function markTaskAsInProgress(issueKey: string, uuidSlice8: string) {

    try {
        // Get epic JSON data
        const epic = await getIssue(issueKey).catch(e => { throw Error(e.message) })

        // Find the task including the first 10 chars of the spcimen uuid in the summary
        const task = getTaskFromEpic(epic, uuidSlice8)

        // Transition the issue to "done" with transition ID 31
        await transitionIssue(21, task.key).catch(e => { throw Error(e.message) })
    }
    // throw error on catch
    catch (e: any) { throw Error(e.message) }
}

/**
 * 
 * @param issueKey 
 * @param uuidSlice10 
 * @param subtaskKeyword 
 */
export async function transitionTask(issueKey: string, uuidSlice8: string, transitionId: number) {

    try {
        // Get epic JSON data
        const epic = await getIssue(issueKey).catch(e => { throw Error(e.message) })

        // Find the task including the first 8 chars of the spcimen uuid in the summary
        const task = getTaskFromEpic(epic, uuidSlice8)

        // Transition the issue to "done" with transition ID 31
        await transitionIssue(transitionId, task.key).catch(e => { throw Error(e.message) })
    }
    // throw error on catch
    catch (e: any) { throw Error(e.message) }
}

/**
 * 
 * @param issueKey 
 * @param uuidSlice8 
 * @param subtaskKeyword 
 * @param transitionId 
 */
export async function transitionSubtask(issueKey: string, uuidSlice8: string, subtaskKeyword: string, transitionId: number) {

    try {
        // Get epic JSON data
        const epic = await getIssue(issueKey).catch(e => { throw Error(e.message) })

        // Find the task including the first 10 chars of the spcimen uuid in the summary
        const task = getTaskFromEpic(epic, uuidSlice8)

        // Get the task JSON and find the subtask containing both the first 8 chars of the uuid and the subtask keyword
        const subtask = getSubtaskFromTask(task, uuidSlice8, subtaskKeyword)

        // Transition the issue to to transitionId
        transitionIssue(transitionId, subtask.key)
    }
    // throw error on catch
    catch (e: any) { throw Error(e.message) }
}

export const getJiraTeamMembers = async () => {
    const base64 = getBase64ApiKey()

    const users = await fetch('https://3dteam.atlassian.net/rest/api/3/users/search', {headers: getJiraHeaders(base64) as unknown as HeadersInit,})

    if (!users.ok) throw Error(users.statusText)
    else return await users.json().then(json => json)
}