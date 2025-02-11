/**
 * @file src/functions/client/home.ts
 * 
 * @fileoverview home page logic file
 * 
 * @todo complete commentary
 * @todo remove types
 */

import { SetStateAction, Dispatch, MutableRefObject } from "react"

import Sketchfab from '@sketchfab/viewer-api'

export interface materials {
    xylem: any,
    phloem: any,
    bark: any,
    needles: any
}

export interface elementsRef {
    barkSection: HTMLDivElement,
    phloemSection: HTMLDivElement,
    xylemSection: HTMLDivElement
}

/**
 * 
 * @param event 
 */

export const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>, setRangeValue: Dispatch<SetStateAction<number>>) => {
    const val: string = event.target.value
    setRangeValue(parseInt(val))
}

/**
 * 
 * @param sketchFabApi 
 * @returns 
 */
export const getMaterialsList = async (sketchFabApi: any) => {

    // Return a new promise
    return new Promise((resolve, reject) => {

        // Get material list from API
        sketchFabApi.getMaterialList((err: any, materials: any) => {

            // Reject promise on error
            if (err) reject()

            // Material list for pine tree
            const materialsObject: materials = {
                xylem: materials[0],
                phloem: materials[3],
                bark: materials[1],
                needles: materials[4]
            }

            // Resolve promise materials object
            resolve(materialsObject)
        })
    })
}

/**
 * 
 * @param opacity 
 * @param material 
 * @param api 
 */
export const setOpacity = (opacity: any, material: any, api: any) => {
    material.channels.Opacity.enable = true;
    material.channels.Opacity.type = 'alphaBlend';
    material.channels.Opacity.factor = opacity;
    api.setMaterial(material, () => { })
}

/**
 * 
 * @param setOpacity 
 * @param materials 
 * @param val 
 * @param elementsRef 
 */
export const sliderGreaterThan200 = (api: any, materials: materials, val: number, elementsRef: MutableRefObject<elementsRef>) => {
    const opacity = (val - 200) / 100
    setOpacity(1, materials.xylem, api)
    setOpacity(1, materials.phloem, api)
    setOpacity(opacity, materials.bark, api)
    setOpacity(opacity, materials.needles, api)
    elementsRef.current.barkSection.style.opacity = "" + opacity
    elementsRef.current.phloemSection.style.opacity = "" + (1 - opacity)
    elementsRef.current.xylemSection.style.opacity = "0"
}

/**
 * 
 * @param setOpacity 
 * @param materials 
 * @param val 
 * @param elementsRef 
 */
export const sliderEqualTo200 = (api: any, materials: materials, elementsRef: MutableRefObject<elementsRef>) => {
    setOpacity(1, materials.xylem, api)
    setOpacity(1, materials.phloem, api)
    setOpacity(0, materials.bark, api)
    setOpacity(0, materials.needles, api)
    elementsRef.current.barkSection.style.opacity = "0"
    elementsRef.current.phloemSection.style.opacity = "1"
    elementsRef.current.xylemSection.style.opacity = "0"
}

/**
 * 
 * @param setOpacity 
 * @param materials 
 * @param val 
 * @param elementsRef 
 */
export const sliderLessThan200GreaterThan100 = (api: any, materials: materials, val: number, elementsRef: MutableRefObject<elementsRef>) => {
    const opacity = (val - 100) / 100
    setOpacity(1, materials.xylem, api)
    setOpacity(opacity, materials.phloem, api)
    setOpacity(0, materials.bark, api)
    setOpacity(0, materials.needles, api)
    elementsRef.current.barkSection.style.opacity = "0"
    elementsRef.current.phloemSection.style.opacity = "" + opacity
    elementsRef.current.xylemSection.style.opacity = "" + (1 - opacity)
}

/**
 * 
 * @param setOpacity 
 * @param materials 
 * @param val 
 * @param elementsRef 
 */
export const sliderEqualTo100 = (api: any, materials: materials, elementsRef: MutableRefObject<elementsRef>) => {
    setOpacity(1, materials.xylem, api)
    setOpacity(0, materials.phloem, api)
    setOpacity(0, materials.bark, api)
    setOpacity(0, materials.needles, api)
    elementsRef.current.barkSection.style.opacity = "0"
    elementsRef.current.phloemSection.style.opacity = "0"
    elementsRef.current.xylemSection.style.opacity = "1"
}

/**
 * 
 * @param setOpacity 
 * @param materials 
 * @param val 
 * @param elementsRef 
 */
export const sliderLessThan100 = (api: any, materials: materials, val: number, elementsRef: MutableRefObject<elementsRef>) => {
    const opacity = val / 100
    setOpacity(opacity, materials.xylem, api)
    setOpacity(0, materials.phloem, api)
    setOpacity(0, materials.bark, api)
    setOpacity(0, materials.needles, api)
    elementsRef.current.barkSection.style.opacity = "0"
    elementsRef.current.phloemSection.style.opacity = "0"
    elementsRef.current.xylemSection.style.opacity = "" + opacity
}


/**
 * 
 * @param api 
 */
export const viewerReadySuccessHandler = async (api: any, slider: MutableRefObject<HTMLInputElement>, elementsRef: MutableRefObject<elementsRef>) => {

    // Get materials
    const materials = await getMaterialsList(api) as materials

    // Add event listener to slider
    slider.current.addEventListener("input", (event: any) => {

        // Parse integer input value
        const val = parseInt(event.target?.value)

        // Determine appropriate function based on input value
        if (val > 200) sliderGreaterThan200(api, materials, val, elementsRef)
        else if (val === 200) sliderEqualTo200(api, materials, elementsRef)
        else if (val < 200 && val > 100) sliderLessThan200GreaterThan100(api, materials, val, elementsRef)
        else if (val === 100) sliderEqualTo100(api, materials, elementsRef)
        else sliderLessThan100(api, materials, val, elementsRef)
    })
}

/**
 * 
 * @param viewerReadySuccessHandlerWrapper 
 */
export const initializeHomeModel = (viewerReadySuccessHandlerWrapper: Function) => {

    // Get iframe, create new Sketchfab object
    var iframe = document.getElementById('homeModel')
    var uid = '611560e2f07e436ca7eef747b77968ce'
    var client = new Sketchfab(iframe)

    // Sketchfab object initialization method success object parameter
    const initMethodParam = {
        success: (api: any) => {api.start(); api.addEventListener('viewerready', () => viewerReadySuccessHandlerWrapper(api))},
        error: () => {},
        ui_stop: 0,
        ui_infos: 0,
        ui_inspector: 0,
        ui_settings: 0,
        ui_watermark: 0,
        ui_annotations: 0,
        ui_color: "004C46",
        ui_fadeout: 0
    }

    // Sketchfab object initialiation method
    client.init(uid, initMethodParam)
}