/**
 * @file src/components/Admin/Modeler/ImageSetForm.tsx
 * 
 * @fileoverview form for 3D modeler to enter image set data into the database
 */

'use client'

// Typical imports
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter"
import { useState, useContext, useEffect } from "react"
import { Button } from "@nextui-org/react"
import { ModelerContext } from "./ModelerDash"
import { imageInsertion, specimenWithImageSet, dataTransfer } from "@/api/types"
import { insertImageSetIntoDatabase, setImageSource } from "@/functions/client/admin/modeler"
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
    const [photographer, setPhotographer] = useState<string>('')
    const [numberOfImages, setNumberOfImages] = useState<string>('')
    const [isDisabled, setIsDisabled] = useState<boolean>(true)
    const [imgSrc, setImgSrc] = useState<any>()

    // Required values
    const requiredValues = [photographer, photographyDate, numberOfImages]

    // Async fn wrapper for effect
    const imgSrcWrapper = () => { setImageSource(setImgSrc, props.specimen.photoUrl.slice(6)) }

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
    useEffect(() => imgSrcWrapper(), [])

    return (
        <section className="flex justify-center w-full">
            <Form width='w-4/5'>
                <h1 className="text-3xl mb-8">{toUpperFirstLetter(props.specimen.spec_name)}</h1>
                <div className="w-full h-2/5 mb-8">
                    <img className='h-full w-full' src={imgSrc} alt={`Photo of ${props.specimen.spec_name}`} />
                </div>
                <DateInput value={photographyDate} setValue={setPhotograpyDate} title='Photography Date' required />
                <TextInput value={photographer} setValue={setPhotographer} title='Photographer' required textSize="text-2xl" />
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