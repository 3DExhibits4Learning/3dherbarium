'use client'

import { Accordion, AccordionItem } from "@nextui-org/react";
import { imageSetWithModel } from "@/api/types";

export default function SpecimenToModel(props: { unModeledSpecimen: imageSetWithModel[] }) {
    return(
    <Accordion>
        {props.unModeledSpecimen.map((specimen, index) => {
            const dateAcquired = specimen.spec_acquis_date.toUTCString()
            const dateImaged = specimen.imaged_date.toUTCString()
            return (
                <AccordionItem className='ml-12' key={index} aria-label="Specimen to Model" title={specimen.spec_name} classNames={{title: 'text-2xl text-[#004C46] italic dark:text-white'}}>
                    <p>Date Acquired: {dateAcquired.substring(0, dateAcquired.length - 12)}</p>
                    <p>Date Photographed: {dateImaged.substring(0, dateImaged.length - 12)}</p>
                    <p>Photographer: {specimen.imaged_by}</p>
                </AccordionItem>
            )
        })}
    </Accordion>
    );
}