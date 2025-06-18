'use client'

import { useEffect, useState } from "react"
import PendingModels from "@/components/Dashboard/PendingModels"
import PublishedModels from "@/components/Dashboard/PublishedModels"
import ModelViewer from "../Shared/ModelViewer"
import { ModelsWithTagsAndSoftware } from "@/ts/types"
import { Divider } from "@heroui/react"
import InaturalistDash from "@/components/Dashboard/iNaturalist"
import { Button } from "@heroui/react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface DashboardClientProps {
    pendingModels: string,
    publishedModels: string,
    anyPendingModels: boolean,
    anyPublishedModels: boolean,
    latestPublishedModelUid: string,
    iNatAccountLinked: boolean,
    tokenExpiration: number,
    iNatUid: string
    activeSpeciesName: string
}

export default function DashboardClient(props: DashboardClientProps) {

    const router = useRouter()
    let uid = ''
    const anyModels = props.anyPendingModels || props.anyPublishedModels ? true : false
    const pendingModels : ModelsWithTagsAndSoftware[] = JSON.parse(props.pendingModels)
    const publishedModels : ModelsWithTagsAndSoftware[] = JSON.parse(props.publishedModels)
    
    if(anyModels){
        uid = props.latestPublishedModelUid ? props.latestPublishedModelUid : pendingModels[0].modeluid
    }

    const [viewerUid, setViewerUid] = useState<string>(uid)
    const [publishedSelectedKeys, setPublishedSelectedKeys] = useState<Set<string>>(new Set(['0']))
    const [pendingSelectedKeys, setPendingSelectedKeys] = useState<Set<string>>(new Set(['']))
    const [activeSpeciesName, setActiveSpeciesName] = useState<string>(props.activeSpeciesName)

    useEffect(() => {
        if (!props.anyPublishedModels) {
            setPendingSelectedKeys(new Set(["0"]))
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!anyModels) {
        return (
            <div className="flex flex-col min-h-[calc(100vh-177px)] lg:w-full max-h-[calc(100vh-177px)] overflow-hidden items-center justify-center">
                <p className="text-3xl font-medium">Upload your first 3D model to get started!</p><br></br>
                <p>
                    <Button className="text-white font-medium"
                        onClick={() => router.push('/modelSubmit')}
                    >
                        <Image src='../../upload.svg' width={22} height={0} alt='Upload' />UPLOAD
                    </Button>
                </p>
            </div>
        )
    }
    return (
        <>
            <div className="flex min-h-[calc(100vh-177px)] lg:w-full lg:max-h-[calc(100vh-177px)] overflow-hidden">
                <div className="w-full lg:w-[30%] h-full lg:max-h-[calc(100vh-177px)] overflow-y-auto overflow-x-hidden">

                    {
                        props.anyPendingModels &&
                        <>
                            <div className="flex justify-between items-center">
                                <p className='text-2xl my-4 ml-2'>Pending 3D Models</p>
                                <div className="flex bg-[#00856A] text-white w-[25px] h-[28px] text-center rounded-md mr-12 items-center justify-center text-xl">{pendingModels.length}</div>
                            </div>
                            <Divider />
                            <PendingModels
                                models={pendingModels}
                                setViewerUid={setViewerUid}
                                selectedKeys={pendingSelectedKeys}
                                setSelectedKeys={setPendingSelectedKeys}
                                setPublishedSelectedKeys={setPublishedSelectedKeys}
                                setActiveSpeciesName={setActiveSpeciesName} />
                            <Divider />
                        </>
                    }

                    {
                        props.anyPublishedModels &&
                        <>
                            <div className="flex justify-between items-center">
                                <p className='text-2xl my-4 ml-2'>Published 3D Models</p>
                                <div className="flex bg-[#00856A] text-white w-[25px] h-[28px] text-center rounded-md mr-12 items-center justify-center text-xl">{publishedModels.length}</div>
                            </div>
                            <Divider />
                            <PublishedModels
                                models={publishedModels}
                                setViewerUid={setViewerUid}
                                selectedKeys={publishedSelectedKeys}
                                setSelectedKeys={setPublishedSelectedKeys}
                                setPendingSelectedKeys={setPendingSelectedKeys}
                                setActiveSpeciesName={setActiveSpeciesName}
                            />
                        </>
                    }
                </div>
                <div className="sticky w-2/5 hidden lg:flex">
                    <ModelViewer uid={viewerUid} />
                </div>

                <div className="w-[30%] max-h-[calc(100vh-177px)] overflow-y-auto overflow-x-hidden hidden lg:block">
                    <InaturalistDash
                        iNatAccountLinked={props.iNatAccountLinked}
                        tokenExpiration={props.tokenExpiration}
                        activeSpeciesName={activeSpeciesName}
                        iNatId={props.iNatUid}
                    />
                </div>
            </div>
        </>
    )
}