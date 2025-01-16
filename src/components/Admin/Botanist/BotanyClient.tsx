/**
 * @file src/components/Admin/Botanist/BotanyClient.tsx
 * 
 * @fileoverview botanist administrator client
 * 
 * @todo refactor, test
 */
'use client'

// Typical imports
import { Accordion, AccordionItem } from "@nextui-org/react"
import { useEffect, useState, useRef, createContext, useReducer } from "react"
import { model } from "@prisma/client"
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter"
import { Button } from "@nextui-org/react"
import { Spinner } from "@nextui-org/react"
import { botanyClientContext } from "@/ts/botanist"
import { NewModelClicked, NewModelOrAnnotation } from "@/ts/reducer"
import { initialBotanyClientState } from "@/ts/botanist"
import { activeAnnotationIndexDispatch, getIndex } from "@/functions/client/admin/botanist"

// Default imports
import ModelAnnotations from "@/utils/ModelAnnotationsClass"
import BotanistRefWrapper from "./BotanistModelViewerRef"
import AreYouSure from "../../Shared/AreYouSure"
import NewSpecimenEntry from "../NewSpecimenEntry"
import DataTransferModal from "@/components/Shared/DataTransferModal"
import terminateDataTransfer from "@/functions/client/dataTransfer/terminateDataTransfer"
import initializeDataTransfer from "@/functions/client/dataTransfer/initializeDataTransfer"
import AnnotationEntry from "./AnnotationEntry"
import botanyClientReducer from "@/functions/client/reducers/botanyClientReducer"

export const BotanyClientContext = createContext<botanyClientContext | ''>('')

