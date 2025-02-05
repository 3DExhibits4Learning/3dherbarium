/**
 * @file SketchFabApi.tsx
 * 
 * @fileoverview client component which renders the 3D models and annotations
 * 
 */

"use client"

// Import all corresponding functions
import * as fn from '@/functions/client/collections/sketchfabApi'

// Typical imports
import { GbifResponse } from '@/api/types';
import { useEffect, useRef, useContext, createContext, useReducer } from 'react';
import { CollectionsContext } from '../CollectionsWrapper/CollectionsWrapper';
import { CollectionsWrapperData } from '@/ts/reducer';
import { sketchfabApiData, sketchfabApiContext, initialState } from '@/ts/collections';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

// Default imports
import Sketchfab from '@sketchfab/viewer-api';
import AnnotationModal from '@/components/Collections/SketchfabApi/AnnotationModal';
import Herbarium from '@/utils/HerbariumClass';
import sketchFabApiReducer from '@/functions/client/reducers/SketchfabApiDataReducer';
import ModelViewer from './ModelViewer';
import Annotation from './Annotation';
import FullPageError from '../../Error/FullPageError';

// Exported context
export const SketchfabApiContext = createContext<sketchfabApiContext | ''>('')

// Main JSX
export default function SFAPI(props: { numberOfAnnotations: number }) {

  const path = usePathname()
  const router = useRouter()

  // Get context
  const wrapperProps = (useContext(CollectionsContext) as CollectionsWrapperData).collectionsWrapperProps
  const gMatch = wrapperProps.gMatch.data as GbifResponse

  // Check for an annotation number parameter and ensure its validity
  const params = useSearchParams()
  const annotationParam = params.get('annotation')
  const annotationNumberParam = annotationParam && fn.isAnnotationParamValid(annotationParam, props.numberOfAnnotations) ? annotationParam : undefined
  if(annotationParam) console.log('annotationValid: ', fn.isAnnotationParamValid(annotationParam, props.numberOfAnnotations))

  // Initial state and reducer
  const initialData: sketchfabApiData = { ...initialState, annotationNumParam: annotationNumberParam }
  const [sketchfabApi, sketchfabApiDispatch] = useReducer(sketchFabApiReducer, initialData)

  // Refs
  const sRef = useRef<Herbarium>() // sRef = specimenRef
  const modelViewer = useRef<HTMLIFrameElement>()
  const annotationDiv = useRef<HTMLDivElement>()

  // Direct dom references to annotation switches
  const annotationSwitch = document.getElementById("annotationSwitch") as HTMLInputElement
  const annotationSwitchMobile = document.getElementById("annotationSwitchMobileHidden") as HTMLInputElement

  // Annotation switch wrappers; annotationSelectWrapper
  const annotationSwitchWrapper = (event: Event) => fn.annotationSwitchListener(event, sketchfabApi, modelViewer, annotationDiv)
  const mobileAnnotationSwitchWrapper = (event: Event) => fn.annotationSwitchMobileListener(event, sketchfabApi, modelViewer, annotationDiv)
  const annotationSelectWrapper = (index: number) => fn.annotationSelectHandler(index, sketchfabApi.api, sketchfabApiDispatch, params, path, router)

  // Success object for init method of Sketchfab object (mobile)
  const successObj = {
    success: (api: any) => { api.start(); api.addEventListener('viewerready', () => sketchfabApiDispatch({ type: 'setApi', api: api })) },
    error: (e: any) => { throw Error(e.message) },
    ui_stop: 0, ui_infos: 0, ui_inspector: 0, ui_settings: 0, ui_watermark: 0, ui_annotations: 0, ui_color: "004C46", ui_fadeout: 0
  }

  //  Success object for init method of Sketchfab object (desktop); provider object
  console.log('Annotation Number Param: ', sketchfabApi.annotationNumParam)
  const successObjDesktop = { ...successObj, annotation: sketchfabApi.annotationNumParam ? parseInt(sketchfabApi.annotationNumParam) : 1, ui_fadeout: 1 }
  const sketchfabProviderValue: sketchfabApiContext = { sketchfabApi, sketchfabApiDispatch }

  // Initialize model viewer and instantiate herbarium specimen object; initialize annotations and event listeners; handle photo source if selected annotation is a photo annotation
  useEffect(() => fn.initializeCollections(new Sketchfab(modelViewer.current), successObj, successObjDesktop, sRef, wrapperProps, sketchfabApiDispatch), []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => fn.initializeAnnotationsAndListeners(sketchfabApi, sketchfabApiDispatch, annotationSwitch, annotationSwitchMobile, annotationSwitchWrapper, mobileAnnotationSwitchWrapper, annotationSelectWrapper), [sketchfabApi.api, sketchfabApi.annotations, sketchfabApi.s])
  useEffect(() => fn.photoSrcChangeHandler(sketchfabApi, sketchfabApiDispatch), [sketchfabApi.index]) // eslint-disable-line react-hooks/exhaustive-deps

  // Error state return
  if (sketchfabApi.error) return <FullPageError clientErrorMessage={sketchfabApi.errorMessage as string} />

  // JSX
  return <SketchfabApiContext.Provider value={sketchfabProviderValue}>

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
    <meta name="description" content={`An annotated 3D model of ${wrapperProps.model[0].spec_name}`}></meta>

    {sketchfabApi.s && <AnnotationModal {...wrapperProps} title={sketchfabApi.annotationTitle} index={sketchfabApi.mobileIndex} specimen={sketchfabApi.s} />}

    <div id="iframeDiv" className="flex bg-black m-auto min-h-[150px] h-full w-full">
      <ModelViewer uid={wrapperProps.model[0].uid} ref={modelViewer} />
      {sketchfabApi.s && sketchfabApi.annotations && <Annotation sketchfabApi={sketchfabApi} gMatch={gMatch} ref={annotationDiv} />}
    </div >

  </SketchfabApiContext.Provider>
}