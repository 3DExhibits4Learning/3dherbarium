'use client'

// Default imports
import AddModelAnnotationForm from "@/components/Admin/Botanist/AddModelAnnotationForm"
import SelectModelToAddAnnotationModel from "@/components/Admin/Botanist/SelectModelToAddAnnotationModel"

// Typical imports
import { model } from "@prisma/client"
import { useState } from "react"

// Main JSX
export default function AddModelAnnotationToPublishedModel(props: { baseModelsForAnnotationModels: model[], annotationModels: model[] }) {

    // States
    const [model, setModel] = useState({ uid: '', species: '' })
    const [markerPosition, setMarkerPosition] = useState('')

    return <>
        {
            !!props.baseModelsForAnnotationModels.length &&
            <section className="flex w-full h-full">
                <SelectModelToAddAnnotationModel modelsToAnnotate={props.baseModelsForAnnotationModels} setPosition={setMarkerPosition} model={model} setModel={setModel} />
                <AddModelAnnotationForm annotationModels={props.annotationModels} model={model} position={markerPosition} />
            </section>
        }
        {
            !props.baseModelsForAnnotationModels.length &&
            <p className="text-xl">*There are no unused annotation models</p>
        }
    </>
}