/**
 * @file src/components/Admin/Modeler/ImageSetForm.tsx
 * 
 * @fileoverview form for 3D modeler to enter image set data into the database
 */

'use client'

// Typical imports
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { useState, useContext, useEffect } from "react"
import { Button } from "@heroui/react"
import { ModelerContext } from "./ModelerDash"
import { imageInsertion, specimenWithImageSet, dataTransfer } from "@/ts/types"
import { insertImageSetIntoDatabase } from "@/functions/client/admin/modeler"
import { buttonEnable } from "@/functions/client/shared";

// Default imports
import Form from "@/components/Shared/Form"
import DateInput from "@/components/Shared/Form Fields/DateInput"
import TextInput from "@/components/Shared/Form Fields/TextInput"
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"


// Main JSX
export default function ImageSetForm(props: { specimen: specimenWithImageSet }) {

    // Context
    const context = useContext(ModelerContext) as dataTransfer
    const initializeTransfer = context.initializeDataTransferHandler
    const terminateTransfer = context.terminateDataTransferHandler

    // Form field states; entry button state
    const [photographyDate, setPhotograpyDate] = useState<string>()
    const [photographer, setPhotographer] = useState<string>('Hunter Phillips')
    const [numberOfImages, setNumberOfImages] = useState<string>('')

    // Image source, button state
    const url = props.specimen.photoUrl
    const [imgSrc, setImgSrc] = useState<string>(process.env.NEXT_PUBLIC_LOCAL ? `/api/nfs?path=X:${url.slice(11)}` : `/api/nfs?path=${url}`)
    const [isDisabled, setIsDisabled] = useState<boolean>(true)

    // Required values
    const requiredValues = [photographer, photographyDate, numberOfImages]

    // Specimen insertion handeler
    const insertImageDataHandler = async () => {

        // Image insertion object
        const insertObj: imageInsertion = {
            sid: props.specimen.sid,
            species: props.specimen.spec_name,
            acquisitionDate: props.specimen.spec_acquis_date,
            imagedBy: photographer,
            imagedDate: photographyDate as string,
            numberOfImages: numberOfImages
        }

        // Handle data transfer
        await dataTransferHandler(initializeTransfer, terminateTransfer, insertImageSetIntoDatabase, [insertObj], 'Entering image set into database')
    }

    // Button enabler effect
    useEffect(() => buttonEnable([photographer, photographyDate, numberOfImages], setIsDisabled), [requiredValues])

    return (
        <section className="flex justify-center w-full mb-6">
            <Form width='w-4/5'>
                <h1 className="text-3xl mb-2">{toUpperFirstLetter(props.specimen.spec_name)}</h1>
                <h2 className="mb-8">Date acquired: {props.specimen.spec_acquis_date.toDateString()}</h2>
                <div className="w-full h-[350px] mb-8">
                    <img className='h-full w-full' src={imgSrc} alt={`Photo of ${props.specimen.spec_name}`} onError={() => { setImgSrc('/noImage.png')} }/>
                </div>
                <TextInput value={photographer} setValue={setPhotographer} title='Photographer' required textSize="text-2xl" />
                <DateInput value={photographyDate} setValue={setPhotograpyDate} title='Photography Date' required />
                <TextInput value={numberOfImages} setValue={setNumberOfImages} title='Number of Images' required type='number' textSize="text-2xl" />
                <div>
                    <Button isDisabled={isDisabled} className="text-white text-xl mt-8 mb-6 bg-[#004C46]" onPress={insertImageDataHandler}>
                        Enter Image Set into Database
                    </Button>
                </div>
            </Form>
        </section>
    )
}