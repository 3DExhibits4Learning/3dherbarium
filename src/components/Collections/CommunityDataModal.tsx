'use client'
import { Modal, ModalContent, ModalBody, ModalFooter, Spinner, useDisclosure, Button } from "@heroui/react"
import { SetStateAction, Dispatch } from "react";
import CommunityHerbarium from "@/functions/client/utils/Community3dModel";
import { addCommas, boolRinse } from "./SketchfabDom";
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter";
import Image from "next/image";
import { Divider } from "@heroui/react";

export default function CommunityDataModal(props: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, specimen: CommunityHerbarium }) {
    const s = props.specimen
    return (
        <>
            <Modal isOpen={props.open} isDismissable={false} hideCloseButton isKeyboardDismissDisabled={true} scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="text-center">
                                <div className="w-full" style={{ display: "block" }}>
                                    <div className='fade flex flex-col w-[99%] mt-[25px]'>
                                        <div className='w-full flex text-[1.5rem] justify-center items-center py-[20px]'>
                                            <p> Classification </p>
                                        </div>

                                        <Divider />

                                        <div className='w-full py-[20px] justify-center items-center text-center'>
                                            <p>Species: <i><span className='text-[#FFC72C]'>{s.gMatch.data?.species}</span></i></p>
                                            <p>Kingdom: {s.gMatch.data?.kingdom}</p>
                                            <p>Phylum: {s.gMatch.data?.phylum}</p>
                                            <p>Order: {s.gMatch.data?.order}</p>
                                            <p>Family: {s.gMatch.data?.family}</p>
                                            <p>Genus: <i>{s.gMatch.data?.genus}</i></p>
                                        </div>
                                    </div>

                                    <div className='fade flex flex-col w-[99%] mt-[25px]'>
                                        <div className='w-full flex text-[1.5rem] justify-center items-center py-[20px]'>
                                            <p> Profile </p>
                                        </div>

                                        <Divider />

                                        <div className='w-full py-[20px] justify-center items-center text-center px-[2%]'>
                                            {s.commonNames.length > 1 && <p>Common Names: {addCommas(s.commonNames)}</p>}
                                            {s.commonNames.length == 1 && <p>Common Names: {s.commonNames[0]}</p>}
                                            {s.profile.extinct !== '' && <p>Extinct: {boolRinse(s.profile.extinct)}</p>}
                                            {s.profile.habitat && <p>Habitat: {toUpperFirstLetter(s.profile.habitat)}</p>}
                                            {s.profile.freshwater !== '' && <p>Freshwater: {boolRinse(s.profile.freshwater)}</p>}
                                            {s.profile.marine !== '' && <p>Marine: {boolRinse(s.profile.marine)}</p>}
                                        </div>
                                    </div>

                                    <div className='fade flex flex-col w-[99%] mt-[25px]'>
                                        <div className='w-full flex text-[1.5rem] justify-center items-center py-[20px]'>
                                            <p> 3D Model </p>
                                        </div>

                                        <Divider />

                                        <div className='w-full py-[20px] justify-center items-center text-center'>
                                            <p>Modeler: {s.model.artistName}</p>
                                            <p>Build method: {s.model.methodology}</p>

                                            {
                                                s.model.createdWithMobile &&
                                                <>
                                                    <div className="flex items-center justify-center">
                                                        <div className='relative h-[24px] w-[24px] inline-block my-2'>
                                                            <Image src='/cellPhone.svg' alt='Mobile Device Icon' fill></Image>
                                                        </div>
                                                        <span className="ml-1">Made with mobile app</span>
                                                    </div>
                                                </>
                                            }

                                            {
                                                s.tags.length > 0 &&
                                                <div className="flex items-center h-fit mt-1 justify-center">
                                                    <div className='relative h-[24px] w-[24px] mr-2 mt-2'>
                                                        <Image src='/tagSvg.svg' alt='Tag Icon' fill></Image>
                                                    </div>
                                                    {
                                                        s.tags.map((tag, i) => {
                                                            return (
                                                                <p key={i} className="bg-[#004C46] dark:bg-[#E5E5E5] text-white dark:text-black mx-[3px] px-[8px] py-[4px] rounded-[3px] mt-[1%] border border-[#00856A] dark:border-none">{tag}</p>
                                                            )
                                                        })

                                                    }

                                                </div>
                                            }

                                            {
                                                s.software.length > 0 &&
                                                <div className="flex items-center h-fit mt-1 justify-center">
                                                    <div className='relative h-[24px] w-[24px] mr-2 mt-1'>
                                                        <Image src='/desktopSvg.svg' alt='Computer Icon' fill></Image>
                                                    </div>
                                                    {
                                                        s.software.map((software, i) => {
                                                            return (
                                                                <p key={i} className="bg-[#004C46] dark:bg-[#E5E5E5] text-white dark:text-black mx-[3px] px-[8px] py-[4px] rounded-[3px] mt-[1%] border border-[#00856A] dark:border-none">{software}</p>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>

                                    <br></br>

                                    {
                                        s.summary &&
                                        <>
                                            <br></br>
                                            <h1 className='fade text-center text-[1.5rem]'>Description</h1>
                                            <p dangerouslySetInnerHTML={{ __html: s.summary.extract_html }} className='fade text-center pr-[1.5%] pl-[0.5%]'></p>
                                            <br></br>
                                            <p className='fade text-center text-[0.9rem]'>from <a href={s.summary.content_urls.desktop.page} target='_blank'><u>Wikipedia</u></a></p>
                                        </>
                                    }

                                </div>
                            </ModalBody>
                            <ModalFooter className="flex justify-center">
                                    <Button color="primary" onPress={() => {props.setOpen(false)}}>OK</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}