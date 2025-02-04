'use client'

import { Switch } from "@nextui-org/react"
import { SetStateAction, Dispatch, useContext } from "react"
import { CollectionsContext } from "./CollectionsWrapper/CollectionsWrapper"
import CollectionsMediaRadio from "./Radio"
import { CollectionsWrapperData } from "@/ts/reducer"

export default function CollectionsSubheader(props: { isSelected: boolean, setIsSelected: Dispatch<SetStateAction<boolean>>, communityId: string | null }) {

    const context = useContext(CollectionsContext) as CollectionsWrapperData
    const mediaState = context.mediaState
    const collectionsProps = context.collectionsWrapperProps
    const title = context.collectionsWrapperProps.noModelData.title

    return (
        <div className="hidden lg:flex h-10 bg-[#00856A] dark:bg-[#212121] text-white items-center justify-between ">
            <CollectionsMediaRadio setIsSelected={props.setIsSelected}/>
            {
                (mediaState.observationsChecked || mediaState.photosChecked) &&
                <p className="mr-8">{title && mediaState.photosChecked ? title : "Observations by iNaturalist"}</p>
            }
            {
                mediaState.modelChecked && !!collectionsProps.model.length && !props.communityId &&
                <Switch style={{ paddingRight: "2.5%" }} defaultSelected id="annotationSwitch" isSelected={props.isSelected} color='secondary' onValueChange={props.setIsSelected}>
                    <span className="text-white">Annotations</span>
                </Switch>
            }
        </div>
    )
}