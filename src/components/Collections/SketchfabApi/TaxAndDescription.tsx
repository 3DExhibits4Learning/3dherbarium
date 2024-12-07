'use client'

import Classification from "./Classification"
import Profile from "./Profile"
import ModelData from "./ModelData"
import Wikipedia from "./Wikipedia"
import { GbifResponse } from "@/api/types"

export default function TaxonomyAndDescription(props:{gMatch: GbifResponse, sketchfabApi: any}) {
    return (
        <div className="w-full h-[65%]" id="annotationDivMedia" style={{ display: "block" }}>
            <Classification gMatch={props.gMatch} />
            <Profile sketchfabApi={props.sketchfabApi} />
            <ModelData sketchfabApi={props.sketchfabApi} />
            <br></br>
            <Wikipedia sketchfabApi={props.sketchfabApi} />
        </div>
    )
}