/**
 * @file src/components/Search/MobileFilters.tsx
 * 
 * @fileoverview mobile search filter client
 */

'use client'

// Typical imports
import { Dispatch, SetStateAction } from "react"
import { Accordion, AccordionItem } from "@heroui/react"
import { SearchPageState } from "@/ts/search"

export default function MobileSearchFilters(props: { state: SearchPageState, setState: Dispatch<SetStateAction<SearchPageState>> }) {

    // Props
    const state = props.state
    const setState = props.setState

    // Modeled by list
    const modeledByList = state.modeledByList as string[]
    const annotatedByList = state.annotatedByList as string[]

    return <Accordion className="md:hidden w-full">
        <AccordionItem title='Search Filters' classNames={{ title: 'ml-4' }}>
            <div className="flex flex-col w-full gap-4 justify-center h-full items-center">

                <div className="mr-2 flex justify-center items-center">
                    <label className="mr-2">Include Community Models</label>
                    <input type='checkbox' checked={state.communityIncluded} onChange={() => setState({ ...state, communityIncluded: !state.communityIncluded })}></input>
                </div>

                <select
                    value={state.order}
                    onChange={e => setState({ ...state, order: e.target.value })}
                    className={`min-w-[166px] w-fit max-w-[200px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[40px] text-[14px] px-2 outline-[#004C46]`}>
                    <option className='!hover:bg-[#00856A]' key={'Newest First'} value={"Newest First"}>Newest First</option>
                    <option key={'Alphabetical'} value={"Alphabetical"}>Alphabetical</option>
                    <option key={'Reverse Alphabetical'} value={"Reverse Alphabetical"}>Reverse Alphabetical</option>
                </select>

                <select
                    value={state.selectedModeler}
                    onChange={e => setState({ ...state, selectedModeler: e.target.value })}
                    className={`min-w-[166px] w-fit max-w-[200px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[40px] text-[14px] px-2 outline-[#004C46]`}>
                    <option value="All" disabled>Modeled by</option>
                    {modeledByList.map((modeler: string) => <option key={modeler} value={modeler}>{modeler}</option>)}
                </select>

                <select
                    value={state.selectedAnnotator}
                    onChange={e => setState({ ...state, selectedModeler: e.target.value })}
                    className={`min-w-[166px] w-fit max-w-[200px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[40px] text-[14px] px-2 outline-[#004C46]`}>
                    <option value="All" disabled>Annotated by</option>
                    {annotatedByList.map((annotator: string) => <option key={annotator} value={annotator}>{annotator}</option>)}
                </select>

            </div>

        </AccordionItem>
    </Accordion>
}