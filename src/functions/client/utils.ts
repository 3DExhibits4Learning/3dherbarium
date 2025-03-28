/**
 * 
 * @returns 
 */
export const isLocalEnv = () => process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? true : false

/**
 * 
 * @param url 
 * @returns 
 */
export const configureNfsUrl = (url: string) => isLocalEnv() ? `/api/nfs?path=X:/${url.slice(5)}` : `/api/nfs?path=public${url}`

/**
 * 
 * @returns 
 */
export const configureThumbnailDir = () => isLocalEnv() ? 'X:/Herbarium/thumbnails' : 'public/data/Herbarium/thumbnails'