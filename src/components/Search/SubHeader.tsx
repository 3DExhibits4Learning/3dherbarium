/**
 * @file src/components/Search/SubHeader.tsx
 * 
 * @fileoverview collections subheader client
 */

'use client'

// Typical imports
import { SearchPageState } from "@/ts/search"
import { Navbar, NavbarContent, NavbarMenuItem, Button } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { SetStateAction, Dispatch } from "react"

export default function SubHeader(props: { state: SearchPageState, setState: Dispatch<SetStateAction<SearchPageState>> }) {

  // Props
  const state = props.state
  const setState = props.setState

  // Router for navigation, filter lists
  const router = useRouter()
  const modeledByList = state.modeledByList as string[]
  const annotatedByList = state.annotatedByList as string[]

  return <Navbar isBordered className="hidden md:flex z-0 w-full bg-[#00856A] dark:bg-[#212121]">
    <NavbarContent>

      <NavbarMenuItem>
        <Button color='primary' className="hidden lg:inline-block w-[200px]" onClick={() => router.push('/modelSubmit')}>Contribute a 3D Model</Button>
      </NavbarMenuItem>

      <div className="flex w-full gap-4 justify-center lg:justify-end h-full items-center">

        <div className="mr-2 flex justify-center items-center">
          <label className="text-white mr-2">Include Community Models</label>
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
          <option value="All" disabled selected>Modeled by</option>
          {modeledByList.map((modeler: string) => <option key={modeler} value={modeler}>{modeler}</option>)}
        </select>

        <select
          value={state.selectedAnnotator}
          onChange={e => setState({ ...state, selectedModeler: e.target.value })}
          className={`min-w-[166px] w-fit max-w-[200px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[40px] text-[14px] px-2 outline-[#004C46]`}>
          <option value="All" disabled selected>Annotated by</option>
          {annotatedByList.map((annotator: string) => <option key={annotator} value={annotator}>{annotator}</option>)}
        </select>
      </div>

    </NavbarContent>
  </Navbar>
}