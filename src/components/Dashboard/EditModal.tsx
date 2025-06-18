'use client'

import { Modal, ModalContent, ModalBody, ModalHeader } from "@heroui/react"
import { ModelsWithTagsAndSoftware } from "@/ts/types"
import { SetStateAction, Dispatch } from "react";
import ModelEditForm from "./EditForm";

export default function EditModal(props: { model: ModelsWithTagsAndSoftware, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {

    // Variable initialization
    const madeWithMobile = props.model.createdWithMobile ? 'Yes' : 'No'
    const softwareArr = props.model.software.map(software => ({ value: software }))
    const tagArr = props.model.tags.map(tag => ({ value: tag }))

    return (
        <Modal className='overflow-x-hidden bg-[#D5CB9F] dark:bg-[#181818]' size='4xl' isOpen={props.open} scrollBehavior="outside" hideCloseButton>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 mb-4">Editing: {props.model.speciesName}</ModalHeader>
                <ModalBody>
                    <ModelEditForm
                        speciesName={props.model.speciesName}
                        position={{ lat: props.model.lat, lng: props.model.lng }}
                        artistName={props.model.artistName}
                        madeWithMobile={madeWithMobile}
                        buildMethod={props.model.methodology}
                        softwareArr={softwareArr}
                        tagsArr={tagArr}
                        confirmation={props.model.confirmation}
                        modelUid={props.model.modeluid}
                        setOpen={props.setOpen}
                    />
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}

