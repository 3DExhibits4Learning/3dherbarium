interface iNatDashRequestBody {
    id: string
    speciesName: string
    requestType: 'active' | 'recent'
}

export async function POST(request: Request) {
    const body: iNatDashRequestBody = await request.json()
    let activeSpeciesObservation
    
    if(body.requestType == 'active'){
        activeSpeciesObservation = await fetch(`https://api.inaturalist.org/v1/observations?user_id=${body.id}&taxon_name=${body.speciesName}`)
        .then(res => res.json()).then(json => json)
        return Response.json(activeSpeciesObservation);
    }
    else if(body.requestType == 'recent'){
        activeSpeciesObservation = await fetch(`https://api.inaturalist.org/v1/observations?user_id=${body.id}`)
        .then(res => res.json()).then(json => json)
        return Response.json(activeSpeciesObservation);
    }
  }