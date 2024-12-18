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
    const wikipediaPage = await fetch(`https://en.wikipedia.org/api/rest_v1/page/html/${species}`).then(res => res.text()).then(text => text)

    const re = /<section.*id="External_links"/
    const exp = '<section data-mw-section-id="11" id="mwAu4"><h2 id="External_links">External links</h2>'
    console.log(re.test(exp))
    //console.log(wikipediaPage.slice(wikipediaPage.search(re)))

    if(wikipediaPage) return wikipediaPage.slice(0, wikipediaPage.search(re))
}