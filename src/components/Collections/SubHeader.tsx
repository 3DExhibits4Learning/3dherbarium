/**
 * @file src/components/Collections/SubHeader.tsx
 * 
 * @fileoverview collections page subheader
 */

'use client'

// Typical imports
import { Switch } from "@nextui-org/react"
import { SetStateAction, Dispatch, useContext } from "react"
import { CollectionsContext } from "./CollectionsWrapper/CollectionsWrapper"
import { CollectionsWrapperData } from "@/ts/reducer"

// Default imports
import CollectionsMediaRadio from "./Radio"

export default function CollectionsSubheader(props: { isSelected: boolean, setIsSelected: Dispatch<SetStateAction<boolean>>, communityId: string | null }) {

    // Context 
    const context = useContext(CollectionsContext) as CollectionsWrapperData
    const mediaState = context.mediaState
    const collectionsProps = context.collectionsWrapperProps
    const title = context.collectionsWrapperProps.noModelData.title

    return <div className="hidden lg:flex h-10 bg-[#00856A] dark:bg-[#212121] text-white items-center justify-between ">
        <CollectionsMediaRadio setIsSelected={props.setIsSelected} />
        {
            (mediaState.observationsChecked || mediaState.photosChecked) &&
            <p className="mr-8">{title && mediaState.photosChecked ? title : "Observations by iNaturalist"}</p>
        }
        {/* <section className="flex mr-8"> */}
            {/* {
                mediaState.scale &&
                <Switch  className='mr-6 whitespace-nowrap' color='secondary'>
                   Scale (cm)
                </Switch>
            } */}
            {
                mediaState.modelChecked && !!collectionsProps.model.length && !props.communityId &&
                <Switch style={{ paddingRight: "2.5%" }} defaultSelected id="annotationSwitch" isSelected={props.isSelected} color='secondary' onValueChange={props.setIsSelected}>
                    <span className="text-white">Annotations</span>
                </Switch>
            }
        {/* </section> */}
    </div>
}