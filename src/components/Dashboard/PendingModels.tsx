'use client'
import { Accordion, AccordionItem } from "@heroui/react";
import { PendingModelProps } from "@/ts/types";
import ModelViewer from "../Shared/ModelViewer";

export default function PendingModels(props: PendingModelProps) {
    return (
        <Accordion selectedKeys={props.selectedKeys} onSelectionChange={props.setSelectedKeys} isCompact={true} fullWidth={false}>
            {props.models.map((model, index) => {
                return (
                    <AccordionItem className='font-medium' key={index} aria-label={model.speciesName} title={model.speciesName} classNames={{ title: 'italic' }}
                        onPress={() => {
                            props.setViewerUid(model.modeluid)
                            props.setPublishedSelectedKeys(new Set(['']))
                            props.setActiveSpeciesName(props.models[index].speciesName)
                        }}>
                        <div className="flex justify-center mb-8">
                            <div className="lg:hidden w-4/5 max-w-[650px] h-[300px]">
                                <ModelViewer uid={model.modeluid} />
                            </div>
                        </div>
                        <p>Confirmation Number: {model.confirmation}</p>
                        <p>Artist: {model.artistName}</p>
                        <p>Submitted: {model.dateTime.toDateString()}</p>
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}
