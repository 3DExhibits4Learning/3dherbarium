'use client'

import { GbifResponse } from "@/api/types"
import { sketchfabApiData } from "@/ts/collections"

import Geolocation from "./Geolocation"
import Classification from "./Classification"
import Profile from "./Profile"
import ModelData from "./ModelData"
import Wikipedia from "./Wikipedia"

export default function TaxonomyAndDescription(props:{gMatch: GbifResponse, sketchfabApi: sketchfabApiData}) {
    return (
        <div className="w-full h-fit" id="annotationDivMedia">
            <Classification gMatch={props.gMatch} />
            {
                props.sketchfabApi.s?.model.lat && props.sketchfabApi.s?.model.lng &&
                <Geolocation position={{lat: parseFloat(props.sketchfabApi.s?.model.lat), lng: parseFloat(props.sketchfabApi.s?.model.lng)}} locality={props.sketchfabApi.s?.model.locality} />
            }
            <Profile sketchfabApi={props.sketchfabApi} />
            <ModelData sketchfabApi={props.sketchfabApi} />
            <br></br>
            <Wikipedia sketchfabApi={props.sketchfabApi} />
        </div>
    )
}