'use client'

import { Accordion, AccordionItem } from "@nextui-org/react"
import { useEffect, useState, useRef, useDebugValue } from "react"
import { model } from "@prisma/client"
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter"
import AnnotationEntry from "./AnnotationEntry"
import { Button } from "@nextui-org/react"
import { photo_annotation, video_annotation, model_annotation } from "@prisma/client"
import ModelAnnotations from "@/utils/ModelAnnotationsClass"
import { fullAnnotation } from "@/api/types"
import BotanistRefWrapper from "./BotanistModelViewerRef"
import AreYouSure from "../Shared/AreYouSure"

export default function BotanyClient(props: { modelsToAnnotate: model[], annotationModels: model[] }) {

    // Variable declarations
    const [uid, setUid] = useState<string>()
    const [annotations, setAnnotations] = useState<fullAnnotation[]>()
    const [numberOfAnnotations, setNumberOfAnnotations] = useState<number>()
    const [activeAnnotationIndex, setActiveAnnotationIndex] = useState<number | 'new' | undefined>()
    const [activeAnnotation, setActiveAnnotation] = useState<photo_annotation | video_annotation | model_annotation | undefined>()
    const [activeAnnotationType, setActiveAnnotationType] = useState<'photo' | 'video' | 'model'>()
    const [position3D, setPosition3D] = useState<string>()
    const [firstAnnotationPosition, setFirstAnnotationPostion] = useState<string>()
    const [newAnnotationEnabledState, setNewAnnotationEnabledState] = useState<boolean>(false)
    const [specimenName, setSpecimenName] = useState<string>()
    const [cancelledAnnotation, setCancelledAnnotation] = useState<boolean>()
    const [activeAnnotationPosition, setActiveAnnotationPosition] = useState<string>()
    const [repositionEnabled, setRepositionEnabled] = useState<boolean>(false)
    const [activeAnnotationTitle, setActiveAnnotationTitle] = useState<string>()
    const [annotationSavedOrDeleted, setAnnotationSavedOrDeleted] = useState<boolean>(false)
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const modelClicked = useRef<boolean>()
    const newAnnotationEnabled = useRef<boolean>(false)

    // Returns the index(annotation_no in the annotations table) of the activeAnnotation
    const getIndex = () => {
        let index

        if (!numberOfAnnotations && !firstAnnotationPosition || activeAnnotationIndex == 1) index = 1
        else if (!numberOfAnnotations) index = 2
        else if (numberOfAnnotations && activeAnnotationIndex != 'new') index = activeAnnotationIndex
        else if (activeAnnotationIndex == 'new') index = numberOfAnnotations + 2

        return index
    }

    // This effect sets the activeAnnotation when its dependency is changed from the BotanistModelViewer, either via clicking an annotation or creating a new one
    useEffect(() => {

        if (activeAnnotationIndex == 1) {
            setActiveAnnotation(undefined)
            setActiveAnnotationType(undefined)
            setActiveAnnotationPosition(undefined)
        }
        
        else if (typeof (activeAnnotationIndex) === 'number' && annotations) {
            setActiveAnnotationType(annotations[activeAnnotationIndex - 2].annotation_type as 'photo' | 'video')
            setActiveAnnotationPosition((annotations[activeAnnotationIndex - 2].position) as string)
            setNewAnnotationEnabledState(false)
            setRepositionEnabled(false)
            setActiveAnnotationTitle(annotations[activeAnnotationIndex - 2].title ?? '')
            setActiveAnnotation(annotations[activeAnnotationIndex - 2].annotation)
        }

    }, [activeAnnotationIndex]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // Set relevant model data; this is called onPress of the Accordion

        const getAnnotationsObj = async () => {
            const modelAnnotations = await ModelAnnotations.retrieve(uid as string)
            let annotationPosition

            await fetch(`/api/annotations?uid=${uid}`, { cache: 'no-store' })
                .then(res => res.json()).then(json => {
                    if (json.response) annotationPosition = JSON.parse(json.response)
                    else annotationPosition = ''
                })

            setAnnotations(modelAnnotations.annotations)
            setNumberOfAnnotations(modelAnnotations.annotations.length)
            setActiveAnnotationIndex(undefined)
            setPosition3D(undefined)
            setNewAnnotationEnabledState(false)
            newAnnotationEnabled.current = false
            setFirstAnnotationPostion(annotationPosition)
            setActiveAnnotation(undefined)
            setRepositionEnabled(false)
        }
        
        getAnnotationsObj()

    }, [uid, annotationSavedOrDeleted])

    return (
        <>
            <AreYouSure uid={uid as string} open={modalOpen} setOpen={setModalOpen} species={specimenName as string} />
            <div className="flex w-full h-full">
                <section className="h-full w-1/5">

                    {/* Accordion holds all models than need annotation */}

                    <Accordion className="h-full" onSelectionChange={(keys: any) => modelClicked.current = keys.size ? true : false}>
                        {props.modelsToAnnotate.map((model, i) => {
                            return (
                                <AccordionItem
                                    key={i}
                                    aria-label={'Specimen to model'}
                                    title={toUpperFirstLetter(model.spec_name)}
                                    classNames={{ title: 'text-[ #004C46] text-2xl' }}
                                    onPress={() => {
                                        if (modelClicked.current) {
                                            // First annotation position MUST be loaded before BotanistRefWrapper, so it is set to undefined while model data is set - note conditional render below
                                            setFirstAnnotationPostion(undefined)
                                            setSpecimenName(model.spec_name)
                                            setUid(model.uid)
                                        }
                                        else setUid(undefined)
                                    }}
                                >
                                    {/* Conditional render that waits until the first annotation(thus all annotations) is loaded*/}
                                    {/* RefWrapper required to pass ref to dynamically imported component*/}

                                    {
                                        firstAnnotationPosition != undefined &&
                                        <div className="h-[400px]">
                                            <BotanistRefWrapper
                                                uid={model.uid}
                                                setActiveAnnotationIndex={setActiveAnnotationIndex}
                                                setPosition3D={setPosition3D}
                                                firstAnnotationPosition={firstAnnotationPosition}
                                                position3D={position3D}
                                                annotations={annotations}
                                                cancelledAnnotation={cancelledAnnotation}
                                                activeAnnotationIndex={activeAnnotationIndex}
                                                newAnnotationEnabledState={newAnnotationEnabledState}
                                                repositionEnabled={repositionEnabled}
                                                ref={newAnnotationEnabled}
                                                annotationSavedOrDeleted={annotationSavedOrDeleted}
                                            />
                                        </div>
                                    }

                                    {/* New annotation button */}

                                    {
                                        !newAnnotationEnabledState && activeAnnotationIndex != 'new' && firstAnnotationPosition != undefined &&
                                        <Button onPress={() => {
                                            newAnnotationEnabled.current = true
                                            setNewAnnotationEnabledState(true)
                                            setActiveAnnotationIndex('new')
                                            setRepositionEnabled(false)
                                        }}
                                            className="text-white mt-2 text-lg"
                                            isDisabled={repositionEnabled}
                                        >
                                            + New Annotation
                                        </Button>
                                    }

                                    {
                                        annotations && annotations?.length >= 6 &&
                                        <>
                                            <br></br>
                                            <Button onPress={() => {
                                                setModalOpen(true)
                                            }}
                                                className="text-white mt-2 text-lg"
                                                isDisabled={repositionEnabled}
                                            >
                                                Mark as Annotated
                                            </Button>
                                        </>
                                    }

                                    {/* Click to place annotation or cancel*/}

                                    {
                                        newAnnotationEnabledState &&
                                        <div className="flex justify-center flex-col items-center">
                                            <p className="text-lg text-center">Click the subject to add an annotation</p>
                                            <p className="text-lg">or</p>
                                            <Button
                                                color="danger"
                                                variant="light"
                                                className="text-red-600 hover:text-white text-lg"
                                                onPress={() => {
                                                    newAnnotationEnabled.current = false
                                                    setNewAnnotationEnabledState(false)
                                                    setActiveAnnotationIndex(undefined)
                                                    setCancelledAnnotation(!cancelledAnnotation)
                                                }}
                                            >
                                                Cancel Annotation
                                            </Button>
                                        </div>
                                    }
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </section>
                <div className="flex flex-col w-4/5">
                    <section className="flex w-full h-full flex-col">

                        {
                            !uid && !activeAnnotation &&
                            <div className="flex items-center justify-center text-xl h-full w-full">
                                <p className="mr-[10%] text-lg lg:text-3xl">Select a 3D model to get started!</p>
                            </div>
                        }

                        {
                            uid && !activeAnnotation && activeAnnotationIndex !== 1 && !newAnnotationEnabledState &&
                            <div className="flex items-center justify-center text-xl h-full w-full">
                                <p className="mr-[10%] text-lg lg:text-3xl">Select an annotation to edit, or click New Annotation</p>
                            </div>
                        }

                        {
                            activeAnnotationIndex == 1 && // This indicates the first annotation
                            <AnnotationEntry
                                index={getIndex() as number}
                                new={false}
                                setActiveAnnotationIndex={setActiveAnnotationIndex}
                                position={position3D}
                                uid={uid}
                                specimenName={specimenName}
                                setRepositionEnabled={setRepositionEnabled}
                                repositionEnabled={repositionEnabled}
                                setPosition3D={setPosition3D}
                                setAnnotationSavedOrDeleted={setAnnotationSavedOrDeleted}
                                annotationSavedOrDeleted={annotationSavedOrDeleted}
                                annotationModels={props.annotationModels}
                            />
                        }

                        {
                            typeof (activeAnnotationIndex) == 'number' && activeAnnotation && annotations && uid && // This indicates a databased annotation
                            <AnnotationEntry
                                index={getIndex() as number}
                                activeAnnotation={activeAnnotation}
                                specimenName={specimenName}
                                annotationType={activeAnnotationType}
                                new={false} setActiveAnnotationIndex={setActiveAnnotationIndex}
                                position={position3D}
                                uid={uid}
                                activeAnnotationPosition={activeAnnotationPosition}
                                setRepositionEnabled={setRepositionEnabled}
                                repositionEnabled={repositionEnabled}
                                setPosition3D={setPosition3D}
                                activeAnnotationTitle={activeAnnotationTitle}
                                setAnnotationSavedOrDeleted={setAnnotationSavedOrDeleted}
                                annotationSavedOrDeleted={annotationSavedOrDeleted}
                                annotationModels={props.annotationModels}
                            />
                        }

                        {
                            typeof (activeAnnotationIndex) == 'string' && // This indicates a new annotation
                            <AnnotationEntry
                                index={getIndex() as number}
                                new
                                setActiveAnnotationIndex={setActiveAnnotationIndex}
                                position={position3D}
                                uid={uid}
                                specimenName={specimenName}
                                setRepositionEnabled={setRepositionEnabled}
                                repositionEnabled={repositionEnabled}
                                setAnnotationSavedOrDeleted={setAnnotationSavedOrDeleted}
                                annotationSavedOrDeleted={annotationSavedOrDeleted}
                                annotationModels={props.annotationModels}
                            />
                        }
                    </section>
                </div>
            </div>
        </>
    )
}