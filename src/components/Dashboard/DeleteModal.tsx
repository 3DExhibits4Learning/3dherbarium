import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react"
import { SetStateAction, useState, Dispatch } from "react";
import { Spinner } from "@nextui-org/react";

export default function Delete(props: { confirmation: string, modelUid: string, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {

    //Variable initialization
    const [areTheySure, setAreTheySure] = useState<boolean>(false)
    const [deleted, setDeleted] = useState<boolean>(false)
    const [msg, setMsg] = useState<any>('')

    //Delete 3D Model
    const deleteModel = async () => {
        try {
            const deleteMessage = await fetch('/api/editModel', {
                method: 'POST',
                body: JSON.stringify({
                    confirmation: props.confirmation,
                    modelUid: props.modelUid
                })
            })
                .then(res => res.json())
                .then(json => json.data)
            setMsg(deleteMessage)
            setDeleted(true)
        }
        catch (e) {
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
                                    <Button id='editModal' className="text-white" onPress={() => props.setOpen(false)}>Cancel</Button>
                                    <Button id='editModal' color='danger' variant='light' onClick={() => {
                                        setAreTheySure(true)
                                        deleteModel()
                                    }}>Delete</Button>
                                </div>
                            </>
                        }
                        
                        {
                            areTheySure && !deleted &&
                            <Spinner label='Deleting 3D Model' />
                        }
                        
                        {
                            areTheySure && deleted &&
                            <>
                                <p className="mb-8">{msg}</p>
                                <div>
                                    <a href='/dashboard'><Button id='editModal' className="text-white">Close</Button></a>
                                </div>
                            </>
                        }

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}