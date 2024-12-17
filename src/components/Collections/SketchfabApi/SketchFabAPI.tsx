/**
 * @file SketchFabApi.tsx
 * 
 * @fileoverview client component which renders the 3D models and annotations
 * 
 * @todo move try-catch blocks inside of effects
 */

"use client"

// Import all corresponding functions
import * as fn from '@/functions/client/collections/sketchfabApi'

// Typical imports
import { GbifResponse } from '@/api/types';
import { useEffect, useRef, useContext, createContext, useReducer } from 'react';
import { CollectionsContext } from '../CollectionsWrapper';
import { CollectionsWrapperData } from '@/ts/reducer';
import { sketchfabApiData } from '@/ts/collections';

// Default imports
import Sketchfab from '@sketchfab/viewer-api';
import AnnotationModal from '@/components/Collections/AnnotationModal';
import Herbarium from '@/utils/HerbariumClass';
import sketchFabApiReducer from '@/functions/client/reducers/SketchfabApiDataReducer';
import ModelViewer from './ModelViewer';
import Annotation from './Annotation';
import FullPageError from '../../Error/FullPageError';

// Initial context data
const initialData = {
  s: undefined, // s = specimen
  annotations: undefined,
  api: undefined,
  index: null,
  mobileIndex: null,
  imgSrc: undefined,
  annotationTitle: "",
  skeletonClassName: 'bg-black h-full hidden',
  loadingPhoto: false
}

// Exported context
export const SketchfabApiContext = createContext<sketchfabApiData>(initialData)

// Main JSX
export default function SFAPI() {

  //try {
    
    // Get context
    const props = (useContext(CollectionsContext) as CollectionsWrapperData).collectionsWrapperProps
    const gMatch = props.gMatch.data as GbifResponse

    // Reducer
    const [sketchfabApi, sketchfabApiDispatch] = useReducer(sketchFabApiReducer, initialData)

    // Refs
    const sRef = useRef<Herbarium>() // sRef = specimenRef
    const modelViewer = useRef<HTMLIFrameElement>()
    const annotationDiv = useRef<HTMLDivElement>()

    // Direct dom references to annotation switches
    const annotationSwitch = document.getElementById("annotationSwitch") as HTMLInputElement
    const annotationSwitchMobile = document.getElementById("annotationSwitchMobileHidden") as HTMLInputElement

    // Annotation switch wrappers
    const annotationSwitchWrapper = (event: Event) => fn.annotationSwitchListener(event, sketchfabApi, modelViewer, annotationDiv)
    const mobileAnnotationSwitchWrapper = (event: Event) => fn.annotationSwitchMobileListener(event, sketchfabApi, modelViewer, annotationDiv)

    // Success object for init method of Sketchfab object (mobile)
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

    //  Success object for init method of Sketchfab object (desktop)
    const successObjDesktop = { ...successObj, annotation: 1, ui_fadeout: 1 }

    // Initialize model viewer and instantiate herbarium specimen object; initialize annotations and event listeners; handle photo source if selected annotation is a photo annotation
    useEffect(() => fn.initializeCollections(new Sketchfab(modelViewer.current), successObj, successObjDesktop, sRef, props, sketchfabApiDispatch), []) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => fn.initializeAnnotationsAndListeners(sketchfabApi, sketchfabApiDispatch, annotationSwitch, annotationSwitchMobile, annotationSwitchWrapper, mobileAnnotationSwitchWrapper), [sketchfabApi.api, sketchfabApi.annotations, sketchfabApi.s])
    useEffect(() => fn.photoSrcChangeHandler(sketchfabApi, sketchfabApiDispatch), [sketchfabApi.index]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <SketchfabApiContext.Provider value={sketchfabApi}>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
        <meta name="description" content={`An annotated 3D model of ${props.model[0].spec_name}`}></meta>
        {
          sketchfabApi.s &&
          <AnnotationModal {...props} title={sketchfabApi.annotationTitle} index={sketchfabApi.mobileIndex} specimen={sketchfabApi.s} />
        }
        <div id="iframeDiv" className="flex bg-black m-auto min-h-[150px] h-full w-full">
          <ModelViewer uid={props.model[0].uid} ref={modelViewer} />
          {
            sketchfabApi.s && sketchfabApi.annotations &&
            <Annotation sketchfabApi={sketchfabApi} gMatch={gMatch} ref={annotationDiv} />
          }
        </div >
      </SketchfabApiContext.Provider>
    )
  }
  // Typical catch
  //catch (e: any) { return <FullPageError clientErrorMessage={e.message} /> }
//}