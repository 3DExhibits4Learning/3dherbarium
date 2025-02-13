/**
 * @file src/components/Collections/SketchfabApi/TaxAndDescription.tsx
 * 
 * @fileoverview Taxonomy and description (first annotation)
 */
'use client'

// Typical imports
import { GbifResponse } from "@/ts/types"
import { sketchfabApiData } from "@/ts/collections"

// Default imports
import Geolocation from "./Geolocation"
import Classification from "./Classification"
import Profile from "./Profile"
import ModelData from "./ModelData"
import Wikipedia from "./Wikipedia"

// Main JSX
export default function TaxonomyAndDescription(props:{gMatch: GbifResponse, sketchfabApi: sketchfabApiData}) {
    return (
        <div className="w-full h-fit" id="annotationDivMedia">
            <Classification gMatch={props.gMatch} />
            {
                props.sketchfabApi.s?.specimen.lat && props.sketchfabApi.s?.specimen.lng &&
                <Geolocation position={{lat: parseFloat(props.sketchfabApi.s?.specimen.lat), lng: parseFloat(props.sketchfabApi.s?.specimen.lng)}} locality={props.sketchfabApi.s?.specimen.locality} />
            }
            <Profile sketchfabApi={props.sketchfabApi} />
            <ModelData sketchfabApi={props.sketchfabApi} />
            <br></br>
            <Wikipedia sketchfabApi={props.sketchfabApi} />
        </div>
    )
}