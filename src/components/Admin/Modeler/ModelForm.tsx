/**
 * @file src/components/Admin/Modeler/ImageSetForm.tsx
 * 
 * @fileoverview form for 3D modeler to enter image set data into the database
 */

'use client'

// Typical imports
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { useState, useContext, useEffect, SetStateAction, Dispatch } from "react"
import { Button } from "@nextui-org/react"
import { ModelerContext } from "./ModelerDash"
import { specimenWithImageSet, dataTransfer } from "@/ts/types"
import { buttonEnable } from "@/functions/client/shared";
import { insertModelIntoDatabase } from "@/functions/client/admin/modeler"
import { isZipFile } from "@/functions/client/utils/zip"

// Default imports
import Form from "@/components/Shared/Form"
import TextInput from "@/components/Shared/Form Fields/TextInput"
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"
import YesOrNo from "@/components/Shared/Form Fields/YesOrNo"
import ModelInput from "@/components/ModelSubmit/ModelInput"
import JSZip from "jszip"


// Main JSX
export default function ModelForm(props: { specimen: specimenWithImageSet }) {

    // Context
    const context = useContext(ModelerContext) as dataTransfer
    const initializeTransfer = context.initializeDataTransferHandler
    const terminateTransfer = context.terminateDataTransferHandler

    // Form field states
    const [commonName, setCommonName] = useState<string>('')
    const [modeler, setModeler] = useState<string>('Hunter Phillips')
    const [isViable, setIsViable] = useState<boolean>(false)
    const [isBase, setIsBase] = useState<boolean>(true)
    const [model, setModel] = useState<File>()
    const [height, setHeight] = useState<string>('')

    // Image source, button state
    const url = props.specimen.photoUrl
    const [imgSrc, setImgSrc] = useState<string>(process.env.NEXT_PUBLIC_LOCAL ? `/api/nfs?path=X:${url.slice(11)}` : `/api/nfs?path=${url}`)
    const [isDisabled, setIsDisabled] = useState<boolean>(true)

    // Required values
    const requiredValues = [commonName, modeler, model]

    // Model data insertion handeler
    const insertModelDataHandler = async () => {

        // Zip file if it isn't
        const zip = new JSZip()
        const _3dModel = model as File
        zip.file(_3dModel.name, _3dModel)
        const zippedModel = await isZipFile(_3dModel) ? _3dModel : await zip.generateAsync({ type: 'blob' })

        // Instantiate form data
        const data = new FormData()
        data.set('sid', props.specimen.sid)
        data.set('commonName', commonName)
        data.set('modeler', modeler)
        data.set('isViable', isViable ? "yes" : "no")
        data.set('isBase', isBase ? "yes" : "no")
        data.set('model', zippedModel, `${props.specimen.spec_name}.zip`)
        data.set('species', props.specimen.spec_name)
        data.set('height', height)

        // Handle data transfer
        await dataTransferHandler(initializeTransfer, terminateTransfer, insertModelIntoDatabase, [data], 'Entering 3D model into database')
    }

    // Button enabler effect
    useEffect(() => buttonEnable([modeler, commonName, model], setIsDisabled), [requiredValues])

    return <section className="flex justify-center w-full mb-6">
        <Form width='w-4/5'>
            <h1 className="text-3xl mb-8">{toUpperFirstLetter(props.specimen.spec_name)}</h1>
            <div className="w-full h-2/5 mb-8 max-h-[300px]">
                <img className='h-full w-full' src={imgSrc} alt={`Photo of ${props.specimen.spec_name}`} onError={() => setImgSrc('/noImage.png')} />
            </div>
            <TextInput value={modeler} setValue={setModeler} title='3D Modeler' required textSize="text-2xl" />
            <TextInput value={commonName} setValue={setCommonName} title='Common name' required textSize="text-2xl" />
            <YesOrNo value={isBase} setValue={setIsBase} title="Is this a base model?" required key={'select1'} />
            <YesOrNo value={isViable} setValue={setIsViable} title="Is the model viable?" required defaultNo key={'select2'} />
            <TextInput value={height} setValue={setHeight} title='Specimen height (cm)' type='number' textSize="text-2xl" maxWidth="max-w-[250px]" />
            <ModelInput setFile={setModel as Dispatch<SetStateAction<File>>} title="Zip your .obj, .mtl and texture files, then upload the .zip" yMargin="mb-8" />
            <div>
                <Button isDisabled={isDisabled} className="text-white text-xl mt-8 mb-6 bg-[#004C46]" onPress={insertModelDataHandler}>
                    Enter 3D Model into Database
                </Button>
            </div>
        </Form>
    </section>
}