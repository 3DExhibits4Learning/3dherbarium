// TODO: Update error handling for the sendMessage fn, iNat doesn't throw an error, they send a 200 response with an error json object

'use client'

import { ChangeEvent, SetStateAction, useRef, useState, Dispatch, useEffect } from "react"
import { useSession, signOut, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Modal, ModalContent, ModalBody, ModalFooter, useDisclosure, Button } from "@heroui/react"
import DataTransferModal from "./DataTransferModal"
import checkToken from "@/functions/client/utils/checkToken"

export default function SendInatMsg(props: { username: string, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {

    const { data: session, } = useSession()
    
    const router = useRouter()
    
    const { onOpenChange } = useDisclosure();

    const [error, setError] = useState<boolean>(false)
    const [dataTransferOpen, setDataTransferOpen] = useState<boolean>(false)
    const [sending, setSending] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')

    const subject = useRef<string>(undefined)
    const message = useRef<string>(undefined)
    const id = useRef<number>(undefined)

    if (!session || !session.user) {
        router.push('/api/auth/signin')
    }

    const getId = async () => {
        try {
            id.current = await fetch(`/api/inat?requestType=getId&username=hunter_bunter`)
                //id.current = await fetch(`/api/inat?requestType=getId&username=${props.username}`)
                .then(res => res.json())
                .then(json => json.response)
        }
        catch (e: any) { setError(true) }
    }
    getId()

    const sendMessage = async () => {

        const messageObj = {
            requestType: 'sendMessage',
            id: id.current,
            subject: subject.current,
            body: message.current
        }

        props.setOpen(false)
        setDataTransferOpen(true)
        setSending(true)

        const res = await fetch('/api/inat', {
            method: 'POST',
            body: JSON.stringify(messageObj)
        })
            .then(res => res.json())
            .then(json => {
                setSending(false)
                setResult(json.data)
            })
    }

    useEffect(() => {
        if(props.open){
            checkToken('inaturalist', setError)
        }
    },[props.open])

    return (
        <>
            <DataTransferModal open={dataTransferOpen} transferring={sending} result={result} loadingLabel="Sending message..." setOpen={setDataTransferOpen} />
            <Modal className='bg-[#F5F3E7] dark:bg-[#181818]' isOpen={props.open} onOpenChange={onOpenChange} isDismissable={false} hideCloseButton isKeyboardDismissDisabled={true} size="5xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="flex flex-col">
                                {
                                    error &&
                                    <p>Sorry, user not found</p>
                                }
                                {
                                    !error &&
                                    // <p className="mb-4">Message to: <span className="ml-1">{props.username}</span></p>
                                    <p className="mb-4">Message to: <span className="ml-1">hunter_bunter</span></p>
                                }
                                {
                                    !error &&
                                    <>
                                        <table className="w-4/5">
                                            <tr>
                                                <td className="align-middle !w-[10%] py-4">Subject: </td>
                                                <td className="align-middle py-4">
                                                    <input type='text'
                                                        className={`w-2/5 h-[42px] min-w-[300px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] text-[14px] outline-[#004C46] px-4`}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => subject.current = e.target.value}
                                                    >
                                                    </input>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="align-middle">Message: </td>
                                                <td className="align-middle">
                                                    <textarea
                                                        className={`w-4/5 h-1/2 min-w-[300px] min-h-[300px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] text-[14px] outline-[#004C46] p-4`}
                                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => message.current = e.target.value}
                                                    >
                                                    </textarea></td>
                                            </tr>
                                        </table>
                                    </>
                                }
                            </ModalBody>
                            <ModalFooter className="flex">
                                <Button className="mr-4 text-lg text-white" onPress={sendMessage}>Send</Button>
                                <Button color="danger" variant="light" onPress={() => props.setOpen(false)}>Cancel</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}