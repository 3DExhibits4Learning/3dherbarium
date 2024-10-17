'use client'

import { Models } from "@/api/types"
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Modal, ModalContent, ModalBody, ModalFooter, Spinner, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const ModelViewer = dynamic(() => import('../Shared/ModelViewer'), { ssr: false })

export default function PendingModelsAdmin(props: { pendingModels: Models[] }) {

    const router = useRouter()
    const approvable = props.pendingModels[0]?.thumbnail.includes('models')
    const [approvalDisabled, setApprovalDisabled] = useState<boolean>(!approvable)
    const [selectedKeys, setSelectedKeys] = useState<any>(new Set(["0"]))
    const [approvalModalOpen, setApprovalModalOpen] = useState<boolean>(false)
    const [approving, setApproving] = useState<boolean>(false)
    const [approvalResponse, setApprovalResponse] = useState<string>('')

    const updateAccordionItemState = (index: number) => {
        const approvable = props.pendingModels[index].thumbnail.includes('models')
        setApprovalDisabled(!approvable)
    }

    const approve = async (index: number) => {
        setApproving(true)
        setApprovalModalOpen(true)
        await fetch('/api/approveModel', {
            method: 'POST',
            body: JSON.stringify({ confirmation: props.pendingModels[index].confirmation })
        })
        .then(res => res.json())
        .then(json => {
            setApprovalResponse(json.data)
            setApproving(false)
        })
    }

    // Modal that appears when 'approve' is clicked
    const ApprovingModal = () => {
        const { onOpenChange } = useDisclosure();
        return (
            <>
                <Modal isOpen={approvalModalOpen} onOpenChange={onOpenChange} isDismissable={false}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalBody className="text-center">
                                    {
                                        approving &&
                                        <Spinner label='Approving 3D Model' />
                                    }
                                    {
                                        !approving &&
                                        <p className="text-2xl">{approvalResponse}</p>
                                    }
                                </ModalBody>
                                <ModalFooter className="flex justify-center">
                                    {
                                        !approving &&
                                        <Button color="primary" onPress={router.refresh}>
                                            OK
                                        </Button>
                                    }
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </>
        );
    }
    return (
        <>
            <ApprovingModal />
            <h1 className="text-3xl font-medium mt-4 border-b-1 border-[#004C46] pb-4 mb-4">Pending Models</h1>
            <Accordion selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} isCompact={true} fullWidth={false} title="Pending Models">
                {props.pendingModels.map((model, index) => {
                    return (
                        <AccordionItem className='font-medium' key={index} aria-label={model.speciesName} title={model.speciesName} classNames={{ title: 'italic' }} onPress={() => updateAccordionItemState(index)}>
                            <div className="flex justify-around items-center">
                                <div className="w-1/3 flex text-center flex-col">
                                    <p>Confirmation Number: {model.confirmation}</p>
                                    <p>Artist: {model.artistName}</p>
                                    <p>Submitted: {model.dateTime.toDateString()}</p>
                                </div>
                                <div className="w-1/3 h-[300px] mb-4">
                                    <ModelViewer uid={model.modeluid} />
                                </div>
                                <div className="w-1/3 flex justify-center items-center flex-col">
                                    <div className="mb-12">
                                        <Button isDisabled={approvalDisabled} className="text-white font-medium" onPress={() => approve(index)}>Approve</Button>
                                    </div>
                                    <div>
                                        <Button color='danger' variant='light' className="font-medium" onPress={() => approve(index)}>Quick Approve</Button>
                                    </div>
                                </div>
                            </div>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </>
    )
}