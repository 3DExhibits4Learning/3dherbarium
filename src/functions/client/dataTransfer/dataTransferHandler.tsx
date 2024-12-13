'use client'

export default async function dataTransferHandler(initializeDataTransfer: Function, terminateDataTransfer: Function, dataTransferFn: Function, dataTransferFnArgs: any[], loadingLabel: string){
    initializeDataTransfer(loadingLabel)
    const result = await dataTransferFn(...dataTransferFnArgs)
    terminateDataTransfer(result)
}