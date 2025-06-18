'use client'

// Typical imports
import { Button } from "@heroui/react"
import { Dispatch, forwardRef, MutableRefObject, SetStateAction, useContext } from "react"
import { BotanyClientContext } from "../BotanyClient"
import { botanyClientContext } from "@/ts/botanist"

// Main JSX
export const AnnotationButtons = forwardRef((props: { setModalOpen: Dispatch<SetStateAction<boolean>>, setReorderOpen: Dispatch<SetStateAction<boolean>> }, newAnnotationEnabledRef) => {

    // Context, variables
    const context = useContext(BotanyClientContext) as botanyClientContext
    const botanyState = context.botanyState
    const botanyDispatch = context.botanyDispatch
    const newAnnotationEnabled = newAnnotationEnabledRef as MutableRefObject<boolean>

    return <>
        {
            !botanyState.newAnnotationEnabled && botanyState.activeAnnotationIndex != 'new' && botanyState.firstAnnotationPosition != undefined &&
            <Button
                onPress={() => { newAnnotationEnabled.current = true; botanyDispatch({ type: 'newAnnotationClicked' }) }}
                aria-label='New Annotation'
                className="text-white mt-2 text-lg"
                isDisabled={botanyState.repositionEnabled}>
                + New Annotation
            </Button>
        }
        {
            // Renumber annotations button
            !botanyState.newAnnotationEnabled && botanyState.activeAnnotationIndex !== 'new' && botanyState.firstAnnotationPosition !== undefined &&
            botanyState.annotations && botanyState.annotations?.length >= 2 &&
            <>
                <br></br>
                <Button
                    onPress={() => { props.setReorderOpen(true) }}
                    className="text-white mt-2 text-lg"
                    isDisabled={botanyState.repositionEnabled}>
                    Renumber Annotations
                </Button>
            </>
        }
        {
            botanyState.annotations && botanyState.annotations?.length >= 6 &&
            <>
                <br></br>
                <Button
                    onPress={() => props.setModalOpen(true)}
                    aria-label='Mark as annotated'
                    className="text-white mt-2 text-lg"
                    isDisabled={botanyState.repositionEnabled}>
                    Mark as Annotated
                </Button>
            </>
        }
        {
            botanyState.newAnnotationEnabled &&
            <div className="flex justify-center flex-col items-center">
                <p className="text-lg text-center">Click the subject to add an annotation</p>
                <p className="text-lg">or</p>
                <Button
                    color="danger"
                    aria-label='Cancel Annotation'
                    variant="light"
                    className="text-red-600 hover:text-white text-lg"
                    onPress={() => { newAnnotationEnabled.current = false; botanyDispatch({ type: 'newAnnotationCancelled' }) }}>
                    Cancel Annotation
                </Button>
            </div>
        }
    </>
})

AnnotationButtons.displayName = 'AnnotationButtons'