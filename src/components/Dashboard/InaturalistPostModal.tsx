'use client'

import { ChangeEvent, SetStateAction, useRef, useState, Dispatch, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Modal, ModalContent, ModalBody, ModalFooter, useDisclosure, Button } from "@heroui/react"
import DataTransferModal from "../Shared/DataTransferModal"
import checkToken from "@/functions/client/utils/checkToken"
import { Ref } from "react"
import FormMap from "../Map/Form"
import { LatLngLiteral } from "leaflet"
import Autocomplete from "../Shared/AutoCompleteRef"

export default function InaturalistPostModal(props: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {

    const { data: session, } = useSession()

    const router = useRouter()

    const { onOpenChange } = useDisclosure();

    const [error, setError] = useState<boolean>(false)
    const [dataTransferOpen, setDataTransferOpen] = useState<boolean>(false)
    const [sending, setSending] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [photoLimitTriggered, setPhotoLimitTriggered] = useState<boolean>(false)
    const [position, setPosition] = useState<LatLngLiteral | null>(null)
    const [postDisabled, setPostDisabled] = useState<boolean>(false)
    const [autocompleteOptions, setAutocompleteOptions] = useState<any[]>([])

    const species = useRef<string>(undefined)
    const description = useRef<string>('')
    const files = useRef<HTMLInputElement>(undefined)
    const date = useRef<HTMLInputElement>(undefined)
    const time = useRef<HTMLInputElement>(undefined)

    if (!session || !session.user) {
        router.push('/api/auth/signin')
    }

    const fileLimiter = (fileList: FileList) => {
        if (fileList.length > 5) {
            if (files.current) files.current.value = ''
            setPhotoLimitTriggered(true)
        }
        postEnable()
    }

    const postEnable = () => {
        if (species.current && position && files.current?.files && date.current?.value && time.current?.value) setPostDisabled(false)
        else { setPostDisabled(true) }
        const a = (date.current as HTMLInputElement).value + ' ' + (time.current as HTMLInputElement).value
    }

    const fetchAutoCompleteOptions = async () => {
        const speciesOptions = await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?taxon_id=47126&rank=species&q=${species.current}`)
            .then(res => res.json()).then(json => json.results)
        setAutocompleteOptions(speciesOptions)
    }

    const postObservation = async () => {

        const data = new FormData()

        data.set('numberOfImages', ((files.current as HTMLInputElement).files as FileList).length.toString())

        for (let i = 0; i < ((files.current as HTMLInputElement).files as FileList).length; i++) {
            data.set(`file${i}`, ((files.current as HTMLInputElement).files as FileList)[i])
        }

        data.set('species', species.current as string)
        data.set('latitude', (position as LatLngLiteral).lat.toString())
        data.set('longitude', (position as LatLngLiteral).lng.toString())
        data.set('observed_on', (date.current as HTMLInputElement).value + ' ' + (time.current as HTMLInputElement).value)

        setSending(true)
        setDataTransferOpen(true)

        const post = await fetch('/api/inat/observation', {
            method: 'POST',
            body: data
        })

        if(!post.ok){
            setError(true)
            return
        }
        else{
            const res = await post.json().then(json => json.data)
            setResult(res)
            setSending(false)
        }
    }

    useEffect(() => {
        if (props.open) {
            checkToken('inaturalist', setError)
        }
    }, [props.open])

    return (
        <>
            <DataTransferModal open={dataTransferOpen} transferring={sending} result={result} loadingLabel="Posting Observation..." setOpen={setDataTransferOpen} href={'/dashboard'}/>
            <Modal className='bg-[#F5F3E7] dark:bg-[#181818]' isOpen={props.open} onOpenChange={onOpenChange} isDismissable={false} hideCloseButton isKeyboardDismissDisabled={true} size="5xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="flex flex-col">
                                {
                                    error &&
                                    <p>Error posting observation, try again later.</p>
                                }
                                {
                                    !error &&
                                    <p className="mb-4">iNaturalist Post</p>
                                }
                                {
                                    !error &&
                                    <>
                                        <table className="w-4/5">

                                            <tr>
                                                <td className="align-middle !w-1/5">Species<span className="text-red-700"> *</span></td>
                                                <td className="align-middle py-4 relative">
                                                    <Autocomplete
                                                        className={`w-2/5 h-[42px] min-w-[300px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] text-[14px] outline-[#004C46] px-4 inline-block`}
                                                        options={autocompleteOptions}
                                                        changeFn={fetchAutoCompleteOptions}
                                                        ref={species}
                                                        listWidth="min-w-[300px] w-2/5"
                                                    >
                                                    </Autocomplete>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="align-middle">Observation Date<span className="text-red-700"> *</span></td>
                                                <td className="align-middle py-4">
                                                    <input ref={date as Ref<HTMLInputElement>} type='date' className={`w-2/5 min-w-[300px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 !placeholder-[#9797A0] outline-[#004C46]`} onChange={postEnable}></input>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="align-middle">Observation Time<span className="text-red-700"> *</span></td>
                                                <td className="align-middle py-4">
                                                    <input ref={time as Ref<HTMLInputElement>} type='time' className={`w-2/5 min-w-[300px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 !placeholder-[#9797A0] outline-[#004C46]`} onChange={postEnable}></input>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="align-middle">Location<span className="text-red-700"> *</span></td>
                                                <td className="align-middle py-4">
                                                    <FormMap position={position} setPosition={setPosition} enabler={postEnable} className="h-[300px] w-4/5 z-10 rounded-xl" />
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="align-middle">Description </td>
                                                <td className="align-middle py-4">
                                                    <textarea
                                                        className={`w-4/5 h-fit min-w-[300px] min-h-[42px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] text-[14px] outline-[#004C46] p-4`}
                                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                                            description.current = e.target.value
                                                            postEnable()
                                                        }}
                                                    >
                                                    </textarea></td>
                                            </tr>

                                            <tr>
                                                <td className="align-middle">Photo(s)<span className="text-red-700"> *</span> </td>
                                                <td className="align-middle py-4">
                                                    <input
                                                        id='postInput'
                                                        type='file'
                                                        multiple
                                                        ref={files as Ref<HTMLInputElement>}
                                                        accept='.jpg,.jpeg,.png,.gif'
                                                        onChange={() => {
                                                            fileLimiter((files.current as HTMLInputElement).files as FileList)
                                                        }}
                                                    >
                                                    </input></td>
                                            </tr>

                                            {
                                                photoLimitTriggered &&
                                                <tr>
                                                    <td className="align-middle py-4 text-red-700">10 photos maximum</td>
                                                </tr>

                                            }
                                        </table>
                                    </>
                                }
                            </ModalBody>
                            <ModalFooter className="flex">
                                <Button className="mr-4 text-lg text-white" onClick={() => postObservation()} isDisabled={postDisabled}>Post</Button>
                                <Button color="danger" variant="light" onPress={() => props.setOpen(false)}>Cancel</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}