/**
 * @file src/app/api/test/route.ts
 * 
 * @fileoverview route handler for testing new libraries/modules
 * 
 * @description currently testing JSZip external uploads
 */

// Typical imports
import { ModelUploadResponse } from "@/ts/types"
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { routeHandlerTypicalResponse } from "@/functions/server/response"

import https from 'https'
import fs from 'fs'
import { autoWrite } from "@/functions/server/files"
import { readFile } from "fs/promises"
//import FormData from "form-data"

export const dynamic = 'force-dynamic'

// PATH
const path = 'src/app/api/test/route.ts'

export async function POST(request: Request | null) {

  try {
    console.log(request)
    return routeHandlerTypicalResponse('Model Uploaded', 'success')
  }
  catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}