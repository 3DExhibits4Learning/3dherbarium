import { Modal, ModalContent, ModalBody, Button } from "@heroui/react"
import { SetStateAction, useState, Dispatch } from "react";
import { Spinner } from "@heroui/react";
import { ModelDeleteObject } from "@/ts/types";

export default function Delete(props: { confirmation: string, modelUid: string, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {

    // Variable initialization
    const [areTheySure, setAreTheySure] = useState<boolean>(false)
    const [deleted, setDeleted] = useState<boolean>(false)
    const [msg, setMsg] = useState<any>('')

    // Delete 3D Model
    const deleteModel = async () => {

        try {
            
            const deleteObject: ModelDeleteObject = {
                confirmation: props.confirmation,
                modelUid: props.modelUid
            }

            const deleteMessage = await fetch('/api/dashboard/edit', {
                method: 'DELETE',
                body: JSON.stringify(deleteObject)
            }).then(res => {
                if (!res.ok) { throw new Error(res.statusText) }
                return res.json()
            }).then(json => json.data)
                .catch((e) => { throw Error(e.message) })

            setMsg(deleteMessage)
            setDeleted(true)
        }
       
        catch (e: any) {
            setMsg(e.message)
            setDeleted(true)
        }
    }

    return (
        <>
            <Modal isOpen={props.open}>
                <ModalContent>
                    <ModalBody className="font-medium text-center">

                        {
                            !areTheySure &&
                            <>
                                <p className="mt-8">Are you SURE you want to delete your 3D model?</p>
                                <p className="mb-8">This action can NOT be undone!</p>
                                <div className="flex justify-around mb-8">
                                    <Button className="text-white" onPress={() => props.setOpen(false)}>Cancel</Button>
                                    <Button color='danger' variant='light' onClick={() => {
                                        setAreTheySure(true)
                                        deleteModel()
                                    }}>Delete</Button>
                                </div>
                            </>
                        }

                        {
                            areTheySure && !deleted &&
                            <Spinner className="mb-8" label='Deleting 3D Model' />
                        }

                        {
                            areTheySure && deleted &&
                            <>
                                <p className="mb-8">{msg}</p>
                                <div>
                                    <a href='/dashboard'><Button className="text-white">Close</Button></a>
                                </div>
                            </>
                        }

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}