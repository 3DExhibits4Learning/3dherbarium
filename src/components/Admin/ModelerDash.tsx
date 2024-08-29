'use client'
import { Accordion, AccordionItem } from "@nextui-org/react"
import NewSpecimenEntry from "./NewSpecimenEntry"
import NewImageSet from "./NewImageSet"
import New3DModel from "./NewModelEntry"
import { specimenWithImageSet, imageSetWithModel } from "@/api/types"
import SpecimenToPhotograph from "./SpecimenToPhotograph"
import SpecimenToModel from "./SpecimenToModel"

export default function ModelerDash(props: {unphotographedSpecimen: specimenWithImageSet[], unModeledSpecimen: imageSetWithModel[]}) {
    return (
        <>
            <Accordion>
                <AccordionItem key={'newSpecimen'} aria-label={'New Specimen'} title={"I've acquired a new specimen"} classNames={{title: 'text-[ #004C46] text-2xl'}}>
                    <NewSpecimenEntry />
                </AccordionItem>
                <AccordionItem key={'newImageSet'} aria-label={'New Image Set'} title={"I've photographed a new specimen"} classNames={{title: 'text-[ #004C46] text-2xl'}}>
                    <NewImageSet />
                </AccordionItem>
                <AccordionItem key={'new3DModel'} aria-label={'New Image Set'} title={"I've created a new 3D Model"} classNames={{title: 'text-[ #004C46] text-2xl'}}>
                    <New3DModel />
                </AccordionItem>
                <AccordionItem key={'specimenToPhotograph'} aria-label={'New Image Set'} title={"Specimen to photograph [" + props.unphotographedSpecimen.length + ']' } classNames={{title: 'text-[ #004C46] text-2xl'}}>
                    <SpecimenToPhotograph unphotographedSpecimen={props.unphotographedSpecimen} />
                </AccordionItem>
                <AccordionItem key={'specimenToModel'} aria-label={'New Image Set'} title={"Specimen to model [" + props.unModeledSpecimen.length + ']'} classNames={{title: 'text-[ #004C46] text-2xl'}}>
                    <SpecimenToModel unModeledSpecimen={props.unModeledSpecimen} />
                </AccordionItem>
            </Accordion>
        </>
    )
}