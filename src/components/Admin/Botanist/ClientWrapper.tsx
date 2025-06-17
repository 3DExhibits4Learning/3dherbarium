'use client'

import Header from "@/components/Header/Header"
import BotanyClient from "@/components/Admin/Botanist/BotanyClient"
import Foot from "@/components/Shared/Foot"
import { model } from "@prisma/client"

export default function BotanyClientWrapper(props: { modelsToAnnotate: model[], annotationModels: model[], epic: any, baseModelsForAnnotationModels: model[] }) {
    return <>
        <Header pageRoute="collections" headerTitle="Botany Admin" />
        <main className="w-full min-h-[calc(100vh-177px)] h-[calc(100vh-177px)] overflow-y-auto">
            <BotanyClient {...props} />
        </main>
        <Foot />
    </>
}