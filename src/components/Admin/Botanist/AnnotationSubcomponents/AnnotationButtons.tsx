'use client'

import { Button } from "@nextui-org/react";
import { Dispatch, forwardRef, MutableRefObject, SetStateAction, useContext } from "react";
import { BotanyClientContext } from "../BotanyClient";
import { botanyClientContext } from "@/ts/botanist";

export const AnnotationButtons = forwardRef((props:{setModalOpen: Dispatch<SetStateAction<boolean>>}, newAnnotationEnabledRef) =>  {

    const context = useContext(BotanyClientContext) as botanyClientContext
    const botanyState = context.botanyState
    const botanyDispatch = context.botanyDispatch
    const newAnnotationEnabled = newAnnotationEnabledRef as MutableRefObject<boolean>

    return <>
        {
            !botanyState.newAnnotationEnabled && botanyState.activeAnnotationIndex != 'new' && botanyState.firstAnnotationPosition != undefined &&
            <Button
                onPress={() => { newAnnotationEnabled.current = true; botanyDispatch({ type: 'newAnnotationClicked' }) }}
                className="text-white mt-2 text-lg"
                isDisabled={botanyState.repositionEnabled}>
                + New Annotation
            </Button>
        }
        {
            botanyState.annotations && botanyState.annotations?.length >= 6 &&
            <>
                <br></br>
                <Button
                    onPress={() => props.setModalOpen(true)}
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