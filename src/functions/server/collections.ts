import { fetchWikiSummary } from "@/api/fetchFunctions"
import { writeFile } from "fs/promises"

export interface WikipediaPageResponse {
    parse: {
        title?: string,
        pageid?: number,
        revid?: number,
        text?: { "*"?: string }
    }
}

/**
 * 
 * @param wikipediaHtml 
 * @returns 
 */
export const removeExternalLinks = (wikipediaHtml: string) => { 
    const re = /<section.*id="External_links"/; 
    const externalLinksRemoved =  wikipediaHtml.slice(0, wikipediaHtml.search(re)) 
    return externalLinksRemoved + "</body></html>"
}

/**
 * 
 * @param wikipediaHtml 
 * @returns 
 */
export const removeFirstTable = (wikipediaHtml: string) => {const re = /<table[\s\S]*?<\/table>/gi; return wikipediaHtml.replace(re, '')}

export const removeCss = (wikipediaHtml: string) => {const re = /<link[\s\S]*?\/>/gi; return wikipediaHtml.replace(re, '')}

/**
 * 
 * @param species 
 * @returns 
 */
export const getWikiPediaPageOrSummary = async (species: string) => {
    const wikipediaPage = await fetch(`https://en.wikipedia.org/api/rest_v1/page/html/Campanula patula`).then(res => res.text()).then(text => text)
    const pageWithoutExternalLinks = removeExternalLinks(wikipediaPage)
    const removedTable = removeFirstTable(pageWithoutExternalLinks)
    const removedCss = removeCss(removedTable)
    //const pageWithScrollRemoved = pageWithoutExternalLinks.replace("<html", "<html style='overflow:hidden'")
    //await writeFile('C:/Users/ab632/Documents/wikipediaApiExampleNoCss.html', removedCss).then(() => console.log('WRITTEN')).catch(e => console.error('NOT WRITTEN'))
    return removedCss
}

// const sectionWithExternalLinksExample = '<section data-mw-section-id="11" id="mwAu4"><h2 id="External_links">External links</h2>'