'use client'

import { Navbar, NavbarContent, Select, SelectItem, NavbarMenuItem, Button } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { SetStateAction, Dispatch } from "react"

interface SubHeaderProps {
  modeledByList: string[]
  annotatedByList: string[]
  setOrder: Dispatch<SetStateAction<string>>
  setSelectedModeler: Dispatch<SetStateAction<string | undefined>>
  setSelectedAnnotator: Dispatch<SetStateAction<string | undefined>>
}

const SubHeader = (props: SubHeaderProps) => {

  const router = useRouter()
  const modeledByList: string[] = props.modeledByList
  const annotatedByList: string[] = props.annotatedByList
  const orderOptions = ['Newest First', 'Alphabetical', 'Reverse Alphabetical']

  return (
    <Navbar isBordered className="z-0 w-full bg-[#00856A] dark:bg-[#212121]">
      <NavbarContent>

        <NavbarMenuItem>
          <Button color='primary' className="hidden lg:inline-block w-[200px]" onClick={() => router.push('/modelSubmit')}>Contribute a 3D Model</Button>
        </NavbarMenuItem>

        <div className="flex w-full gap-4 justify-center lg:justify-end">

        <Select
            size="sm"
            label="Order By"
            className="w-[47.5%] lg:w-[25%] max-w-[200px]"
            selectedKeys={new Set(['Newest First'])}
            onChange={(e) => props.setOrder(e.target.value)}
          >
                <SelectItem key={'Newest First'} value={"Newest First"}>Newest First</SelectItem>
                <SelectItem key={'Alphabetical'} value={"Alphabetical"}>Alphabetical</SelectItem>
                <SelectItem key={'Reverse Alphabetical'} value={"Reverse Alphabetical"}>Reverse Alphabetical</SelectItem>
          </Select>

          <Select
            size="sm"
            label="Modeled By"
            className="w-[47.5%] lg:w-[25%] max-w-[200px]"
            onChange={(e) => props.setSelectedModeler(e.target.value)}
          >
            {
              modeledByList.map((modeler: string, index: number) => (
                <SelectItem key={modeler} value={modeler}>{modeler}</SelectItem>
              ))
            }
          </Select>

          <Select
            size="sm"
            label="Annotated By"
            className="w-[47.5%] lg:w-[25%] max-w-[200px]"
            classNames={{ mainWrapper: "h-[40px]" }}
            onChange={(e) => props.setSelectedAnnotator(e.target.value)}
          >
            {
              annotatedByList.map((modeler: string, index: number) => (
                <SelectItem key={modeler} value={modeler} >{modeler}</SelectItem>
              ))
            }
          </Select>

        </div>

      </NavbarContent>
    </Navbar>
  );
};

export default SubHeader