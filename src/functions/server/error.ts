/**
 * @file src/functions/server/error.ts
 * 
 * @fileoverview server side error functions
 */


/**
 * @param route path of the route handler
 * @param errorMessage message from the error object
 * @param fn function that returned the rror
 * @param method HTTP method of the route handler function
 * @returns formatted string output detailing the error
 */
export function routeHandlerError(route: string, errorMessage: string, fn: string, method?: string | undefined, nonFatal?: boolean) {
    return `Date: ${new Date().toDateString()}\n
    Time: ${new Date().toTimeString()}\n
    Route: ${route} \n 
    Fatal: ${nonFatal ? "No" : "Yes"}\n
    HTTPMethod: ${method ? method : 'N/A'}\n
    Function: ${fn} \n
    Error Message: ${errorMessage}`
}

/**
 * @param route path of the route handler
 * @param errorMessage message from the error object
 * @param fn function that returned the rror
 * @param method HTTP method of the route handler function
 * @returns formatted string output detailing the error
 */
export function serverActionError(errorMessage: string, fn: string, nonFatal?: boolean) {
    console.error( `Date: ${new Date().toDateString()}\n
    Time: ${new Date().toTimeString()}\n
    Fatal: ${nonFatal ? "No" : "Yes"}\n
    Function: ${fn} \n
    Error Message: ${errorMessage}`)
}

/**
 * @param route path of the route handler
 * @param errorMessage message from the error object
 * @param fn function that returned the rror
 * @param clientErrorMessage error message that is displayed to the client
 * @param method HTTP method of the route handler function
 * @description Logs an error to the console and throws an error with client error message
 */
export function serverActionErrorHandler(errorMessage: string, fn: string, clientErrorMessage: string, nonFatal?: boolean) {
    console.error(serverActionError(errorMessage, fn, nonFatal))
    throw Error(clientErrorMessage)
}

/**
 * @param errorMessage response object for catch() on route handelers
 * @returns Response object with client error message as data, response and statusText values and a 400 status
 */
export function serverActionCatch(errorMessage: string) {
    return `Error: ${errorMessage}`
}

/**
 * @param route path of the route handler
 * @param errorMessage message from the error object
 * @param fn function that returned the rror
 * @param clientErrorMessage error message that is displayed to the client
 * @param method HTTP method of the route handler function
 * @description Logs an error to the console and throws an error with client error message
 */
export function routeHandlerErrorHandler(route: string, errorMessage: string, fn: string, clientErrorMessage: string, method?: string | undefined) {
    console.error(routeHandlerError(route, errorMessage, fn, method))
    throw Error(clientErrorMessage)
}

/**
 * @param errorMessage response object for catch() on route handelers
 * @returns Response object with client error message as data, response and statusText values and a 400 status
 */
export function routeHandlerTypicalCatch(errorMessage: string) {
    return Response.json({ data: `Error: ${errorMessage}`, response: errorMessage }, { status: 400, statusText: errorMessage })
}

/**
 * @param errorMessage message from the error object
 * @param clientErrorMessage error message displayed to the client
 * @description uses routeHandlerError to log errors
 */
export function serverErrorHandler(path: string, errorMessage: string, clientErrorMessage: string, fn: string, nonFatal: boolean) {
    console.error(routeHandlerError(path, errorMessage, fn, undefined, nonFatal))
    throw Error(clientErrorMessage)
}

/**
 * @param route path of the route handler
 * @param errorMessage message from the error object
 * @param fn function that returned the rror
 * @param method HTTP method of the route handler function
 * @description Logs the details of a nonFatal error to the console
 */
export function nonFatalError(route: string, errorMessage: string, fn: string, method?: string) {
    console.error(routeHandlerError(route, errorMessage, fn, method, true))
}