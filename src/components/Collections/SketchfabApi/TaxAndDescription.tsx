'use client'

import { GbifResponse } from "@/api/types"

import Geolocation from "./Geolocation"
import Classification from "./Classification"
import Profile from "./Profile"
import ModelData from "./ModelData"
import Wikipedia from "./Wikipedia"
import { sketchfabApiData } from "@/ts/collections"

export default function TaxonomyAndDescription(props:{gMatch: GbifResponse, sketchfabApi: sketchfabApiData}) {
    return (
        <div className="w-full h-fit" id="annotationDivMedia">
            <Classification gMatch={props.gMatch} />
            <Geolocation sketchfabApi={props.sketchfabApi} />
            <Profile sketchfabApi={props.sketchfabApi} />
            <ModelData sketchfabApi={props.sketchfabApi} />
            <br></br>
            <Wikipedia sketchfabApi={props.sketchfabApi} />
        </div>
    )
}