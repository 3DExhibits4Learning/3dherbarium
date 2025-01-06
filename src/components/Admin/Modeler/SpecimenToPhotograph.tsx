'use client'

import { Accordion, AccordionItem } from "@nextui-org/react";
import { specimenWithImageSet } from "@/api/types";

export default function SpecimenToPhotograph(props: { unphotographedSpecimen: specimenWithImageSet[]}) {
    return(
    <Accordion>
        {props.unphotographedSpecimen.map((specimen, index) => {
            const date = specimen.spec_acquis_date.toUTCString()
            return (
                <AccordionItem className='ml-12' key={index} aria-label="Accordion 1" title={specimen.spec_name} classNames={{title: 'text-2xl text-[#004C46] italic dark:text-white'}}>
                    <p>Date Acquired: {date.substring(0, date.length - 12)}</p>
                    <p>Procurer: {specimen.procurer}</p>
                </AccordionItem>
            )
        })}
    </Accordion>
    );
}