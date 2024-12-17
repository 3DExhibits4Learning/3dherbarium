import { fetchWikiSummary } from "@/api/fetchFunctions"

export interface WikipediaPageResponse {
    parse: {
        title?: string,
        pageid?: number,
        revid?: number,
        text?: {
            "*"?: string
        }
    }
}

export const getWikiPediaPageOrSummary = async(species: string) => {
    const wikipediaPage: WikipediaPageResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${species}&format=json`).then(res => res.json()).then(json => json)

    if(wikipediaPage.parse.text?.["*"]) return wikipediaPage.parse.text["*"]
}