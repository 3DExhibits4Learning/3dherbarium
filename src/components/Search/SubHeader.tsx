'use client'

import { Navbar, NavbarContent, SelectItem, NavbarMenuItem, Button } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { SetStateAction, Dispatch } from "react"

interface SubHeaderProps {
  modeledByList: string[]
  annotatedByList: string[]
  order: string
  setOrder: Dispatch<SetStateAction<string>>
  modeler: string
  setSelectedModeler: Dispatch<SetStateAction<string>>
  annotator: string
  setSelectedAnnotator: Dispatch<SetStateAction<string>>
  communityIncluded: boolean
  setCommunityIncluded: Dispatch<SetStateAction<boolean>>
}

const SubHeader = (props: SubHeaderProps) => {

  const router = useRouter()
  const modeledByList: string[] = props.modeledByList
  const annotatedByList: string[] = props.annotatedByList

  return (
    <Navbar isBordered className="z-0 w-full bg-[#00856A] dark:bg-[#212121]">
      <NavbarContent>

        <NavbarMenuItem>
          <Button color='primary' className="hidden lg:inline-block w-[200px]" onClick={() => router.push('/modelSubmit')}>Contribute a 3D Model</Button>
        </NavbarMenuItem>

        <div className="flex w-full gap-4 justify-center lg:justify-end h-full items-center">

          <div className="mr-2 flex justify-center items-center">
            <label className="text-white mr-2 font-medium">Include Community Models</label>
            <input type='checkbox' checked={props.communityIncluded} onChange={() => props.setCommunityIncluded(!props.communityIncluded)}></input>
          </div>

          <select
            value={props.order}
            onChange={(e) => props.setOrder(e.target.value)}
            className={`min-w-[166px] w-fit max-w-[200px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[40px] text-[14px] px-2 outline-[#004C46]`}
          >
            <option className='!hover:bg-[#00856A]' key={'Newest First'} value={"Newest First"}>Newest First</option>
            <option key={'Alphabetical'} value={"Alphabetical"}>Alphabetical</option>
            <option key={'Reverse Alphabetical'} value={"Reverse Alphabetical"}>Reverse Alphabetical</option>
          </select>

          <select
            value={props.modeler}
            onChange={(e) => props.setSelectedModeler(e.target.value)}
            className={`min-w-[166px] w-fit max-w-[200px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[40px] text-[14px] px-2 outline-[#004C46]`}
          >
            <option value="All" disabled selected>Modeled by</option>
            {
              modeledByList.map((modeler: string) => (
                <option key={modeler} value={modeler}>{modeler}</option>
              ))
            }
          </select>

          <select
            value={props.annotator}
            onChange={(e) => props.setSelectedAnnotator(e.target.value)}
            className={`min-w-[166px] w-fit max-w-[200px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[40px] text-[14px] px-2 outline-[#004C46]`}
          >
            <option value="All" disabled selected>Annotated by</option>
            {
              annotatedByList.map((annotator: string) => (
                <option key={annotator} value={annotator}>{annotator}</option>
              ))
            }
          </select>

        </div>

      </NavbarContent>
    </Navbar>
  );
};

export default SubHeader