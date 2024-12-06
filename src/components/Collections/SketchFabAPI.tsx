/**
 * @file SketchFabAPI.tsx
 * @fileoverview Client component which renders the 3D models and annotations.
 */

"use client"

import * as fn from '@/functions/client/collections/sketchfabApi'

// Typical imports
import { GbifResponse } from '@/api/types';
import { isMobileOrTablet } from '@/utils/isMobile';
import { useEffect, useRef, LegacyRef, useContext, createContext, useReducer } from 'react';
import { toUpperFirstLetter } from '@/utils/toUpperFirstLetter';
import { model_annotation, photo_annotation } from '@prisma/client';
import { boolRinse, addCommas, arrayFromObjects } from './SketchfabDom';
import { CollectionsContext } from './CollectionsWrapper';
import { CollectionsWrapperData } from '@/ts/reducer';
import { sketchfabApiData } from '@/ts/collections';

// Default imports
import Sketchfab from '@sketchfab/viewer-api';
import AnnotationModal from '@/components/Collections/AnnotationModal';
import ModelAnnotation from './AnnotationModel';
import Herbarium from '@/utils/HerbariumClass';
import sketchFabApiReducer from '@/functions/client/reducers/SketchfabApiDataReducer';

// Initial context data
const initialData = {
  s: undefined, // Note that s = specimen
  annotations: undefined,
  api: undefined,
  index: null,
  mobileIndex: null,
  imgSrc: undefined,
  annotationTitle: "",
  skeletonClassName: 'bg-black h-full hidden'
}

// Exported context
export const SketchfabApiContext = createContext<sketchfabApiData>(initialData)

