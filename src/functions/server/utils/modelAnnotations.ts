import { getAnnotations, getCitations } from "@/functions/server/queries";

export async function citationHandler(annotations: any) {
  var citations: any = [];
  let promises = []
  for (let i = 0; i < annotations.length; i++) {
    if (annotations[i].annotation_type == "photo" || annotations[i].annotation_type == "model") {
      const citation = getCitations(annotations[i].url)
      citations.push(citation);
      promises.push(citation)
    }
    else {
      citations.push("");
      promises.push('')
    }

    await Promise.all(promises).then(res => {
      for(let i = 0; i < citations.length; i++){
        //@ts-ignore
        if(citations[i] !== '') citations[i] = res[i]
      }
    })

    return citations;
  }
}

export async function annotationHandler(hasModel: boolean, _3dmodel: any) {
  if (hasModel) {
    const annotations = await getAnnotations(_3dmodel[0].uid);
    return annotations;
  }
}
