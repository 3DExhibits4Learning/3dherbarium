/**
 * @file src/components/Admin/Botanist/AnnotationEntry.tsx
 * 
 * @fileoverview annotation entry client for botany assistant
 * 
 * @todo refactor, test
 */

'use client'

// Typical imports
import { useState, useEffect, SetStateAction, Dispatch, useContext, useReducer, createContext } from "react"
import { model_annotation, photo_annotation, video_annotation, model } from "@prisma/client"
import { Button } from "@nextui-org/react"
import { v4 as uuidv4 } from 'uuid'
import { BotanyClientContext } from "./BotanyClient"
import { annotationEntryContext, botanyClientContext, initialAnnotationEntryState } from "@/ts/botanist"
import { arrStrCompare } from "@/functions/client/shared"

// Default imports
import TextInput from "../../Shared/TextInput"
import RadioButtons from "./AnnotationFields/RadioButtons"
import AnnotationReposition from "./AnnotationFields/AnnotationReposition"
import FileInput from "./AnnotationFields/FileInput"
import License from "./AnnotationFields/License"
import Annotation from "./AnnotationFields/Annotation"
import dynamic from "next/dynamic"
import ModelAnnotationSelect from "./AnnotationFields/ModelAnnotationSelect"
import annotationEntryReducer from "@/functions/client/reducers/annotationEntryReducer"

// Dymamic imports
const ModelViewer = dynamic(() => import('../../Shared/ModelViewer'), { ssr: false })

// Exported context
export const AnnotationEntryContext = createContext<annotationEntryContext | ''>('')

