"use client"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { boolRinse, addCommas, arrayFromObjects} from './SketchfabDom';
import { toUpperFirstLetter } from '@/utils/toUpperFirstLetter';
import Herbarium from "@/utils/HerbariumClass";
import { GbifResponse } from "@/api/types";
import { photo_annotation } from "@prisma/client";

type annotationModalProps = {
  specimen: Herbarium,
  gMatch: {hasInfo: boolean, data?: GbifResponse}
  title: string;
  index: number | null;
}

export default function AnnotationModal(props: annotationModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const gMatch = props.gMatch.data as GbifResponse
  const s = props.specimen
  const annotations = props.specimen.annotations.annotations

  return (
    <>
      <Button id="annotationButton" className="hidden" onPress={onOpen}></Button>
      <div id='modalDiv'>
        <Modal className="bg-black text-white justify-center" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior={"inside"} size="full" placement="top">
          <ModalContent>
            {(onClose) => (
              <>
                {/*@ts-ignore*/}
                <ModalHeader class='fade' className="flex gap-1 w-full items-center">
                  <p className="text-center text-2xl pt-[20px]">{props.title}</p>
                </ModalHeader>
                <ModalBody>
                  {props.index == 0 &&

                    <p id="WhyAreThereThreeZedosAf">
                      <div className="fade w-full flex justify-center items-center pt-[20px] pb-[20px] text-center flex-col">
                        <div className='text-[1.25rem] border-b border-t border-[#004C46] w-full'>
                          <p> Classification </p>
                        </div><br></br>
                        <p>Species: <i><span className='text-[#FFC72C]'>{gMatch.species}</span></i></p>
                        <p>Kingdom: {gMatch.kingdom}</p>
                        <p>Phylum: {gMatch.phylum}</p>
                        <p>Order: {gMatch.order}</p>
                        <p>Family: {gMatch.family}</p>
                        <p>Genus: <i>{gMatch.genus}</i></p>
                      </div>


                      <div className='fade flex w-full justify-center items-center pt-[20px] pb-[20px] text-center flex-col'>
                        <div className='text-[1.25rem] border-b border-t border-[#004C46] w-full'>
                          <p> Profile </p>
                        </div><br></br>
                        {s.commonNames.length > 1 && <p>Common Names: {addCommas(s.commonNames)}</p>}
                        {s.commonNames.length == 1 && <p>Common Names: {s.commonNames[0]}</p>}
                        {s.profile.extinct !== '' && <p>Extinct: {boolRinse(s.profile.extinct as string)}</p>}
                        {s.profile.habitat && <p>Habitat: {toUpperFirstLetter(s.profile.habitat)}</p>}
                        {s.profile.freshwater !== '' && <p>Freshwater: {boolRinse(s.profile.freshwater as string)}</p>}
                        {s.profile.marine !== '' && <p>Marine: {boolRinse(s.profile.marine as string)}</p>}
                      </div>

                      <div className='fade flex w-full justify-center items-center pt-[20px] pb-[20px] text-center flex-col'>
                        <div className='text-[1.25rem] border-b border-t border-[#004C46] w-full'>
                          <p> 3D Model</p>
                        </div><br></br>
                        <p>Build method: {s.model.build_process}</p>
                        <p>Created with: {arrayFromObjects(s.software)}</p>
                        <p>Images: {s.image_set[0].no_of_images}</p>
                        <p>Modeler: {s.model.modeled_by}</p>
                        <p>Annotator: {s.getAnnotator()}</p>
                      </div>

                      {s.wikiSummary &&
                        <div className='fade flex w-full justify-center items-center pt-[20px] pb-[20px] text-center flex-col'>
                          <div className='text-[1.25rem] border-b border-t border-[#004C46] w-full'>
                            <p>Description</p>
                          </div><br></br>
                          <p dangerouslySetInnerHTML={{ __html: s.wikiSummary.extract_html }}></p><br></br>
                          <p className="text-[0.9rem]">from <a href={s.wikiSummary.content_urls.desktop.page} target='_blank'><u>Wikipedia</u></a></p>
                        </div>}
                    </p>}

                  {!!props.index && annotations[props.index - 1].annotation_type !== 'video' &&

                    <p id="modalMedia2">
                      <div className="fade w-full h-full text-center">
                        <img className="center w-full h-[50vh]" src={encodeURI(decodeURI(annotations[props.index - 1].url as string))} alt={`Annotation number ${annotations[props.index - 1].annotation_no}`}></img>
                      </div>
                    </p>}

                  {!!props.index && annotations[props.index - 1].annotation_type === 'photo' &&
                    <span>
                      <p id="modalText">
                        <br></br>
                        <p dangerouslySetInnerHTML={{ __html: annotations[props.index - 1].annotation }} className="m-auto text-center fade"></p>
                      </p>
                      <p id="modalCitation">
                        <br></br>
                        <p className="fade text-center w-[95%]"> Photo by: {(annotations[props.index - 1].annotation as photo_annotation).author}, licensed under <a href='https://creativecommons.org/share-your-work/cclicenses/' target='_blank'>{(annotations[props.index - 1].annotation as photo_annotation).license}</a></p>
                      </p>
                    </span>}

                  {!!props.index && annotations[props.index - 1].annotation_type == 'video' &&
                    <p id="modalVideo">
                      <iframe className="w-full h-[77.5vh] fade" src={annotations[props.index - 1].url as string}></iframe>
                    </p>}
                </ModalBody>
                <ModalFooter className="justify-center">
                  <Button className="bg-[#004C46] text-white" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
