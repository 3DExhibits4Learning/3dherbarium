/**
 * @file src/functions/client/admin/manager.ts
 * 
 * @fileoverview logic file for management client
 */

'use client'

/**
 * 
 * @param uid of the 3D model
 * @param community flag indicating whether the model is a community model or not
 * @returns message indicating the status of the thumbnail update
 */

export const updateThumbnail = async (uid: string, community: boolean) => {
    const path = community ? `/api/sketchfab/thumbnail?uid=${uid}&community=true` : `/api/sketchfab/thumbnail?uid=${uid}`
    return await fetch(path).then(res => res.json()).then(res => res).catch(e => { if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') console.error(e.message); throw Error("Route handler error") })
}

/**
 * 
 * @param assignee task assignee
 * @param katId Kat's Jira ID
 * @param hunterId Hunter's Jira ID
 * @returns message indicating the status of the creation of the procurment task
 */
export const createProcurementTask = async (assignee: string, katId: string, hunterId: string) => {

    // Determine id of the assignee
    const assigneeId = assignee === 'Hunter' ? hunterId : katId

    // Procurement task data
    const data = {
        fields: {
            project: { key: 'HERB' },
            parent: { key: 'HERB-59' },
            summary: `Procure ${new Date().toLocaleDateString}`,
            description: { type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text: `Procure ${new Date().toLocaleDateString}` }] }] },
            issuetype: { name: 'Task' },
            assignee: { id: assigneeId }
        }
    }
    
    // Create the task; return status message 
    return await fetch('/api/issues/create', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json()).then(json => { console.log(json.response); return json.response })
}