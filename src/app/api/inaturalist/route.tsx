/**
 * @file /src/app/api/collections/inaturalist/route.tsx
 * 
 * @fileoverview the route for getting all data for the {@link MapClientWrapper} component
 * 
 * @todo 
 */

import { NextResponse } from 'next/server';
import { fetchSpecimenObservations } from "@/app/api/inaturalist/fetchFunctions"

/**
 * The exposed post endpoint `collections/inaturalist`
 * @param request  
 * @returns A response of the data fetched 
 */
export async function POST(request: Request) {

    try {
        const data = await request.json();

        const { specimenName, coordinate, searchOptions } = data;

        // Validate input
        if (!specimenName || !coordinate || !searchOptions)
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });

        const observations = await fetchSpecimenObservations(specimenName, coordinate, searchOptions);

        return NextResponse.json(observations, { status: 200 });

    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
