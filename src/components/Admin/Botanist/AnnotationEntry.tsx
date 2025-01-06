'use client'

import { useState, useEffect, SetStateAction, Dispatch } from "react"
import { model_annotation, photo_annotation, video_annotation, model } from "@prisma/client"
import { Button } from "@nextui-org/react"
import DataTransferModal from "../../Shared/DataTransferModal"
import { v4 as uuidv4 } from 'uuid'
import TextInput from "../../Shared/TextInput"
import RadioButtons from "./AnnotationFields/RadioButtons"
import AnnotationReposition from "./AnnotationFields/AnnotationReposition"
import FileInput from "./AnnotationFields/FileInput"
import License from "./AnnotationFields/License"
import Annotation from "./AnnotationFields/Annotation"
import dynamic from "next/dynamic"
const ModelViewer = dynamic(() => import('../../Shared/ModelViewer'), { ssr: false })
import ModelAnnotationSelect from "./AnnotationFields/ModelAnnotationSelect"

const AnnotationEntry = (props: {
    activeAnnotation?: photo_annotation | video_annotation | model_annotation | undefined,
    specimenName?: string,
    annotationType?: string,
    index: number,
    new: boolean,
    setActiveAnnotationIndex: Dispatch<SetStateAction<number | 'new' | undefined>>,
    position: string | undefined,
    uid: string | undefined
    activeAnnotationPosition?: string
    setRepositionEnabled: Dispatch<SetStateAction<boolean>>
    repositionEnabled: boolean
    setPosition3D?: Dispatch<SetStateAction<string | undefined>>
    activeAnnotationTitle?: string
    setAnnotationSavedOrDeleted: Dispatch<SetStateAction<boolean>>
    annotationSavedOrDeleted: boolean
    annotationModels: model[]
}) => {

    /***** Variable declarations *****/

    // Lightweight functions used to enable annotation creation/save edits
    const allTruthy = (value: any) => value ? true : false
    const allSame = (originalValues: any[], currentValues: any[]) => JSON.stringify(originalValues) === JSON.stringify(currentValues) ? true : false
    const isNewPosition = props.position !== undefined ? true : false

    // Radio Buttons
    const [photoChecked, setPhotoChecked] = useState<boolean>()
    const [videoChecked, setVideoChecked] = useState<boolean>()
    const [urlChecked, setUrlChecked] = useState<boolean>()
    const [uploadChecked, setUploadChecked] = useState<boolean>()
    const [modelChecked, setModelChecked] = useState<boolean>()

    // Radio button resultant states
    const [annotationType, setAnnotationType] = useState<string>('')
    const [mediaType, setMediaType] = useState<string>()
    const [imageVisible, setImageVisible] = useState<boolean>()

    // Form fields
    const [annotationTitle, setAnnotationTitle] = useState<string>()
    const [url, setUrl] = useState<string>((props.activeAnnotation as photo_annotation)?.url ?? '')
    const [file, setFile] = useState<File>()
    const [author, setAuthor] = useState<string>((props.activeAnnotation as photo_annotation)?.author ?? '')
    const [license, setLicense] = useState<string>((props.activeAnnotation as photo_annotation)?.license ?? '')
    const [photoTitle, setPhotoTitle] = useState<string>((props.activeAnnotation as photo_annotation)?.title ?? '')
    const [website, setWebsite] = useState<string>((props.activeAnnotation as photo_annotation)?.website ?? '')
    const [annotation, setAnnotation] = useState<string>((props.activeAnnotation as photo_annotation)?.annotation ?? '')
    const [length, setLength] = useState<string>((props.activeAnnotation as video_annotation)?.length ?? '')
    const [imageSource, setImageSource] = useState<string>()
    const [modelAnnotationUid, setModelAnnotationUid] = useState<string>('select')


    // Data transfer modal states
    const [transferModalOpen, setTransferModalOpen] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [loadingLabel, setLoadingLabel] = useState<string>()

    // Save/Create button enabled state
    const [createDisabled, setCreateDisabled] = useState<boolean>(true)
    const [saveDisabled, setSaveDisabled] = useState<boolean>(true)

    // Set imgSrc from NFS storage
    const setImgSrc = async () => {
        const annotation = props.activeAnnotation as photo_annotation
        const path = process.env.NEXT_PUBLIC_LOCAL === 'true' ? `X:${annotation.url.slice(5)}` : `public${annotation.url}`
        setImageSource(`/api/annotations/photos?path=${path}`)
    }

    // This effect populates all relevant form fields with the corresponding data when there is an active annotation that has already been databased
    useEffect(() => {

        // Populate fields if there is an annotation pulled from the db
        if (props.annotationType && props.activeAnnotation) {
            const annotation = props.activeAnnotation as photo_annotation
            setAnnotationType(props.annotationType)
            setUrl(annotation.url)
            setAuthor(annotation.author)
            setLicense(annotation.license)
            setPhotoTitle(annotation.title as string)
            setWebsite(annotation.website as string)
            setAnnotation(annotation.annotation)
            setAnnotationTitle(props.activeAnnotationTitle)

            // Settings for hosted photo annotations
            if (props.annotationType == 'photo' && !props.new && (props.activeAnnotation as photo_annotation).url.startsWith('/data/Herbarium')) {
                setMediaType('upload')
                setVideoChecked(false)
                setPhotoChecked(true)
                setUrlChecked(false)
                setUploadChecked(true)
                setImgSrc()
            }
            // Settings for web based photo annotations
            else if (props.annotationType == 'photo') {
                setMediaType('url')
                setVideoChecked(false)
                setPhotoChecked(true)
                setUrlChecked(true)
                setUploadChecked(false)
                setImageSource((props.activeAnnotation as photo_annotation).url)
            }
            // Settings for video annotations
            else if (props.annotationType == 'video') {
                setMediaType('url')
                setVideoChecked(true)
                setPhotoChecked(false)
                setUrlChecked(true)
                setLength((props.activeAnnotation as video_annotation).length as string)
                setImageSource((props.activeAnnotation as video_annotation).url)
            }
            else if (props.annotationType == 'model') {
                setMediaType('model')
                setModelAnnotationUid((props.activeAnnotation as model_annotation).uid as string)
                setModelChecked(true)
                setVideoChecked(false)
                setPhotoChecked(false)
            }
        }
    }, [props.activeAnnotation]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect enables the 'save changes' button for databased annoations if all required fields are populated and at least one differs from the data from the database
    // For new annotations, it enables the 'create annotation' button if all required fields are populated
    useEffect(() => {

        if (props.index == 1) {
            if (props.position) {
                setCreateDisabled(false)
                setSaveDisabled(false)
            }
            else {
                setSaveDisabled(true)
                setCreateDisabled(true)
            }
        }

        // Conditional based on radio button states
        else if (annotationType == 'photo' && mediaType == 'url') {

            // Switch based on whether the annotation is new or databased
            switch (props.new) {

                // For databased annotations
                case false:
                    const caseAnnotation = props.activeAnnotation as photo_annotation
                    const originalValues = [props.activeAnnotationTitle, caseAnnotation.url, caseAnnotation.author, caseAnnotation.license, caseAnnotation.annotation]
                    const currentValues = [annotationTitle, url, author, license, annotation]
                    const originalOptionalValues = [caseAnnotation.title, caseAnnotation.website]
                    const optionalValues = [photoTitle, website]

                    if (currentValues.every(allTruthy) && !allSame(originalValues, currentValues) || isNewPosition && currentValues.every(allTruthy) || currentValues.every(allTruthy) && !allSame(originalOptionalValues, optionalValues)) setSaveDisabled(false)
                    else setSaveDisabled(true)

                    break

                // New annotations are the default
                default:

                    const valueArray = [annotationTitle, url, author, license, annotation, props.position]

                    if (valueArray.every(allTruthy)) setCreateDisabled(false)
                    else setCreateDisabled(true)

                    break
            }
        }

        // Conditional based on radio button states
        else if (annotationType == 'photo' && mediaType == 'upload') {

            switch (props.new) {

                // For databased annotations
                case false:
                    const caseAnnotation = props.activeAnnotation as photo_annotation
                    const originalValues = [props.activeAnnotationTitle, caseAnnotation.author, caseAnnotation.license, caseAnnotation.annotation]
                    const currentValues = [annotationTitle, author, license, annotation]
                    const originalOptionalValues = [caseAnnotation.title, caseAnnotation.website]
                    const optionalValues = [photoTitle, website]

                    if (currentValues.every(allTruthy) && !allSame(originalValues, currentValues) || currentValues.every(allTruthy) && file || isNewPosition && currentValues.every(allTruthy) || currentValues.every(allTruthy) && !allSame(originalOptionalValues, optionalValues)) setSaveDisabled(false)
                    else setSaveDisabled(true)

                    break

                // New annotations are the default
                default:
                    const valueArray = [annotationTitle, file, author, license, annotation, props.position]

                    if (valueArray.every(allTruthy)) setCreateDisabled(false)
                    else setCreateDisabled(true)

                    break
            }
        }

        // Conditional based on radio button states
        else if (annotationType == 'video') {

            switch (props.new) {

                case false:
                    const caseAnnotation = props.activeAnnotation as video_annotation
                    const originalValues = [props.activeAnnotationTitle, caseAnnotation.url, caseAnnotation.length]
                    const currentValues = [annotationTitle, url, length]

                    if (currentValues.every(allTruthy) && !allSame(originalValues, currentValues) || isNewPosition && currentValues.every(allTruthy)) setSaveDisabled(false)
                    else setSaveDisabled(true)

                    break

                default:
                    const valueArray = [annotationTitle, url, length, props.position]
                    if (valueArray.every(allTruthy)) setCreateDisabled(false)
                    else setCreateDisabled(true)

                    break
            }
        }

        // Conditional based on radio button states
        else if (annotationType == 'model') {

            switch (props.new) {

                case false:
                    const caseAnnotation = props.activeAnnotation as model_annotation
                    const originalValues = [props.activeAnnotationTitle, caseAnnotation.uid, caseAnnotation.annotation]
                    const currentValues = [annotationTitle, modelAnnotationUid, annotation]

                    if (currentValues.every(allTruthy) && !allSame(originalValues, currentValues) || isNewPosition && currentValues.every(allTruthy)) setSaveDisabled(false)
                    else setSaveDisabled(true)

                    break

                default:
                    const valueArray = [annotationTitle, modelAnnotationUid, annotation, props.position]
                    if (valueArray.every(allTruthy)) setCreateDisabled(false)
                    else setCreateDisabled(true)

                    break
            }
        }

    }, [annotationTitle, props.position, url, author, license, annotation, file, length, photoTitle, website, modelAnnotationUid]) // eslint-disable-line react-hooks/exhaustive-deps

    // This is the createAnnotaion function, calling the appropriate route handler when the 'save changes' button is depressed
    const createAnnotation = async () => {

        const data = new FormData()

        // Simple handler for the first annotation (always taxonomy and description)
        if (props.index == 1) {
            data.set('uid', props.uid as string)
            data.set('position', props.position as string)
            data.set('index', props.index.toString())

            // Open transfer modal and set spinner
            setTransferModalOpen(true)
            setTransferring(true)
            setLoadingLabel('Creating annotation...')

            // Fetch route handler - set modal result
            await fetch('/api/annotations', {
                method: 'POST',
                body: data
            }).then(res => res.json()).then(json => {
                setResult(json.data)
                setTransferring(false)
            })
        }

        // Handler for annotations with non-hosted photos
        else {

            // Annotations table data
            data.set('uid', props.uid as string)
            data.set('annotation_no', props.index.toString())
            data.set('annotation_type', annotationType)
            data.set('position', props.position as string)
            data.set('title', annotationTitle as string)

            // Set relevant data based on annotationType
            switch (annotationType) {

                case 'video':
                    // Video_annotation table data
                    data.set('length', length)

                    break

                case 'model':
                    // Model_annotation table data
                    data.set('modelAnnotationUid', modelAnnotationUid as string)
                    data.set('annotation', annotation)

                    break

                default:

                    // Photo_annotation table data
                    data.set('author', author)
                    data.set('license', license)
                    data.set('annotation', annotation)
                    data.set('annotator', 'Kat Lim')
                    if (photoTitle) data.set('photoTitle', photoTitle)
                    if (website) data.set('website', website)
            }

            // Shared data (url was formerly the foreign key)
            const annotationId = uuidv4()
            data.set('annotation_id', annotationId)

            if (!file) data.set('url', url)
            //
            else {
                data.set('dir', `public/data/Herbarium/Annotations/${props.uid}/${annotationId}`)
                data.set('path', `public/data/Herbarium/Annotations/${props.uid}/${annotationId}/${file.name}`)
                data.set('url', `/data/Herbarium/Annotations/${props.uid}/${annotationId}/${file.name}`)
            }

            // Route handler data
            data.set('mediaType', mediaType as string)
            if (file) data.set('file', file as File)

            // Open transfer modal and set spinner
            setTransferModalOpen(true)
            setTransferring(true)

            // Fetch route handler - set modal result
            await fetch('/api/annotations', {
                method: 'POST',
                body: data
            }).then(res => res.json()).then(json => {
                setResult(json.data)
                setTransferring(false)
                if (process.env.NODE_ENV === 'development') console.log(json.response)
            })
        }
    }

    // Update annotation function
    const updateAnnotation = async () => {
        const data = new FormData()

        // Simple handler for the first annotation (always taxonomy and description)
        if (props.index == 1) {
            data.set('uid', props.uid as string)
            data.set('position', props.position as string)
            data.set('index', props.index.toString())

            // Open transfer modal and set spinner
            setTransferModalOpen(true)
            setTransferring(true)
            setLoadingLabel('Updating annotation...')

            // Fetch route handler - set modal result
            await fetch('/api/annotations', {
                method: 'PATCH',
                body: data
            }).then(res => res.json()).then(json => {
                setResult(json.data)
                setTransferring(false)
            })
        }

        // Handler for annotations with non-hosted photos
        else {

            if (props.annotationType !== annotationType) {
                data.set('mediaTransition', 'true')
                data.set('previousMedia', props.annotationType as string)
            }

            // Annotations table data (for update)
            data.set('uid', props.uid as string)
            data.set('annotation_type', annotationType)
            data.set('position', props.position as string ?? props.activeAnnotationPosition)
            data.set('title', annotationTitle as string)

            // Set relevant data based on annotationType
            switch (annotationType) {

                case 'video':
                    // Video_annotation table data
                    data.set('length', length)

                    break

                case 'model':
                    // Model_annotation table data
                    data.set('modelAnnotationUid', modelAnnotationUid as string)
                    data.set('annotation', annotation)

                    break

                default:

                    // Photo_annotation table data
                    data.set('author', author)
                    data.set('license', license)
                    data.set('annotation', annotation)
                    data.set('annotator', 'Kat Lim')
                    if (photoTitle) data.set('photoTitle', photoTitle)
                    if (website) data.set('website', website)
            }

            // Shared data (url was formerly the foreign key)
            // Note that the url is the url necessary from the collections page; also note the old path must be inlcuded for deletion; also note that a new id is not generated for update
            data.set('annotation_id', (props.activeAnnotation as photo_annotation | video_annotation).annotation_id)

            if (!file || mediaType === 'url') data.set('url', url)
            else {
                data.set('specimenName', props.specimenName as string)
                data.set('dir', `public/data/Herbarium/Annotations/${props.uid}/${(props.activeAnnotation as photo_annotation | video_annotation).annotation_id}`)
                data.set('path', `public/data/Herbarium/Annotations/${props.uid}/${(props.activeAnnotation as photo_annotation | video_annotation).annotation_id}/${file.name}`)
                data.set('url', `/data/Herbarium/Annotations/${props.uid}/${(props.activeAnnotation as photo_annotation | video_annotation).annotation_id}/${file.name}`)
                // Temporary until database binaries are all eliminated/updated
                if ((props.activeAnnotation as photo_annotation | video_annotation).url.startsWith('/data'))
                    console.log(`public${data.get('oldUrl')}`)
                data.set('oldUrl', (props.activeAnnotation as photo_annotation | video_annotation).url)
            }

            // Route handler data
            data.set('mediaType', mediaType as string)
            if (file) data.set('file', file as File)

            // Open transfer modal and set spinner
            setTransferModalOpen(true)
            setTransferring(true)

            // Fetch route handler - set modal result
            await fetch('/api/annotations', {
                method: 'PATCH',
                body: data
            }).then(res => res.json()).then(json => {
                setResult(json.data)
                setTransferring(false)
                if (process.env.NODE_ENV === 'development') console.log(json.response)
            })
        }
    }

    // Delete annotation function
    const deleteAnnotation = async () => {

        // fetch obj
        const requestObj = {
            annotation_id: props.activeAnnotation?.annotation_id,
            modelUid: props.uid,
            path: (props.activeAnnotation as photo_annotation).url.startsWith('/data/Herbarium') ? `public/data/Herbarium/Annotations/${props.uid}/${props.activeAnnotation?.annotation_id}` : ''
        }

        // Open transfer modal and set spinner
        setTransferModalOpen(true)
        setTransferring(true)
        setLoadingLabel('Deleting annotation...')

        // Fetch delete, set modal states
        await fetch('/api/annotations', {
            method: 'DELETE',
            body: JSON.stringify(requestObj)
        }).then(res => res.json()).then(json => {
            setResult(json.data)
            setTransferring(false)
        })
    }

    // This effect updates annotation image visibility and source
    useEffect(() => {

        // This code shouldn't run for the first annotation
        if (props.index !== 1 && annotationType !== 'model') {

            // Show the new image if a new url is entered
            if (url && url !== imageSource && mediaType === 'url') {
                setImageSource(url)
            }

            // Determine image visibility
            if (annotationType === 'photo' && mediaType === 'url' && url) setImageVisible(true)

            else if (!props.new && mediaType === 'upload' && (props.activeAnnotation as photo_annotation).url && !file || !props.new && mediaType === 'url' && (props.activeAnnotation as photo_annotation).url && !url) {
                setImgSrc()
                setImageVisible(true)
            }

            else if (!props.new && mediaType === 'upload' && (props.activeAnnotation as photo_annotation).photo && !file || !props.new && mediaType === 'url' && (props.activeAnnotation as photo_annotation).photo && !url) {
                const base64String = Buffer.from((props.activeAnnotation as photo_annotation).photo as Buffer).toString('base64');
                const dataUrl = `data:image/jpeg;base64,${base64String}`
                setImageSource(dataUrl)
                setImageVisible(true)
            }

            else setImageVisible(false)

            if (url?.includes('https://www.youtube.com/embed/')) setImageVisible(false)
        }

    }, [props.new, annotationType, mediaType, url, props.activeAnnotation, props.index, file, imageSource])

    if (props.index == 1) {
        return (
            <>
                <DataTransferModal open={transferModalOpen} transferring={transferring} result={result} loadingLabel={loadingLabel as string} closeFn={props.setAnnotationSavedOrDeleted} closeVar={props.annotationSavedOrDeleted} />
                <div className="w-[98%] h-fit flex flex-col border border-[#004C46] dark:border-white mt-4 ml-[1%] rounded-xl">
                    <p className="text-2xl mb-4 mt-2 ml-12">Annotation {props.index} <span className="ml-8">(This annotation is always taxonomy and description)</span></p>
                    <section className="flex justify-between mt-4 mb-8">
                        {
                            !props.new &&
                            <>
                                <AnnotationReposition repositionEnabled={props.repositionEnabled} setRepositionEnabled={props.setRepositionEnabled} setPosition3D={props.setPosition3D as Dispatch<SetStateAction<string | undefined>>} />
                                <div>
                                    <Button onClick={() => updateAnnotation()} className="text-white text-lg mr-12" isDisabled={saveDisabled}>Save Changes</Button>
                                </div>
                            </>
                        }
                        {
                            props.new &&
                            <div className="flex justify-end w-full">
                                <Button onClick={() => createAnnotation()} className="text-white text-lg mr-12" isDisabled={createDisabled}>Create Annotation</Button>
                            </div>
                        }
                    </section>
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <DataTransferModal open={transferModalOpen} transferring={transferring} result={result} loadingLabel='Saving Changes' closeFn={props.setAnnotationSavedOrDeleted} closeVar={props.annotationSavedOrDeleted} />
                <div className="w-[98%] h-fit flex flex-col border border-[#004C46] dark:border-white mt-4 ml-[1%] rounded-xl">
                    <section className="flex justify-around">
                        {
                            !props.new &&
                            <AnnotationReposition repositionEnabled={props.repositionEnabled} setRepositionEnabled={props.setRepositionEnabled} setPosition3D={props.setPosition3D as Dispatch<SetStateAction<string | undefined>>} />
                        }
                        <p className="text-2xl mb-4 mt-2">Annotation {props.index}</p>
                        <section className="flex">
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center">
                                    <RadioButtons
                                        setAnnotationType={setAnnotationType}
                                        setPhotoChecked={setPhotoChecked as Dispatch<SetStateAction<boolean>>}
                                        setVideoChecked={setVideoChecked as Dispatch<SetStateAction<boolean>>}
                                        setMediaType={setMediaType as Dispatch<SetStateAction<string>>}
                                        setUploadChecked={setUploadChecked as Dispatch<SetStateAction<boolean>>}
                                        setUrlChecked={setUrlChecked as Dispatch<SetStateAction<boolean>>}
                                        setModelChecked={setModelChecked as Dispatch<SetStateAction<boolean>>}
                                        photoChecked={photoChecked as boolean}
                                        videoChecked={videoChecked as boolean}
                                        annotationType={annotationType}
                                        uploadChecked={uploadChecked as boolean}
                                        urlChecked={urlChecked as boolean}
                                        modelChecked={modelChecked as boolean}
                                    />
                                </div>
                            </div>
                        </section>
                    </section>
                    <section className="w-full h-fit">
                        {
                            annotationType == 'photo' && mediaType && ['url', 'upload'].includes(mediaType) &&
                            <section className="mt-4 w-full h-fit">
                                <div className="flex h-[530px]">
                                    <div className="flex flex-col w-1/2">
                                        <div className="ml-12">
                                            <TextInput value={annotationTitle as string} setValue={setAnnotationTitle as Dispatch<SetStateAction<string>>} title='Annotation Title' required />
                                        </div>
                                        {
                                            mediaType == 'url' &&
                                            <div className="ml-12">
                                                <TextInput value={url as string} setValue={setUrl} title='URL' required />
                                            </div>
                                        }
                                        {
                                            mediaType == 'upload' &&
                                            <div className="ml-12 mb-4">
                                                <FileInput setFile={setFile as Dispatch<SetStateAction<File>>} />
                                            </div>
                                        }
                                        <div className="ml-12">
                                            <TextInput value={author as string} setValue={setAuthor} title='Author' required />
                                            <License setLicense={setLicense} license={license} />
                                            <TextInput value={photoTitle as string} setValue={setPhotoTitle} title='Photo Title' />
                                            <TextInput value={website as string} setValue={setWebsite} title='Website' />
                                        </div>
                                    </div>
                                    {
                                        imageVisible &&
                                        <img className='rounded-sm inline-block w-1/2 max-w-[600px] h-full' src={imageSource as string} alt={'Annotation Image'}></img>
                                    }
                                </div>
                                <div className="ml-12">
                                    <Annotation annotation={annotation} setAnnotation={setAnnotation} />
                                </div>
                            </section>
                        }
                        {
                            annotationType == 'video' &&
                            <section className="flex my-12">
                                <div className="flex ml-12 mt-12 flex-col w-1/2 max-w-[750px]">
                                    <TextInput value={annotationTitle as string} setValue={setAnnotationTitle as Dispatch<SetStateAction<string>>} title='Annotation Title' required />
                                    <TextInput value={url as string} setValue={setUrl} title='URL' required />
                                    <TextInput value={length as string} setValue={setLength} title='Length' required />
                                </div>
                                <div className="flex h-[50vh] w-[45%]">
                                    {
                                        imageSource?.includes('https://www.youtube.com/embed/') &&
                                        <iframe
                                            src={imageSource}
                                            className="h-full w-full ml-[1%] rounded-xl"
                                        >
                                        </iframe>
                                    }
                                </div>
                            </section>
                        }
                        {
                            annotationType == 'model' &&
                            <section className="flex my-12 w-full">
                                <div className="flex ml-12 mt-12 flex-col w-3/5 max-w-[750px] mr-12">
                                    <TextInput value={annotationTitle as string} setValue={setAnnotationTitle as Dispatch<SetStateAction<string>>} title='Annotation Title' required />
                                    {/* <TextInput value={modelAnnotationUid as string} setValue={setModelAnnotationUid as Dispatch<SetStateAction<string>>} title='UID' required /> */}
                                    <ModelAnnotationSelect value={modelAnnotationUid} setValue={setModelAnnotationUid} modelAnnotations={props.annotationModels} />
                                    <Annotation annotation={annotation} setAnnotation={setAnnotation} />
                                </div>
                                {
                                    modelAnnotationUid && modelAnnotationUid !== 'select' &&
                                    <div className="w-1/3">
                                        <ModelViewer uid={modelAnnotationUid} />
                                    </div>
                                }
                            </section>
                        }
                    </section>
                    <section className="flex justify-end mb-8">
                        {
                            props.new &&
                            <>
                                <Button onClick={() => createAnnotation()} className="text-white text-lg mr-8" isDisabled={createDisabled}>Create Annotation</Button>
                            </>
                        }
                        {
                            !props.new && props.index !== 1 &&
                            <div>
                                <Button onClick={() => updateAnnotation()} className="text-white text-lg mr-2" isDisabled={saveDisabled}>Save Changes</Button>
                                <Button onClick={() => deleteAnnotation()} color="danger" variant="light" className="mr-2">Delete Annotation</Button>
                            </div>
                        }

                    </section>
                </div>
            </>
        )
    }
}
export default AnnotationEntry
