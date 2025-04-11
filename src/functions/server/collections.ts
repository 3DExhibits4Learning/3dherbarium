'use server'

import { fetchWikiSummary } from "@/functions/server/fetchFunctions"
import { writeFile } from "fs/promises"

// SINGLETON
import prisma from "@/functions/server/utils/prisma"

export interface WikipediaPageResponse {
    parse: {
        title?: string,
        pageid?: number,
        revid?: number,
        text?: { "*"?: string }
    }
}

export const getWikiPediaPageOrSummary = async (species: string) => {
    const wikipediaPage = await fetch(`https://en.wikipedia.org/api/rest_v1/page/html/Arctostaphylos patula`).then(res => res.text()).then(text => text)

    const re = /<section.*id="External_links"/
    const pageWithoutExternalLinks = wikipediaPage.slice(0, wikipediaPage.search(re))
    //const pageWithScrollRemoved = pageWithoutExternalLinks.replace("<html", "<html style='overflow:hidden'")
    await writeFile('C:/Users/ab632/Documents/test.txt', pageWithoutExternalLinks).then(() => console.log('WRITTEN')).catch(e => console.error('NOT WRITTEN'))
    //if (wikipediaPage) return
    // const sectionWithExternalLinksExample = '<section data-mw-section-id="11" id="mwAu4"><h2 id="External_links">External links</h2>'
}

/**
 * 
 * @param uid 
 * @returns 
 */
export const getAnnotationModelIncludingSpecimen = async (uid: string) => await prisma.model.findUnique({ where: { uid: uid }, include: {specimen: true, software: true} })

