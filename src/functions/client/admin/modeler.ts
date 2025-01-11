import { imageInsertion } from "@/api/types"
import { SetStateAction, Dispatch } from "react";

/**
 * 
 * @param specimenInsertData data to be inserted into db
 * @returns text indicating success or failure of route handler
 */
export const insertSpecimenIntoDatabase = async (specimenInsertData: FormData) => {
    return await fetch('/api/admin/modeler/specimen', {
        method: 'POST',
        body: specimenInsertData
    }).then(res => res.json()).then(json => { console.log(json); return json.data })
}

/**
 * 
 * @param data data to be inserted into db
 * @returns text indicating success or failure of route handler
 */
export const insertModelIntoDatabase = async (data: FormData) => {
    await fetch('/api/admin/modeler/model', {
        method: 'POST',
        body: data
    }).then(res => res.json()).then(json => { console.log(json); return json.data })
}

/**
 * 
 * @param imageSetInsertData data to be inserted into db
 * @returns text indicating success or failure of route handler
 */
export const insertImageSetIntoDatabase = async (imageSetInsertData: imageInsertion) => {
    return await fetch('/api/admin/modeler/photos', {
        method: 'POST',
        body: JSON.stringify(imageSetInsertData)
    }).then(res => res.json()).then(json => { console.log(json); return json.data })
}

/**
 * 
 * @param setImgSrc function to set state of image source
 * @param url photo url
 */
export const setImageSource = async (setImgSrc: Dispatch<SetStateAction<any>>, url: string) => {
    if (process.env.NEXT_PUBLIC_LOCAL) setImgSrc(await fetch(`/api/nfs?url=${url.slice(6)}`))
    else setImgSrc(url.slice(6))
}