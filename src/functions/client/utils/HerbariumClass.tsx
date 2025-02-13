/**
 * @file src/utils/HerbariumClass.tsx
 * 
 * @fileoverview herbarium client class
 */

'use client'

import { GbifImageResponse, GbifProfile } from "@/ts/types"
import { software, image_set, model, photo_annotation, model_annotation, specimen } from "@prisma/client"
import ModelAnnotations from "./ModelAnnotationsClass"

export default class Herbarium {

  commonNames: string[]
  wikiSummary: any
  software: software[]
  image_set: image_set[]
  images: GbifImageResponse[]
  annotations: ModelAnnotations
  model: model
  profile: GbifProfile
  imageSectionTitle: string
  specimen: specimen

  private constructor(commonNames: string[], software: software[], image_set: image_set[], images: GbifImageResponse[], profile: GbifProfile, wikiSummary: any, imageSectionTitle: string, model: model, annotations: ModelAnnotations, specimen: specimen) {
    this.commonNames = commonNames
    this.software = software
    this.image_set = image_set
    this.images = images
    this.annotations = annotations
    this.model = model
    this.profile = profile
    this.wikiSummary = wikiSummary
    this.imageSectionTitle = imageSectionTitle
    this.specimen = specimen
  }

  static async model(usageKey: number, model: model, images: GbifImageResponse[], title: string) {

    var data: any
    var annotations: any
    var promises = []

    promises.push(fetch(`/api/collections/herbarium?uid=${model.uid}&usageKey=${usageKey.toString()}&specimenName=${model.spec_name}&sid=${model.sid}`)
      .then(res => res.json())
      .then(json => json.response))

    promises.push(ModelAnnotations.retrieve(model.uid))

    await Promise.all(promises).then(res => {
      data = res[0]
      annotations = res[1]
    })

    return new Herbarium(data[0], data[1], data[2], images, data[3], data[4], title, model, annotations, data[5])
  }

  getAnnotator() {
    for (let annotation of this.annotations.annotations) {
      if ((annotation.annotation as photo_annotation | model_annotation)?.annotator) {
        const annotator = (annotation.annotation as photo_annotation | model_annotation)?.annotator
        return annotator;
      }
    }
  }
}