'use client'

import { Modal, ModalContent, ModalBody, ModalHeader, useDisclosure, Button, ModalFooter } from "@nextui-org/react"
import { ModelsWithTagsAndSoftware } from "@/api/types"
import { useRef, useState } from "react";
import ArtistName from "../ModelSubmit/ArtistNameField";
import SpeciesName from "../ModelSubmit/SpeciesNameField";
import ProcessSelect from "../ModelSubmit/ProcessSelectField";
import MobileSelect from "../ModelSubmit/MobileSelectField";
import Software from '../ModelSubmit/SoftwareField';
import AdditionalSoftware from "../ModelSubmit/AdditionalSoftwareField";
import TagInput from "../ModelSubmit/Tags";
import FormMap from "../Map/Form";
import Leaflet from 'leaflet';
import Delete from "./DeleteModal";
import { Spinner } from "@nextui-org/react";

export default function EditModal(props: { model: ModelsWithTagsAndSoftware }) {

    // Variable initialization
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const boolToString = props.model.createdWithMobile ? 'Yes' : 'No'

    const artistName = useRef<string>(props.model.artistName)
    const speciesName = useRef<string>(props.model.speciesName)
    const mobileValue = useRef<string>(boolToString)
    const methodValue = useRef<string>(props.model.methodology)
    const software = useRef<string>(props.model.software[0])
    const softwareArray = useRef<Array<string>>([...props.model.software].splice(1))
    const positionRef = useRef<any>({ lat: props.model.lat, lng: props.model.lng })
    const tagArray = useRef<{ value: string }[]>([])

    // Unlike their counterparts initialized above, these refs must have their 'current' values manually set
    software.current = props.model.software[0]
    softwareArray.current = [...props.model.software].splice(1)

    const [uploadDisabled, setUploadDisabled] = useState<boolean>(false)
    const [additionalSoftware, setAdditionalSoftware] = useState<number>(props.model.software.length - 1)
    const [position, setPosition] = useState<Leaflet.LatLngExpression | null>({ lat: props.model.lat, lng: props.model.lng })
    const [uploading, setUploading] = useState<boolean>(false)
    const [updateResult, setUpdateResult] = useState<string>('')
    const [uploadingModalOpen, setUploadingModalOpen] = useState<boolean>(false)

    const deleteObj = {
        type: 'delete',
        confirmation: props.model.confirmation,
        modelUid: props.model.modeluid
    }

    // Handler that enables the 'save changes' button
    const isSavable = () => {
        if (speciesName.current && artistName.current && mobileValue.current && methodValue.current && software.current) { setUploadDisabled(false) }
        else { setUploadDisabled(true) }
    }

    // Update model data
    const updateModelData = async () => {
        setUploading(true)

        try {

            //Add base software to beginning of software array
            softwareArray.current.unshift(software.current)

            await fetch('/api/editModel', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'update',
                    confirmation: props.model.confirmation,
                    artist: artistName.current,
                    species: speciesName.current,
                    method: methodValue.current,
                    mobile: mobileValue.current,
                    additionalSoftware: softwareArray.current,
                    position: positionRef.current,
                    software: softwareArray.current,
                    tags: tagArray.current,
                })
            }).then(res => res.json()).then(json => {
                setUploading(false)
                setUpdateResult(json.data)
                return json
            })
        }
        catch (e: any) {
            setUploading(false)
        }

    }

    // Uploading function called when 'save changes' is clicked
    const uploadingFn = () => {
        setUploadingModalOpen(true)
        updateModelData()
    }

    // Delete checker modal called when 'delete 3D model' is clicked
    const deleteCheck = () => {
        document.getElementById('openDeleteModal')?.click()
    }

    // Modal that appears when 'save changes' is clicked
    const UpdatingModal = () => {
        const { onOpenChange } = useDisclosure();
        return (
            <>
                <Modal isOpen={uploadingModalOpen} onOpenChange={onOpenChange} isDismissable={false}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalBody className="text-center">
                                    {
                                        uploading &&
                                        <Spinner label='Saving Changes' />

                                    }
                                    {
                                        !uploading &&
                                        <p>{updateResult}</p>
                                    }
                                </ModalBody>
                                <ModalFooter className="flex justify-center">
                                    {
                                        !uploading &&
                                        <a href="/dashboard"><Button color="primary">
                                            OK
                                        </Button>
                                        </a>
                                    }
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </>
        );
    }

    return (
        <>
            <UpdatingModal />
            <Delete {...deleteObj} />
            <Button className='hidden' id='editModal' onPress={onOpen}>Open Modal</Button>
            <Modal className='overflow-x-hidden bg-[#F5F3E7] dark:bg-[#181818]' isOpen={isOpen} onOpenChange={onOpenChange} size='2xl' scrollBehavior="outside" isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 mb-4">Editing: {props.model.speciesName}</ModalHeader>
                            <ModalBody>
                                <SpeciesName handler={isSavable} ref={speciesName} edit defaultValue={props.model.speciesName} />
                                <FormMap position={position} setPosition={setPosition} ref={positionRef} />
                                <TagInput defaultValues={props.model.tags} ref={tagArray} />
                                <ArtistName handler={isSavable} ref={artistName} edit defaultValue={props.model.artistName} />
                                <MobileSelect handler={isSavable} ref={mobileValue} defaultValue={boolToString} />
                                <ProcessSelect handler={isSavable} ref={methodValue} defaultValue={props.model.methodology} />
                                <Software handler={isSavable} ref={software} defaultValue={software.current} />
                                <AdditionalSoftware ref={softwareArray} handler={isSavable} stateVar={additionalSoftware} stateFn={setAdditionalSoftware} edit />
                            </ModalBody>
                            <ModalFooter className="flex justify-between">
                                <div>
                                    <Button color="primary" onPress={onClose} className="mr-2" id='editModalClose'>
                                        Cancel
                                    </Button>
                                    <Button
                                        isDisabled={uploadDisabled}
                                        color="primary" onPress={() => uploadingFn()}>
                                        Save Changes
                                    </Button>
                                </div>
                                <Button color="danger" variant="light" onClick={() => {
                                    deleteCheck()
                                }}>
                                    Delete 3D Model
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    );
}

