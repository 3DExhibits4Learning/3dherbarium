'use client'

import { Switch } from "@nextui-org/react"
import { SetStateAction, Dispatch, useContext } from "react"
import { CollectionsContext } from "./CollectionsWrapper"
import CollectionsMediaRadio from "./Radio"
import { CollectionsWrapperData } from "@/ts/reducer"

export default function CollectionsSubheader(props: { isSelected: boolean, setIsSelected: Dispatch<SetStateAction<boolean>>, title?: string }) {

    const context = useContext(CollectionsContext) as CollectionsWrapperData
    const mediaState = context.mediaState

    return (
        <div className="hidden lg:flex h-10 bg-[#00856A] dark:bg-[#212121] text-white items-center justify-between ">
            <CollectionsMediaRadio setIsSelected={props.setIsSelected}/>
            {
                (mediaState.observationsChecked || mediaState.photosChecked) &&
                <p className="mr-8">{props.title && mediaState.photosChecked ? props.title : "Observations by iNaturalist"}</p>
            }
            {
                mediaState.modelChecked &&
                <Switch style={{ paddingRight: "2.5%" }} defaultSelected id="annotationSwitch" isSelected={props.isSelected} color='secondary' onValueChange={props.setIsSelected}>
                    <span className="text-white">Annotations</span>
                </Switch>
            }
        </div>
    )
}