export default function BotanyClient(props: { modelsToAnnotate: model[], annotationModels: model[] }) {

    // Reducer
    const [botanyState, botanyDispatch] = useReducer(botanyClientReducer, initialBotanyClientState)

    // "Are you sure" modal state
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    // Data transfer states
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [loadingLabel, setLoadingLabel] = useState<string>('')

    // Data transfer handlers
    const initializeDataTransferHandler = (loadingLabel: string) => initializeDataTransfer(setOpenModal, setTransferring, setLoadingLabel, loadingLabel)
    const terminateDataTransferHandler = (result: string) => terminateDataTransfer(setResult, setTransferring, result)

    // Refs
    const modelClicked = useRef<boolean>()
    const newAnnotationEnabled = useRef<boolean>(false)

    // This effect sets the activeAnnotation when its dependency is changed from the BotanistModelViewer, either via clicking an annotation or creating a new one
    useEffect(() => activeAnnotationIndexDispatch(botanyState, botanyDispatch), [botanyState.activeAnnotationIndex]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {

        // Set relevant model data; this is called onPress of the Accordion
        const getAnnotationsObj = async () => {
            const modelAnnotations = await ModelAnnotations.retrieve(botanyState.uid as string)
            let annotationPosition = ''

            await fetch(`/api/annotations?uid=${botanyState.uid}`, { cache: 'no-store' })
                .then(res => res.json()).then(json => {
                    if (json.response) annotationPosition = JSON.parse(json.response)
                })

            newAnnotationEnabled.current = false
            const uidOrAnnotationDispatchObj: NewModelOrAnnotation = { type: 'newModelOrAnnotation', modelAnnotations: modelAnnotations, annotationPosition: annotationPosition }
            botanyDispatch(uidOrAnnotationDispatchObj)
        }

        getAnnotationsObj()

    }, [botanyState.uid, botanyState.annotationSavedOrDeleted])

    return (
        <BotanyClientContext.Provider value={{ botanyState, botanyDispatch }}>

            <DataTransferModal open={openModal} transferring={transferring} result={result} loadingLabel={loadingLabel} href='/admin/botanist' />
            <AreYouSure uid={botanyState.uid as string} open={modalOpen} setOpen={setModalOpen} species={botanyState.specimenName as string} />

            <Accordion className="w-full">
                <AccordionItem key={'newSpecimen'} aria-label={'New Specimen'} title={"I've acquired a new specimen"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                    <NewSpecimenEntry initializeTransfer={initializeDataTransferHandler} terminateTransfer={terminateDataTransferHandler} />
                </AccordionItem>
            </Accordion>

            <div className="flex w-full h-full">
                <section className="h-full w-1/5">

                    {/* Accordion holds all models than need annotation */}

                    <Accordion className="h-full" onSelectionChange={(keys: any) => modelClicked.current = keys.size ? true : false}>
                        {
                            props.modelsToAnnotate.map((model, i) => {
                                return (
                                    <AccordionItem
                                        key={i}
                                        aria-label={'Specimen to model'}
                                        title={toUpperFirstLetter(model.spec_name)}
                                        classNames={{ title: 'text-[ #004C46] text-2xl' }}
                                        onPress={() => {
                                            if (modelClicked.current) {
                                                // First annotation position MUST be loaded before BotanistRefWrapper, so it is set to undefined while model data is set - note conditional render below
                                                const newModelClickedObj: NewModelClicked = { type: 'newModelClicked', model: model }
                                                botanyDispatch(newModelClickedObj)
                                            }
                                            else botanyDispatch({ type: 'setUidUndefined' })
                                        }}
                                    >

                                        {/* Display Spinner while 3D Model is loading*/}

                                        {
                                            botanyState.firstAnnotationPosition === undefined && botanyState.uid && !botanyState.activeAnnotation &&
                                            <div className="h-[400px] w-full flex justify-center">
                                                <Spinner label='Loading Annotations' size="lg" />
                                            </div>
                                        }

                                        {/* Conditional render that waits until the first annotation(thus all annotations) is loaded*/}
                                        {/* RefWrapper required to pass ref to dynamically imported component*/}


                                        {
                                            botanyState.firstAnnotationPosition !== undefined &&
                                            <div className="h-[400px]">
                                                <BotanistRefWrapper ref={newAnnotationEnabled} />
                                            </div>
                                        }

                                        {/* New annotation button */}

                                        {
                                            !botanyState.newAnnotationEnabled && botanyState.activeAnnotationIndex != 'new' && botanyState.firstAnnotationPosition != undefined &&
                                            <Button onPress={() => {
                                                newAnnotationEnabled.current = true
                                                botanyDispatch({ type: 'newAnnotationClicked' })
                                            }}
                                                className="text-white mt-2 text-lg"
                                                isDisabled={botanyState.repositionEnabled}
                                            >
                                                + New Annotation
                                            </Button>
                                        }

                                        {
                                            botanyState.annotations && botanyState.annotations?.length >= 6 &&
                                            <>
                                                <br></br>
                                                <Button onPress={() => {
                                                    setModalOpen(true)
                                                }}
                                                    className="text-white mt-2 text-lg"
                                                    isDisabled={botanyState.repositionEnabled}
                                                >
                                                    Mark as Annotated
                                                </Button>
                                            </>
                                        }

                                        {/* Click to place annotation or cancel*/}

                                        {
                                            botanyState.newAnnotationEnabled &&
                                            <div className="flex justify-center flex-col items-center">
                                                <p className="text-lg text-center">Click the subject to add an annotation</p>
                                                <p className="text-lg">or</p>
                                                <Button
                                                    color="danger"
                                                    variant="light"
                                                    className="text-red-600 hover:text-white text-lg"
                                                    onPress={() => {
                                                        newAnnotationEnabled.current = false
                                                        botanyDispatch({ type: 'newAnnotationCancelled' })
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
                            !botanyState.uid && !botanyState.activeAnnotation &&
                            <div className="flex items-center justify-center text-xl h-full w-full">
                                <p className="mr-[10%] text-lg lg:text-3xl">Select a 3D model to get started!</p>
                            </div>
                        }

                        {
                            botanyState.uid && !botanyState.activeAnnotation && botanyState.activeAnnotationIndex !== 1 && !botanyState.newAnnotationEnabled &&
                            <div className="flex items-center justify-center text-xl h-full w-full">
                                <p className="mr-[10%] text-lg lg:text-3xl">Select an annotation to edit, or click New Annotation</p>
                            </div>
                        }

                        {
                            botanyState.activeAnnotationIndex == 1 && // This indicates the first annotation
                            <AnnotationEntry index={getIndex(botanyState) as number} new={false} annotationModels={props.annotationModels}
                            />
                        }

                        {
                            typeof (botanyState.activeAnnotationIndex) == 'number' && botanyState.activeAnnotation && botanyState.annotations && botanyState.uid && // This indicates a databased annotation
                            <AnnotationEntry index={getIndex(botanyState) as number} new={false} annotationModels={props.annotationModels} />
                        }

                        {
                            typeof (botanyState.activeAnnotationIndex) == 'string' && // This indicates a new annotation
                            <AnnotationEntry index={getIndex(botanyState) as number} new={false} annotationModels={props.annotationModels} />
                        }
                    </section>
                </div>
            </div>
        </BotanyClientContext.Provider>
    )
}