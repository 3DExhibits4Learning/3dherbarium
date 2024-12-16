export async function POST(request: Request) {
    const data = await request.json()
    
    let coordinates: { lat: number, lng: number } | undefined
    let observations: any[] | undefined
    let imageArr: { original: string, thumbnail: string }[] | undefined

    try {
        const getMarkerLocation = async () => {
            const observation = await fetch(`https://api.inaturalist.org/v1/observations?taxon_name=${data.activeSpecies}&photos=true`)
                .then(res => res.json()).then(json => {
                    const results = json.results

                    if (results.length) {
                        for (let i in results) {
                            const point = results[i].geojson?.coordinates ?? ''
                            if (point) {
                                coordinates = { lat: point[1] as number, lng: point[0] as number }
                                break
                            }
                        }
                    }

                    if (coordinates) return true
                    else return false
                })
            return observation
        }

        const getLeaders = async (type: 'observers' | 'identifiers') => {
            const point = data.userCoordinates ? data.userCoordinates : coordinates
            const leaders = await fetch(`https://api.inaturalist.org/v1/observations/${type}?taxon_name=${data.activeSpecies}&lat=${point.lat}&lng=${point.lng}&radius=75&photos=true`)
            .then(res => res.json()).then(json => json.results.splice(0, 10))
            return leaders
        }

        const getSurroundingObservations = async (url: string) => {
            await fetch(url)
                .then(res => res.json()).then((json) => {
                    if (json.results.length) {

                        const images = []
                        for (let i in json.results) {
                            const image = json.results[i].photos[0].url.replace('square', 'large')
                            images.push({ original: image, thumbnail: json.results[i].photos[0].url })
                        }

                        observations = json.results
                        imageArr = images
                    }
                })
        }

        if (data.userCoordinates) {
            await getSurroundingObservations(`https://api.inaturalist.org/v1/observations?taxon_name=${data.activeSpecies}&lat=${data.userCoordinates.lat}&lng=${data.userCoordinates.lng}&radius=75&quality_grade=research`)
            const topObservers = await getLeaders('observers')
            const topIdentifiers = await getLeaders('identifiers')
            return Response.json({data: {observations: observations, images: imageArr, topObservers: topObservers, topIdentifiers: topIdentifiers}})
            //return Response.json({data: {observations: observations, images: imageArr}})
        }
        else {
            await getMarkerLocation()
            if (coordinates) {
                await getSurroundingObservations(`https://api.inaturalist.org/v1/observations?taxon_name=${data.activeSpecies}&lat=${coordinates.lat}&lng=${coordinates.lng}&radius=75&photos=true&quality_grade=research`)
                const topObservers = await getLeaders('observers')
                const topIdentifiers = await getLeaders('identifiers')
                return Response.json({data: {point: coordinates, observations: observations, images: imageArr, topObservers: topObservers, topIdentifiers: topIdentifiers}})
                //return Response.json({data: {point: coordinates, observations: observations, images: imageArr}})
            }
        }
    }
    catch (e: any) { return Response.json({ data: e.message }, { status: 400, statusText: 'fetch error' }) }
}