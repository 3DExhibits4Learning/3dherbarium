/**
 * @file /src/app/components/map/MapOptions.tsx
 * 
 * @fileoverview Drop down menu for different search parameters on the map
 * 
 * @todo
 */

"use client"
//custom imports
import { MapContext, MapContextData } from '@/components/Collections/iNaturalistNEW';

//library imports
import { useContext, useState } from "react"

export function MapOptions() {

    //The global context being used by all child components
    const context = useContext(MapContext) as MapContextData
    const data = context.state

    const displayOptions = data.displayOptions;
    const [radius, setRadius] = useState<number>(displayOptions.radius);
    const [displayAmount, setDisplayAmount] = useState<number>(displayOptions.displayAmount);
    const [beforeDate, setBeforeDate] = useState<string>(displayOptions.beforeDate);  
    const [sinceDate, setSinceDate] = useState<string>(displayOptions.sinceDate);
    const [gradeType, setGradeType] = useState<string>(displayOptions.gradeType);
    const[useCurrentLocation, setUseCurrentLocation] = useState<boolean>(displayOptions.useCurrentLocation);

    /**
     * @param event the event called when the form is submitted
     */
    const handleSubmit = (event : React.FormEvent) => {
        event.preventDefault()

        //update the global state when the user submits the form
        context.dispatch({
            type:"SET_DISPLAY_OPTIONS",
            payload: {
                radius,
                displayAmount,
                beforeDate,
                sinceDate,
                gradeType,
                useCurrentLocation
            }
        })
    }
    
    return (
    <>
    <form className="" onSubmit={handleSubmit}>
        <div className="mb-4">
            <input
                id="radius"
                type="number"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                min={1}
                max={75}
                className="mt-1 block w-full dark:bg-[#27272a] rounded-md p-2 focus:outline-none focus:ring focus:ring-[#004C46]"
            />

            <label htmlFor="radius" className="block mb-2">Radius of search</label>
        </div>

        <div className="mb-4">
            <input
                id="display"
                type="number"
                value={displayAmount}
                onChange={(e) => setDisplayAmount(Number(e.target.value))}
                max={30}
                min={1}
                className="mt-1 block w-full dark:bg-[#27272a] rounded-md p-2 focus:outline-none focus:ring focus:ring-[#004C46]"
            />

            <label htmlFor="display" className="block mb-2">Max Occurrences</label>
        </div>

        <div className="mb-4">
            <input
                id="date-before"
                type="date"
                value={beforeDate !== '' ? new Date(beforeDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setBeforeDate(e.target.value)}
                className="mt-1 block w-full dark:bg-[#27272a] rounded-md p-2 focus:outline-none focus:ring focus:ring-[#004C46]"
            />

            <label htmlFor="date-before" className="block mb-2">Before date</label>
        </div>

        <div className="mb-4">
            <input
                id="date-since"
                type="date"
                value={sinceDate !== '' ? new Date(sinceDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setSinceDate(e.target.value)}
                className="mt-1 block w-full dark:bg-[#27272a] rounded-md p-2 focus:outline-none focus:ring focus:ring-[#004C46]"
            />

            <label htmlFor="date-since" className="block mb-2">Since date</label>
        </div>

        <div className="mb-4 accent-[#00856A]">
            <input 
                id="use-my-location"
                type="checkbox" 
                checked={useCurrentLocation} 
                onChange={() => {
                    const newValue = !useCurrentLocation;
                    setUseCurrentLocation(newValue);
                }}
                className="mt-1 dark:bg-[#27272a] rounded-md p-2"
            />
             <label htmlFor="use-my-location" className=" mb-2 pl-2">Use My Location</label>
        </div>

        <div className="mb-8">
        <select
            id="grade-type"
            value={gradeType}
            onChange={(e) => setGradeType(e.target.value)}
            className="mt-1 block w-full dark:bg-[#27272a] rounded-md p-2 focus:outline-none focus:ring focus:ring-[#004C46]"
            >
                <option value="needs_id,research,casual">None</option>
                <option value="needs_id,research">Verifiable</option>
                <option value="research">Researched</option>
            </select>
                
            <label htmlFor="grade-type" className="block"> Grade type </label>
        </div>

        <div className="flex justify-center items-center m-0">
                <button type="submit" className="bg-[#004C46] text-white py-2 px-4 rounded">
                    Submit
                </button>
            </div>
    </form>
    </>
    )
}