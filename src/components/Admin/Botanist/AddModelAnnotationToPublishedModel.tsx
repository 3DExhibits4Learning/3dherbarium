'use client'

// Default imports
import SelectModelToAddAnnotationModel from "@/components/Admin/Botanist/SelectModelToAddAnnotationModel"

// Typical imports
import { model } from "@prisma/client"
import { useState } from "react"

export default function AddModelAnnotationToPublishedModel(props: {baseModelsForAnnotationModels: model[]}) {
    const [uid, setUid] = useState('')
    
    return <section className="flex w-full h-full">
        <SelectModelToAddAnnotationModel modelsToAnnotate={props.baseModelsForAnnotationModels} uid={uid} setUid={setUid}/>
    </section>
}