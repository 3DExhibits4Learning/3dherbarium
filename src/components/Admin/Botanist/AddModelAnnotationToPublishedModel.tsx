'use client'

import AddModelAnnotationForm from "@/components/Admin/Botanist/AddModelAnnotationForm"
// Default imports
import SelectModelToAddAnnotationModel from "@/components/Admin/Botanist/SelectModelToAddAnnotationModel"

// Typical imports
import { model } from "@prisma/client"
import { useState } from "react"

// Main JSX
export default function AddModelAnnotationToPublishedModel(props: {baseModelsForAnnotationModels: model[], annotationModels: model[]}) {

    // States
    const [uid, setUid] = useState('')
    const [markerPosition, setMarkerPosition] = useState('')
    
    return <section className="flex w-full h-full">
        <SelectModelToAddAnnotationModel modelsToAnnotate={props.baseModelsForAnnotationModels} uid={uid} setUid={setUid} setPosition={setMarkerPosition}/>
        <AddModelAnnotationForm annotationModels={props.annotationModels} baseUid={uid} position={markerPosition}/>
    </section>
}