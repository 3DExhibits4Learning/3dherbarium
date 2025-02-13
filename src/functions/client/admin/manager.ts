/**
 * @file src/functions/client/admin/manager.ts
 * 
 * @fileoverview logic file for management client
 */

'use client'

// Typical imports
import { ApproveModelObject, Models } from "@/ts/types"
import { SetStateAction, Dispatch } from "react"

// Default imports
import checkToken from "@/functions/client/utils/checkToken"

/**
 * 
 * @param uid of the 3D model
 * @param community flag indicating whether the model is a community model or not
 * @returns message indicating the status of the thumbnail update
 */

export const updateThumbnail = async (uid: string, community: boolean) => {
    const path = community ? `/api/sketchfab/thumbnail?uid=${uid}&community=true` : `/api/sketchfab/thumbnail?uid=${uid}`
    return await fetch(path).then(res => res.json()).then(res => res.data).catch(e => { if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') console.error(e.message); throw Error("Route handler error") })
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
    const assigneeId = '712020:28db4706-9c68-4e0f-aa90-655876123369'

    // Procurement task data
    const data = {
        fields: {
            project: { key: 'SPRIN' },
            parent: { key: 'SPRIN-11' },
            summary: `Subtask example`,
            description: { type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text: `Example subtask` }] }] },
            issuetype: { name: 'Subtask' },
            assignee: { id: assigneeId }
        }
    }

    // Create the task; return status message 
    return await fetch('/api/issues/create', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json()).then(json => { console.log(json.response); return json.data })
}

/**
 * 
 * @param model 
 * @param wild 
 * @param photoFiles 
 * @returns 
 */
export const approveCommunityModel = async (model: Models, wild: boolean, photoFiles: string[]) => {

    const isTokenValid = await checkToken('inaturalist')

    if (isTokenValid) {
        
        const approveModelObject: ApproveModelObject = {
            confirmation: model.confirmation,
            species: model.speciesName,
            latitude: model.lat as unknown as number,
            longitude: model.lng as unknown as number,
            files: photoFiles,
            wild: wild,
            email: model.email,
            uid: model.modeluid
        }

        return await fetch('/api/approveModel', {
            method: 'POST',
            body: JSON.stringify(approveModelObject)
        })
            .then(res => res.json())
            .then(json => json.data)
    }

    else return "You need to refresh you're iNaturalist token to approve a wild model"
}

/**
 * 
 * @param confirmation 
 * @param setPhotoFiles 
 */
export const getPhotoFiles = async (confirmation: string, setPhotoFiles: Dispatch<SetStateAction<string[]>>) => {

    await fetch(`/api/admin/manager/photoFiles?path=public/data/Herbarium/tmp/submittal/${confirmation}`)
        .then(res => res.json())
        .then(json => setPhotoFiles(json.response))
}

/**
 * 
 * @param index 
 * @param pendingModels 
 * @param setApprovalDisabled 
 */
export const updateAccordionItemState = (index: number, pendingModels: Models[], setApprovalDisabled: Dispatch<SetStateAction<boolean>>) => {
    const approvable = pendingModels[index].thumbnail.includes('models')
    setApprovalDisabled(!approvable)
}

export const migrateAnnotatedModels = async() => await fetch('/api/admin/manager/migrate', {method: 'POST'}).then(res => res.text()).catch(e => e.message)