// Main JSX
const SFAPI = () => {

  // Get context
  const props = (useContext(CollectionsContext) as CollectionsWrapperData).collectionsWrapperProps
  const gMatch = props.gMatch.data as GbifResponse

  // Reducer
  const [sketchfabApi, sketchfabApiDispatch] = useReducer(sketchFabApiReducer, initialData)

  // Refs
  const sRef = useRef<Herbarium>()
  const modelViewer = useRef<HTMLIFrameElement>()
  const annotationDiv = useRef<HTMLDivElement>()

  // Direct dom references (needs to be updated)
  const annotationSwitch = document.getElementById("annotationSwitch");
  const annotationSwitchMobile = document.getElementById("annotationSwitchMobileHidden");

  // Annotation switch wrappers
  const annotationSwitchWrapper = (event: Event) => fn.annotationSwitchListener(event, sketchfabApi, modelViewer, annotationDiv)
  const mobileAnnotationSwitchWrapper = (event: Event) => fn.annotationSwitchMobileListener(event, sketchfabApi, modelViewer, annotationDiv)

  // Mobile success object for init method of Sketchfab object 
  const successObj = {
    success: (api: any) => { api.start(); api.addEventListener('viewerready', () => sketchfabApiDispatch({ type: 'setApi', api: api })) },
    error: (e: any) => { throw Error(e.message) },
    ui_stop: 0,
    ui_infos: 0,
    ui_inspector: 0,
    ui_settings: 0,
    ui_watermark: 0,
    ui_annotations: 0,
    ui_color: "004C46",
    ui_fadeout: 0
  }

  // Desktop success object for init method of Sketchfab object
  const successObjDesktop = { ...successObj, annotation: 1, ui_fadeout: 1 }

  // This effect initializes the sketchfab client and instantiates the specimen:Herbarium object; it also ensures the page begins from the top upon load
  useEffect(() => {

    // Initialize and instantiate
    fn.initializeModelViewer(new Sketchfab(modelViewer.current), props.model[0].uid, successObj, successObjDesktop)
    fn.instantiateHerbarium(sRef, props, sketchfabApiDispatch)

    // Scroll to top onLoad (this bug may have been resolved and this line may no longer be necessary, but JIC for now)
    document.body.scrollTop = document.documentElement.scrollTop = 0

  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // This effect implements any databased annotations and adds annotationSwitch event listeners and sets related mobile states
  useEffect(() => {

    if (sketchfabApi.s && sketchfabApi.annotations && sketchfabApi.api) {

      // Create the first annotation if it exists
      if (sketchfabApi.s.model.annotationPosition) {
        
        const position = JSON.parse(sketchfabApi.s.model.annotationPosition)
        
        sketchfabApi.api.createAnnotationFromScenePosition(position[0], position[1], position[2], 'Taxonomy and Description', '', (err: any, index: any) => {
          if (!(isMobileOrTablet() || window.matchMedia('(max-width: 1023.5px)').matches)) {
            sketchfabApi.api.gotoAnnotation(0, { preventCameraAnimation: true, preventCameraMove: false }, function (err: any, index: any) { })
          }
        })

        // Create any futher annotations that exist
        for (let i = 0; i < sketchfabApi.annotations.length; i++) {
          if (sketchfabApi.annotations[i].position) {
            const position = JSON.parse(sketchfabApi.annotations[i].position as string)
            sketchfabApi.api.createAnnotationFromScenePosition(position[0], position[1], position[2], `${sketchfabApi.annotations[i].title}`, '', (err: any, index: any) => { })
          }
        }
      }

      // Get annotationList/add event listeners
      sketchfabApi.api.getAnnotationList(function (err: any, annotations: any) {
        (annotationSwitch as HTMLInputElement).addEventListener("change", annotationSwitchWrapper);
        (annotationSwitchMobile as HTMLInputElement).addEventListener("change", mobileAnnotationSwitchWrapper)
      })

      // Set index when an annotation is selected
      sketchfabApi.api.addEventListener('annotationSelect', function (index: number) {

        const mediaQueryWidth = window.matchMedia('(max-width: 1023.5px)')
        const mediaQueryOrientation = window.matchMedia('(orientation: portrait)')

        // this event is still triggered even when an annotation is not selected; an index of -1 is returned
        if (index != -1) sketchfabApiDispatch({ type: 'setStringOrNumber', field: 'index', value: index })

        // Mobile annotation state management
        if (index != -1 && mediaQueryWidth.matches || index != -1 && mediaQueryOrientation.matches) {
          document.getElementById("annotationButton")?.click()
          sketchfabApi.api.getAnnotation(index, function (err: any, information: any) {
            if (!err) sketchfabApiDispatch({ type: 'setMobileAnnotation', index: index, title: information.name })
          })
        }
      })
    }
  }, [sketchfabApi.api, sketchfabApi.annotations, sketchfabApi.s])


  // This effect sets the imgSrc if necessary upon change of annotation index
  useEffect(() => {

    if (!!sketchfabApi.index && sketchfabApi.annotations &&
      sketchfabApi.annotations[sketchfabApi.index - 1].annotation_type == 'photo' &&
      (sketchfabApi.annotations[sketchfabApi.index - 1].annotation as photo_annotation)?.url.startsWith('/data/Herbarium/Annotations')) {

      sketchfabApiDispatch({ type: 'setStringOrNumber', field: 'skeletonClassname', value: 'bg-black h-full' })
      fn.setImageFromNfs((sketchfabApi.annotations[sketchfabApi.index - 1].annotation as photo_annotation)?.url, sketchfabApiDispatch)
    }

    else if (!!sketchfabApi.index && sketchfabApi.annotations &&
      sketchfabApi.annotations[sketchfabApi.index - 1].annotation_type == 'photo' &&
      (sketchfabApi.annotations[sketchfabApi.index - 1].annotation as photo_annotation)?.photo) {

      const base64String = Buffer.from((sketchfabApi.annotations[sketchfabApi.index - 1].annotation as photo_annotation).photo as Buffer).toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64String}`
      sketchfabApiDispatch({ type: 'setStringOrNumber', field: 'imgSrc', value: dataUrl })
    }

    else if (!!sketchfabApi.index && sketchfabApi.annotations) sketchfabApiDispatch({ type: 'setStringOrNumber', field: 'imgSrc', value: sketchfabApi.annotations[sketchfabApi.index - 1].url as string })

  }, [sketchfabApi.index]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>

      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
      <meta name="description" content={`An annotated 3D model of ${props.model[0].spec_name}`}></meta>

      {
        sketchfabApi.s &&
        <AnnotationModal {...props} title={sketchfabApi.annotationTitle} index={sketchfabApi.mobileIndex} specimen={sketchfabApi.s} />
      }

      <div id="iframeDiv" className="flex bg-black m-auto min-h-[150px]" style={{ height: "100%", width: "100%" }}>

        <iframe src={props.model[0].uid} frameBorder="0" id="model-viewer" title={"Model Viewer for " + ''}
          allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking="true"
          execution-while-out-of-viewport="true" execution-while-not-rendered="true" web-share="true"
          allowFullScreen
          style={{ width: "60%", transition: "width 1.5s", zIndex: "2" }}
          ref={modelViewer as LegacyRef<HTMLIFrameElement>}
        />

        {
          sketchfabApi.s && sketchfabApi.annotations && <>

            <div id="annotationDiv" ref={annotationDiv as LegacyRef<HTMLDivElement>} style={{ width: "40%", backgroundColor: "black", transition: "width 1.5s", color: "#F5F3E7", zIndex: "1", overflowY: "auto", overflowX: "hidden" }}>

              {
                sketchfabApi.index == 0 &&

                <div className="w-full h-[65%]" id="annotationDivMedia" style={{ display: "block" }}>
                  <div className='fade flex w-[99%] mt-[25px]'>
                    <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                      <p> Classification </p>
                    </div>
                    <div className='w-[65%] py-[20px] justify-center items-center text-center'>
                      <p>Species: <i><span className='text-[#FFC72C]'>{gMatch.species}</span></i></p>
                      <p>Kingdom: {gMatch.kingdom}</p>
                      <p>Phylum: {gMatch.phylum}</p>
                      <p>Order: {gMatch.order}</p>
                      <p>Family: {gMatch.family}</p>
                      <p>Genus: <i>{gMatch.genus}</i></p>
                    </div>
                  </div>

                  <div className='fade flex w-[99%] mt-[25px]'>
                    <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                      <p> Profile </p>
                    </div>
                    <div className='w-[65%] py-[20px] justify-center items-center text-center px-[2%]'>
                      {sketchfabApi.s.commonNames.length > 1 && <p>Common Names: {addCommas(sketchfabApi.s.commonNames)}</p>}
                      {sketchfabApi.s.commonNames.length == 1 && <p>Common Names: {sketchfabApi.s.commonNames[0]}</p>}
                      {sketchfabApi.s.profile.extinct !== '' && <p>Extinct: {boolRinse(sketchfabApi.s.profile.extinct as string)}</p>}
                      {sketchfabApi.s.profile.habitat && <p>Habitat: {toUpperFirstLetter(sketchfabApi.s.profile.habitat)}</p>}
                      {sketchfabApi.s.profile.freshwater !== '' && <p>Freshwater: {boolRinse(sketchfabApi.s.profile.freshwater as string)}</p>}
                      {sketchfabApi.s.profile.marine !== '' && <p>Marine: {boolRinse(sketchfabApi.s.profile.marine as string)}</p>}
                    </div>
                  </div>

                  <div className='fade flex w-[99%] mt-[25px]'>
                    <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                      <p> 3D Model </p>
                    </div>
                    <div className='w-[65%] py-[20px] justify-center items-center text-center'>
                      <p>Build method: {sketchfabApi.s.model.build_process}</p>
                      <p>Created with: {arrayFromObjects(sketchfabApi.s.software)}</p>
                      <p>Images: {sketchfabApi.s.image_set[0].no_of_images}</p>
                      <p>Modeler: {sketchfabApi.s.model.modeled_by}</p>
                      <p>Annotator: {sketchfabApi.s.getAnnotator()}</p>
                    </div>
                  </div>

                  <br></br>

                  {
                    sketchfabApi.s.wikiSummary &&
                    <>
                      <br></br>
                      <h1 className='fade text-center text-[1.5rem]'>Description</h1>
                      <p dangerouslySetInnerHTML={{ __html: sketchfabApi.s.wikiSummary.extract_html }} className='fade text-center pr-[1.5%] pl-[0.5%]'></p>
                      <br></br>
                      <p className='fade text-center text-[0.9rem]'>from <a href={sketchfabApi.s.wikiSummary.content_urls.desktop.page} target='_blank'><u>Wikipedia</u></a></p>
                    </>
                  }

                </div>
              }

              {
                !!sketchfabApi.index && sketchfabApi.annotations[sketchfabApi.index - 1].annotation_type === 'photo' && sketchfabApi.skeletonClassName &&
                <>
                  <div className="w-full h-[65%]" id="annotationDivMedia" style={{ display: "block" }}>

                    <div className='w-full h-full text-center fade'>
                      <img key={Math.random()} className='fade center w-[98%] h-full pr-[2%] pt-[1%]'
                        src={sketchfabApi.imgSrc}
                        alt={`Image for annotation number ${sketchfabApi.annotations[sketchfabApi.index - 1].annotation_no}`}
                      >
                      </img>
                    </div>

                  </div>

                  <div id="annotationDivText">
                    <br></br>
                    <p dangerouslySetInnerHTML={{ __html: (sketchfabApi.annotations[sketchfabApi.index - 1].annotation as photo_annotation).annotation }} className='m-auto pr-[3%] pl-[2%] text-center fade' />
                  </div>
                  <div id="annotationDivCitation">
                    <br></br>
                    <p className='fade text-center w-[95%]'>Photo by: {(sketchfabApi.annotations[sketchfabApi.index - 1].annotation as photo_annotation).author}, licensed under <a href='https://creativecommons.org/share-your-work/cclicenses/' target='_blank'>{(sketchfabApi.annotations[sketchfabApi.index - 1].annotation as photo_annotation).license}</a></p>
                  </div>
                </>
              }

              {
                !!sketchfabApi.index && sketchfabApi.annotations[sketchfabApi.index - 1].annotation_type === 'video' &&
                <div className="w-full h-full" id="annotationDivVideo">
                  {/*@ts-ignore - align works on iframe just fine*/}
                  <iframe align='left' className='fade w-[calc(100%-15px)] h-full' src={annotations[index - 1].url}></iframe>
                </div>
              }

              {
                !!sketchfabApi.index && sketchfabApi.annotations[sketchfabApi.index - 1].annotation_type === 'model' &&
                <>
                  <div className="w-full h-[65%]" id="annotationDivMedia" style={{ display: "block" }}>
                    <ModelAnnotation uid={(sketchfabApi.annotations[sketchfabApi.index - 1].annotation as model_annotation).uid} />
                  </div>
                  <div id="annotationDivText">
                    <br></br>
                    <p dangerouslySetInnerHTML={{ __html: (sketchfabApi.annotations[sketchfabApi.index - 1].annotation as photo_annotation).annotation }} className='m-auto pr-[3%] pl-[2%] text-center fade' />
                  </div>
                  <div id="annotationDivCitation">
                    <br></br>
                    <p className='fade text-center w-[95%]'>Model by {(sketchfabApi.annotations[sketchfabApi.index - 1].annotation as model_annotation).modeler}</p>
                  </div>
                </>
              }

            </div>
          </>
        }
      </div >
    </>
  )
}
export default SFAPI