// Main JSX
const AnnotationEntry = (props: { index: number, annotationModels: model[] }) => {

    // Context
    const context = useContext(BotanyClientContext) as botanyClientContext
    const botanyState = context.botanyState
    const initializeDataTransfer = context.initializeDataTransferHandler
    const terminateDataTransfer = context.terminateDataTransferHandler

    // New annotation? New Postiion?
    const isNew = botanyState.activeAnnotationIndex === 'new' ? true : false
    const isNewPosition = botanyState.position3D !== undefined ? true : false

    // Annotation entry state object
    const annotationEntryState = {
        ...initialAnnotationEntryState,
        annotationType: botanyState.activeAnnotationType ?? '',
        url: (botanyState.activeAnnotation as photo_annotation)?.url ?? '',
        author: (botanyState.activeAnnotation as photo_annotation)?.author ?? '',
        license: (botanyState.activeAnnotation as photo_annotation)?.license ?? '',
        photoTitle: (botanyState.activeAnnotation as photo_annotation)?.title ?? '',
        website: (botanyState.activeAnnotation as photo_annotation)?.website ?? '',
        annotation: (botanyState.activeAnnotation as photo_annotation)?.annotation ?? '',
        length: (botanyState.activeAnnotation as video_annotation)?.length ?? '',
    }

    // Reducer 
    const [annotationState, annotationDispatch] = useReducer(annotationEntryReducer, annotationEntryState)

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
    const [url, setUrl] = useState<string>((botanyState.activeAnnotation as photo_annotation)?.url ?? '')
    const [file, setFile] = useState<File>()
    const [author, setAuthor] = useState<string>((botanyState.activeAnnotation as photo_annotation)?.author ?? '')
    const [license, setLicense] = useState<string>((botanyState.activeAnnotation as photo_annotation)?.license ?? '')
    const [photoTitle, setPhotoTitle] = useState<string>((botanyState.activeAnnotation as photo_annotation)?.title ?? '')
    const [website, setWebsite] = useState<string>((botanyState.activeAnnotation as photo_annotation)?.website ?? '')
    const [annotation, setAnnotation] = useState<string>((botanyState.activeAnnotation as photo_annotation)?.annotation ?? '')
    const [length, setLength] = useState<string>((botanyState.activeAnnotation as video_annotation)?.length ?? '')
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
        const url = (botanyState.activeAnnotation as photo_annotation).url
        const path = process.env.NEXT_PUBLIC_LOCAL ? `X:${url.slice(5)}` : `public${url}`
        setImageSource(`/api/nfs?path=${path}`)
        annotationDispatch({type:'setStringValue', field: 'imageSource', value: `/api/nfs?path=${path}`})
    }

    // This effect populates all relevant form fields with the corresponding data when there is an active annotation that has already been databased
    useEffect(() => {

        if (botanyState.activeAnnotationType && botanyState.activeAnnotation) {

            setAnnotationTitle(botanyState.activeAnnotationTitle)

            switch (botanyState.activeAnnotationType) {

                case 'video':
                    const videoAnnotation = botanyState.activeAnnotation as video_annotation

                    setVideoChecked(true)
                    setPhotoChecked(false)
                    setUrlChecked(true)
                    setMediaType('url')
                    setUrl(videoAnnotation.url)
                    setLength(videoAnnotation.length as string)
                    setImageSource(videoAnnotation.url)
                    annotationDispatch({type:'activeAnnotationIsVideo', annotation: botanyState.activeAnnotation as video_annotation, annotationTitle: botanyState.activeAnnotationTitle as string})

                    break

                case 'model':
                    const modelAnnotation = botanyState.activeAnnotation as model_annotation
                    setMediaType('model')
                    setAnnotation(modelAnnotation.annotation)
                    setModelAnnotationUid(modelAnnotation.uid as string)
                    setModelChecked(true)
                    setVideoChecked(false)
                    setPhotoChecked(false)

                    break

                default:

                    const annotation = botanyState.activeAnnotation as photo_annotation

                    setPhotoChecked(true)
                    setVideoChecked(false)
                    setModelChecked(false)
                    setAuthor(annotation.author)
                    setLicense(annotation.license)
                    setPhotoTitle(annotation.title as string)
                    setWebsite(annotation.website as string)
                    setAnnotation(annotation.annotation)

                    if (!isNew && (botanyState.activeAnnotation as photo_annotation).url.startsWith('/data/Herbarium')) {
                        setMediaType('upload')
                        setUrlChecked(false)
                        setUploadChecked(true)
                        setImgSrc()
                    }

                    else {
                        setMediaType('url')
                        setUrlChecked(true)
                        setUploadChecked(false)
                        setImageSource((botanyState.activeAnnotation as photo_annotation).url)
                    }

                    break
            }
        }
    }, [botanyState.activeAnnotation]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect enables the 'save changes' button for databased annoations if all required fields are populated and at least one differs from the data from the database
    // For new annotations, it enables the 'create annotation' button if all required fields are populated
    useEffect(() => {

        if (props.index == 1) {
            if (botanyState.position3D) {
                setCreateDisabled(false)
                setSaveDisabled(false)
            }
            else {
                setSaveDisabled(true)
                setCreateDisabled(true)
            }
        }

        // Conditional based on radio button states
        else if (botanyState.activeAnnotationType == 'photo' && mediaType == 'url') {

            // Switch based on whether the annotation is new or databased
            switch (isNew) {

                // For databased annotations
                case false:
                    const caseAnnotation = botanyState.activeAnnotation as photo_annotation
                    const originalValues = [botanyState.activeAnnotationTitle, caseAnnotation.url, caseAnnotation.author, caseAnnotation.license, caseAnnotation.annotation]
                    const currentValues = [annotationTitle, url, author, license, annotation]
                    const originalOptionalValues = [caseAnnotation.title, caseAnnotation.website]
                    const optionalValues = [photoTitle, website]

                    if (currentValues.every(value => value) && !arrStrCompare(originalValues, currentValues) || isNewPosition && currentValues.every(value => value) || currentValues.every(value => value) && !arrStrCompare(originalOptionalValues, optionalValues)) setSaveDisabled(false)
                    else setSaveDisabled(true)

                    break

                // New annotations are the default
                default:

                    const valueArray = [annotationTitle, url, author, license, annotation, botanyState.position3D]

                    if (valueArray.every(value => value)) setCreateDisabled(false)
                    else setCreateDisabled(true)

                    break
            }
        }

        // Conditional based on radio button states
        else if (botanyState.activeAnnotationType == 'photo' && mediaType == 'upload') {

            switch (isNew) {

                // For databased annotations
                case false:
                    const caseAnnotation = botanyState.activeAnnotation as photo_annotation
                    const originalValues = [botanyState.activeAnnotationTitle, caseAnnotation.author, caseAnnotation.license, caseAnnotation.annotation]
                    const currentValues = [annotationTitle, author, license, annotation]
                    const originalOptionalValues = [caseAnnotation.title, caseAnnotation.website]
                    const optionalValues = [photoTitle, website]

                    if (currentValues.every(value => value) && !arrStrCompare(originalValues, currentValues) || currentValues.every(value => value) && file || isNewPosition && currentValues.every(value => value) || currentValues.every(value => value) && !arrStrCompare(originalOptionalValues, optionalValues)) setSaveDisabled(false)
                    else setSaveDisabled(true)

                    break

                // New annotations are the default
                default:
                    const valueArray = [annotationTitle, file, author, license, annotation, botanyState.position3D]

                    if (valueArray.every(value => value)) setCreateDisabled(false)
                    else setCreateDisabled(true)

                    break
            }
        }

        // Conditional based on radio button states
        else if (botanyState.activeAnnotationType == 'video') {

            switch (isNew) {

                case false:
                    const caseAnnotation = botanyState.activeAnnotation as video_annotation
                    const originalValues = [botanyState.activeAnnotationTitle, caseAnnotation.url, caseAnnotation.length]
                    const currentValues = [annotationTitle, url, length]

                    if (currentValues.every(value => value) && !arrStrCompare(originalValues, currentValues) || isNewPosition && currentValues.every(value => value)) setSaveDisabled(false)
                    else setSaveDisabled(true)

                    break

                default:
                    const valueArray = [annotationTitle, url, length, botanyState.position3D]
                    if (valueArray.every(value => value)) setCreateDisabled(false)
                    else setCreateDisabled(true)

                    break
            }
        }

        // Conditional based on radio button states
        else if (botanyState.activeAnnotationType == 'model') {

            switch (isNew) {

                case false:
                    const caseAnnotation = botanyState.activeAnnotation as model_annotation
                    const originalValues = [botanyState.activeAnnotationTitle, caseAnnotation.uid, caseAnnotation.annotation]
                    const currentValues = [annotationTitle, modelAnnotationUid, annotation]

                    if (currentValues.every(value => value) && !arrStrCompare(originalValues, currentValues) || isNewPosition && currentValues.every(value => value)) setSaveDisabled(false)
                    else setSaveDisabled(true)

                    break

                default:
                    const valueArray = [annotationTitle, modelAnnotationUid, annotation, botanyState.position3D]
                    if (valueArray.every(value => value)) setCreateDisabled(false)
                    else setCreateDisabled(true)

                    break
            }
        }

    }, [annotationTitle, botanyState.position3D, url, author, license, annotation, file, length, photoTitle, website, modelAnnotationUid]) // eslint-disable-line react-hooks/exhaustive-deps

    // This is the createAnnotaion function, calling the appropriate route handler when the 'save changes' button is depressed
    const createAnnotation = async () => {

        const data = new FormData()

        // Simple handler for the first annotation (always taxonomy and description)
        if (props.index == 1) {
            data.set('uid', botanyState.uid as string)
            data.set('position', botanyState.position3D as string)
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
            data.set('uid', botanyState.uid as string)
            data.set('annotation_no', props.index.toString())
            data.set('annotation_type', botanyState.activeAnnotationType as 'photo' | 'model' | 'video')
            data.set('position', botanyState.position3D as string)
            data.set('title', annotationTitle as string)

            // Set relevant data based on botanyState.activeAnnotationType
            switch (botanyState.activeAnnotationType) {

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
                data.set('dir', `public/data/Herbarium/Annotations/${botanyState.uid}/${annotationId}`)
                data.set('path', `public/data/Herbarium/Annotations/${botanyState.uid}/${annotationId}/${file.name}`)
                data.set('url', `/data/Herbarium/Annotations/${botanyState.uid}/${annotationId}/${file.name}`)
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
            data.set('uid', botanyState.uid as string)
            data.set('position', botanyState.position3D as string)
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

            if (botanyState.activeAnnotationType !== botanyState.activeAnnotationType) {
                data.set('mediaTransition', 'true')
                data.set('previousMedia', botanyState.activeAnnotationType as string)
            }

            // Annotations table data (for update)
            data.set('uid', botanyState.uid as string)
            data.set('annotation_type', botanyState.activeAnnotationType as 'photo' | 'model' | 'video')
            data.set('position', botanyState.position3D as string ?? botanyState.activeAnnotationPosition)
            data.set('title', annotationTitle as string)

            // Set relevant data based on botanyState.activeAnnotationType
            switch (botanyState.activeAnnotationType) {

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
            data.set('annotation_id', (botanyState.activeAnnotation as photo_annotation | video_annotation).annotation_id)

            if (!file || mediaType === 'url') data.set('url', url)
            else {
                data.set('specimenName', botanyState.specimenName as string)
                data.set('dir', `public/data/Herbarium/Annotations/${botanyState.uid}/${(botanyState.activeAnnotation as photo_annotation | video_annotation).annotation_id}`)
                data.set('path', `public/data/Herbarium/Annotations/${botanyState.uid}/${(botanyState.activeAnnotation as photo_annotation | video_annotation).annotation_id}/${file.name}`)
                data.set('url', `/data/Herbarium/Annotations/${botanyState.uid}/${(botanyState.activeAnnotation as photo_annotation | video_annotation).annotation_id}/${file.name}`)
                // Temporary until database binaries are all eliminated/updated
                if ((botanyState.activeAnnotation as photo_annotation | video_annotation).url.startsWith('/data'))
                    console.log(`public${data.get('oldUrl')}`)
                data.set('oldUrl', (botanyState.activeAnnotation as photo_annotation | video_annotation).url)
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
            annotation_id: botanyState.activeAnnotation?.annotation_id,
            modelUid: botanyState.uid,
            path: (botanyState.activeAnnotation as photo_annotation).url.startsWith('/data/Herbarium') ? `public/data/Herbarium/Annotations/${botanyState.uid}/${botanyState.activeAnnotation?.annotation_id}` : ''
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
        if (props.index !== 1 && botanyState.activeAnnotationType !== 'model') {

            // Show the new image if a new url is entered
            if (url && url !== imageSource && mediaType === 'url') {
                setImageSource(url)
            }

            // Determine image visibility
            if (botanyState.activeAnnotationType === 'photo' && mediaType === 'url' && url) setImageVisible(true)

            else if (!isNew && mediaType === 'upload' && (botanyState.activeAnnotation as photo_annotation).url && !file || !isNew && mediaType === 'url' && (botanyState.activeAnnotation as photo_annotation).url && !url) {
                setImgSrc()
                setImageVisible(true)
            }

            else if (!isNew && mediaType === 'upload' && (botanyState.activeAnnotation as photo_annotation).photo && !file || !isNew && mediaType === 'url' && (botanyState.activeAnnotation as photo_annotation).photo && !url) {
                const base64String = Buffer.from((botanyState.activeAnnotation as photo_annotation).photo as Buffer).toString('base64');
                const dataUrl = `data:image/jpeg;base64,${base64String}`
                setImageSource(dataUrl)
                setImageVisible(true)
            }

            else setImageVisible(false)

            if (url?.includes('https://www.youtube.com/embed/')) setImageVisible(false)
        }

    }, [isNew, botanyState.activeAnnotationType, mediaType, url, botanyState.activeAnnotation, props.index, file, imageSource])

    if (props.index === 1) {
        return (
            <AnnotationEntryContext.Provider value={{annotationState, annotationDispatch}}>
                <div className="w-[98%] h-fit flex flex-col border border-[#004C46] dark:border-white mt-4 ml-[1%] rounded-xl">
                    <p className="text-2xl mb-4 mt-2 ml-12">Annotation {props.index} <span className="ml-8">(This annotation is always taxonomy and description)</span></p>
                    <section className="flex justify-between mt-4 mb-8">
                        {
                            !isNew &&
                            <>
                                <AnnotationReposition />
                                <div>
                                    <Button onClick={() => updateAnnotation()} className="text-white text-lg mr-12" isDisabled={saveDisabled}>Save Changes</Button>
                                </div>
                            </>
                        }
                        {
                            isNew &&
                            <div className="flex justify-end w-full">
                                <Button onClick={() => createAnnotation()} className="text-white text-lg mr-12" isDisabled={createDisabled}>Create Annotation</Button>
                            </div>
                        }
                    </section>
                </div>
            </AnnotationEntryContext.Provider>
        )
    }
    else {
        return (
            <AnnotationEntryContext.Provider value={{annotationState, annotationDispatch}}>
                <div className="w-[98%] h-fit flex flex-col border border-[#004C46] dark:border-white mt-4 ml-[1%] rounded-xl">
                    <section className="flex justify-around">
                        {
                            !isNew &&
                            <AnnotationReposition />
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
                                        annotationType={botanyState.activeAnnotationType as 'photo' | 'model' | 'video'}
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
                            botanyState.activeAnnotationType == 'photo' && mediaType && ['url', 'upload'].includes(mediaType) &&
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
                            botanyState.activeAnnotationType == 'video' &&
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
                            botanyState.activeAnnotationType == 'model' &&
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
                            isNew &&
                            <>
                                <Button onClick={() => createAnnotation()} className="text-white text-lg mr-8" isDisabled={createDisabled}>Create Annotation</Button>
                            </>
                        }
                        {
                            !isNew && props.index !== 1 &&
                            <div>
                                <Button onClick={() => updateAnnotation()} className="text-white text-lg mr-2" isDisabled={saveDisabled}>Save Changes</Button>
                                <Button onClick={() => deleteAnnotation()} color="danger" variant="light" className="mr-2">Delete Annotation</Button>
                            </div>
                        }
                    </section>
                </div>
            </AnnotationEntryContext.Provider>
        )
    }
}
export default AnnotationEntry


