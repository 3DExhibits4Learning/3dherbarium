'use client'

// Typical imports
import { model } from "@prisma/client"

// Default imports
import Foot from "@/components/Shared/Foot"
import dynamic from "next/dynamic"

// Dynamic imports
const BotanyClient = dynamic(() => import('@/components/Admin/Botanist/BotanyClient'), {ssr: false}) // No ssr for sketchfab library functions
const Header = dynamic(() => import('@/components/Header/Header'), {ssr: false}) // No ssr because useParams() would randomly throw errors otherwise

export default function BotanyClientWrapper(props: { modelsToAnnotate: model[], annotationModels: model[], epic: any, baseModelsForAnnotationModels: model[] }) {
    return <>
        <Header pageRoute="collections" headerTitle="Botany Admin" />
        <main className="w-full min-h-[calc(100vh-177px)] h-[calc(100vh-177px)] overflow-y-auto"><BotanyClient {...props} /></main>
        <Foot />
    </>
}