'use client'

import { fullAnnotation } from "@/ts/types"

class ModelAnnotations {

    annotations: fullAnnotation[]
    annotationIndex: number | undefined = undefined

    private constructor(annotations: fullAnnotation[]) {
        this.annotations = annotations
    }

    static async retrieve(uid: string) {

        let promises = []

        const annotations = await fetch(`/api/admin/botanist?uid=${uid}&type=getAnnotations`)
            .then(res => res.json())
            .then(json => json.response)

        for (let i in annotations) {
            promises.push(
                fetch(`/api/admin/botanist?id=${annotations[i].annotation_id}&type=getAnnotation&annotationType=${annotations[i].annotation_type}`)
                    .then(res => res.json())
                    .then(json => json.response)
            )
        }

        await Promise.all(promises).then(res => {
            for (let i = 0; i < annotations.length; i++) {
                annotations[i].annotation = res[i]
            }
        })

        return new ModelAnnotations(annotations)
    }

    get index() {
        return this.annotationIndex
    }

    set index(i: number | undefined) {
        this.annotationIndex = i
    }
}

export default ModelAnnotations

