'use client'

// Typical imports
import { Accordion, AccordionItem } from "@heroui/react"
import { model } from "@prisma/client"
import { forwardRef, MutableRefObject, SetStateAction, useRef, Dispatch } from "react"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { NewModelClicked } from "@/ts/reducer"
import { useContext } from "react"
import { BotanyClientContext } from "./BotanyClient"
import { botanyClientContext } from "@/ts/botanist"
import { Spinner } from "@heroui/react"
import { AnnotationButtons } from "./AnnotationSubcomponents/AnnotationButtons"

// Default imports
import BotanistRefWrapper from "./BotanistModelViewerRef"

// Main JSX
export const ModelSelect = forwardRef((props: { modelsToAnnotate: model[], setModalOpen: Dispatch<SetStateAction<boolean>>, setReorderOpen: Dispatch<SetStateAction<boolean>> }, ref) => {

    const modelClicked = useRef<boolean>(undefined)
    const newAnnotationEnabled = ref as MutableRefObject<boolean>
    const context = useContext(BotanyClientContext) as botanyClientContext
    const botanyState = context.botanyState
    const botanyDispatch = context.botanyDispatch

    return <section className="h-full w-1/5">
        <Accordion className="h-full" onSelectionChange={(keys: any) => modelClicked.current = keys.size ? true : false}>
            {
                props.modelsToAnnotate.map((model) => <AccordionItem
                    key={model.sid}
                    aria-label={'Specimen to model'}
                    title={toUpperFirstLetter(model.spec_name)}
                    classNames={{ title: 'text-[ #004C46] text-2xl' }}
                    // First annotation position MUST be loaded before BotanistRefWrapper, so it is set to undefined while model data is set - note conditional render below
                    onPress={() => {
                        if (modelClicked.current) { const newModelClickedObj: NewModelClicked = { type: 'newModelClicked', model: model }; botanyDispatch(newModelClickedObj) }
                        else botanyDispatch({ type: 'setUidUndefined' })
                    }}>
                    {
                        botanyState.firstAnnotationPosition === undefined && botanyState.uid && !botanyState.activeAnnotation &&
                        <div className="h-[400px] w-full flex justify-center"><Spinner label='Loading Annotations' size="lg" /></div>
                    }
                    {/* Conditional render that waits until the first annotation(thus all annotations) is loaded */}
                    {/* RefWrapper required to pass ref to dynamically imported component */}
                    {botanyState.firstAnnotationPosition !== undefined && <div className="h-[400px]"><BotanistRefWrapper ref={newAnnotationEnabled} /></div>}
                    <AnnotationButtons setModalOpen={props.setModalOpen} setReorderOpen={props.setReorderOpen} ref={newAnnotationEnabled} />
                </AccordionItem>
                )}
        </Accordion>
    </section>
})

ModelSelect.displayName = 'ModelSelect'