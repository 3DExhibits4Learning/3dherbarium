/**
 * @file /api/queries.tsx
 * @fileoverview database queries used throughout the application
 */

// Imports
import { model } from "@prisma/client";
import prisma from '@/functions/server/utils/prisma'

// Singleton prisma export
export function prismaClient() { return prisma }

/**
 * @function getModelUid
 * @description returns a list of models matching the species parameter
 * 
 * @param {string} species of the model
 */
export async function getModel(species: string) {
  const models = await prisma.model.findMany({
    where: { spec_name: species, site_ready: true, base_model: true }
  });

  return models
};

/**
 * @function getModelByUid
 * @description returns a model object that matched the provided uid
 * 
 * @param {uid} uid of the model
 */
export async function getModelByUid(uid: string) {
  const models = await prisma.model.findUnique({ where: { uid: uid } })

  return models
}


/**
 * @function getAnnotations
 * @description returns a list of annotations matching the uid parameter in order of annotation number
 * 
 * @param {string} uid of the annotated model
 */
export async function getAnnotations(uid: string) {
  const annotations = await prisma.annotations.findMany({
    where: { uid: uid },
    orderBy: { annotation_no: 'asc' }
  });

  return annotations;
};


/**
* @function getCitations
* @description returns a list of photo annotations (and corresponding citation info) matching the url parameter
* 
* @param {string} uid of the annotated model
*/
export async function getCitations(url: string) {
  const citation = await prisma.photo_annotation.findMany({
    where: { url: url }
  });

  return citation;
};

/**
* @function getPhotoAnnotation
* @description returns a unique photo annotation based on id
* 
* @param {string} annotation_id of the annotated model
*/
export async function getPhotoAnnotation(id: string) {
  const annotation = await prisma.photo_annotation.findUnique({
    where: { annotation_id: id }
  });

  return annotation;
};

/**
* @function getVideoAnnotation
* @description returns a unique video annotation based on id
* 
* @param {string} annotation_id of the annotated model
*/
export async function getVideoAnnotation(id: string) {
  const annotation = await prisma.video_annotation.findUnique({
    where: { annotation_id: id }
  });

  return annotation;
};

/**
* @function getModelAnnotation
* @description returns a unique model annotation based on id
* 
* @param {string} annotation_id of the annotated model
*/
export async function getModelAnnotation(id: string) {
  const annotation = await prisma.model_annotation.findUnique({
    where: { annotation_id: id }
  });

  return annotation;
};

/**
* @function getSoftwares
* @description returns a list of all softwares used for the uid parameter
* 
* @param {string} uid of the model
*/
export async function getSoftwares(uid: string) {
  const softwares = await prisma.software.findMany({
    where: { uid: uid }
  });

  return softwares;
};


/**
* @function getImageSet
* @description returns image set data for photogrammetry models
* 
* @param {string} uid of the model
*/
export async function getImageSet(uid: string) {
  const imageSet = await prisma.image_set.findMany({
    where: { uid: uid }
  });

  return imageSet;
};


/**
 * @function getAllSiteReadyModels
 * @description returns a list of all models labeled as site_ready from the database.
 * 
 * @returns {Promise<model[]>}
 */
export const getAllSiteReadyModels = async (development: boolean): Promise<model[]> => {

  const whereClause = development ? { site_ready: true, base_model: true } : { site_ready: true, base_model: true, annotator: { not: null }, annotated: true }

  const models = await prisma.model.findMany({
    where: whereClause,
    orderBy: {
      spec_acquis_date: 'desc'
    }
  })

  return models as model[]
};

/**
 * @function getAllAnnotationModels
 * @description returns all models marked as not base models and site ready
 * 
 * @returns {Promise<model[]>}
 */
export const getAllAnnotationModels = async (): Promise<model[]> => {

  const models = await prisma.model.findMany({
    where: { site_ready: true, base_model: false, annotation_number: null },
    orderBy: {
      spec_name: 'asc'
    }
  })

  return models as model[]
};

/**
 * @function getPendingModels
 * @description returns an array of pending model objects contributed by the user with specified email address.
 * 
 */
export const updateModelAnnotator = async (uid: string, annotator: string,) => {
  const models = await prisma.model.update({
    where: { uid: uid },
    data: { annotator: annotator }
  });
  return models;
};

/**
 * @function markAsAnnotated
 * @description update a model record to indicate whether or not it's annotated
 * 
 */
export const markAsAnnotated = async (uid: string) => {

  const updated = await prisma.model.update({
    where: { uid: uid },
    data: { annotated: true, annotator: "Jazzlyn Strebel" }
  })
  return updated
}

/**
 * @function getPendingModels
 * @description returns an array of pending model objects contributed by the user with specified email address.
 * 
 */
export const getPendingModels = async (email: string) => {
  const models = await prisma.userSubmittal.findMany({
    where: { email: email, status: 'Pending' },
    orderBy: {
      dateTime: 'desc'
    }
  });
  return models;
};

/**
 * @function getAllPendingModels
 * @description returns an array of all pending model objects 
 * 
 */
export const getAllPendingModels = async () => {
  const models = await prisma.userSubmittal.findMany({
    where: { status: 'Pending' },
    orderBy: {
      dateTime: 'desc'
    }
  });
  return models;
};

/**
 * @function getPublishedModels
 * @description returns an array of published model objects contributed by the user with specified email address.
 * 
 */
export const getPublishedModels = async (email: string) => {
  const models = await prisma.userSubmittal.findMany({
    where: { email: email, status: 'Published' },
    orderBy: {
      dateTime: 'desc'
    }
  });
  return models;
};

/**
 * @function updateThumbUrl
 * @description update thumbnail url of the model with the corresponding confirmation string (preferably) or the model uid.
 * 
 */
export const updateThumbUrl = async (thumbUrl: string, uid: string, community?: boolean) => {

  var result

  if (!community) { result = await prisma.model.update({ where: { uid: uid }, data: { thumbnail: thumbUrl } }) }
  else { result = await prisma.userSubmittal.update({ where: { modeluid: uid }, data: { thumbnail: thumbUrl } }) }

  return result
}

/**
 * @function getAccounts
 * @description return an array of providers corresponding to the userId argument
 * 
 */
export const getAccountProviders = async (userId: string,) => {
  const accountsObj = await prisma.account.findMany({
    where: { userId: userId },
  });
  return accountsObj
};

/**
* @function getSubmittalSoftware
* @description return an array of softwares based on the id (confirmation) number of the model
* 
*/
export const getSubmittalSoftware = async (id: string,) => {
  const softwareObj = await prisma.submittalSoftware.findMany({
    where: { id: id },
  });
  let softwareArray = []
  for (let software in softwareObj)
    softwareArray.push(softwareObj[software].software)
  return softwareArray
};

/**
 * @function getSubmittalTags
 * @description return an array of tags based on the id (confirmation) number of the model
 * 
 */
export const getSubmittalTags = async (id: string,) => {
  const tagObj = await prisma.submittalTags.findMany({
    where: { id: id },
  });
  let tagArray = []
  for (let tag in tagObj)
    tagArray.push(tagObj[tag].tag)
  return tagArray
};

/**
* @function approveModel
* @description approve a pending 3D model
* 
*/
export const approveModel = async (confirmation: string,) => {
  const updateObj = await prisma.userSubmittal.update({
    where: {
      confirmation: confirmation
    },
    data: {
      status: 'Published'
    }
  })
  return updateObj
};

/**
 * @function getModelerSpecimen
 * @description returns an object with two arrays; one containing specimen objects to be photographed, the other containing speicmen objects that need to be modeled
 * 
 */
export const getModelerSpecimen = async () => {

  const specimenToBePhotographed = []
  const specimenToBeModeled = []

  const specimen = await prisma.specimen.findMany({
    where: { spec_acquis_date: { gte: new Date('2024-06-01') } },
    include: { image_set: true }
  })

  for (let i in specimen) {
    if (specimen[i].image_set.length === 0) specimenToBePhotographed.push(specimen[i])
    else if (!specimen[i].image_set[0].uid) specimenToBeModeled.push(specimen[i])
  }

  return { specimenToBePhotographed, specimenToBeModeled }
}

/**
 * @function getSpecimenToModel
 * @description returns an object array of all specimens since 6/20/2024 that do not have a corresponding image_set, but lack a corresponding 3D model
 * 
 */
export const getSpecimenToModel = async () => {

  const specimenToModel = await prisma.image_set.findMany({
    where: {
      uid: null,
      spec_acquis_date: {
        gte: new Date('2024-06-01'),
      }
    },
  })

  return specimenToModel
}

/**
 * @function getCommunityThumbnails
 * @description returns an array of thumbnail url's for 3D models uploaded by the community
 * 
 */
export const getCommunityThumbnails = async () => {

  let thumbmnails: string[] = []

  const communityUploads = await prisma.userSubmittal.findMany({
    where: {
      status: 'published',
    },
  })

  for (let i in communityUploads) {
    thumbmnails.push(communityUploads[i].thumbnail)
  }

  return thumbmnails
}

/**
 * @function getModelsToAnnotate
 * @description 
 * 
 */
export const getModelsToAnnotate = async () => {

  const modelsToAnnotate = await prisma.model.findMany({
    where: {
      site_ready: true,
      base_model: true,
      annotated: false,
      spec_acquis_date: {
        gte: new Date('2024-06-01'),
      }
    },
    orderBy: {
      spec_acquis_date: 'asc'
    }
  })

  return modelsToAnnotate
}

/**
 * @function getTestModel
 * @description 
 * 
 */
export const getTestModel = async () => {

  const modelsToAnnotate = await prisma.model.findMany({
    where: {
      spec_name: 'sisyrinchium bellum'
    },
  })

  return modelsToAnnotate
}

/**
 * @function getAccount
 * @description returns a user account based on the userId and the provider
 * 
 */
export const getAccount = async (id: string, provider: string) => {

  const account = await prisma.account.findFirst({
    where: {
      userId: id,
      provider: provider,
    },
  })

  return account
}

/**
 * @function getPublishedUserSubmittals
 * @description returns a user account based on the userId and the provider
 * 
 */
export const getPublishedUserSubmittals = async () => {

  const submittals = await prisma.userSubmittal.findMany({
    where: {
      status: 'published'
    },
  })
  return submittals
}

/**
 * @function getPublishedUserSubmittalsBySpecies
 * @description returns user submitted models by species
 * 
 */
export const getPublishedUserSubmittalsBySpecies = async (speciesName: string) => {

  const submittals = await prisma.userSubmittal.findMany({
    where: {
      speciesName: speciesName,
      status: 'published'
    },
  })
  return submittals
}

/**
 * @function getPublishedUserSubmittalsByUid
 * @description returns user submitted models by uid
 * 
 */
export const getPublishedUserSubmittalsByUid = async (uid: string) => {

  const submittal = await prisma.userSubmittal.findUnique({
    where: {
      modeluid: uid,
      status: 'published'
    },
  })
  return submittal
}

/**
 * @function insertFirstAnnotationPosition
 * @description returns a user account based on the userId and the provider
 * 
 */
export const insertFirstAnnotationPosition = async (uid: string, position: string) => {

  const update = await prisma.model.update({
    where: {
      uid: uid
    },
    data: {
      annotationPosition: position
    }
  })
  return update
}

/**
 * @function getFirstAnnotationPostion
 * @description returns a user account based on the userId and the provider
 * 
 */
export const getFirstAnnotationPostion = async (uid: string) => {

  const model = await prisma.model.findUnique({
    where: {
      uid: uid
    }
  })
  return model?.annotationPosition
}

/**
 * @function insertFirstAnnotationPosition
 * @description returns a user account based on the userId and the provider
 * 
 */
export const insertAnnotationPosition = async (uid: string, position: string) => {

  const update = await prisma.model.update({
    where: {
      uid: uid
    },
    data: {
      annotationPosition: position
    }
  })
  return update
}

/**
 * @function createAnnotation
 * @description creates a database record for a 3d model annotation
 * 
 */
export const createAnnotation = async (uid: string, position: string, url: string, annotation_no: number, annotation_type: string, annotation_id: string, title: string) => {

  const newAnnotation = await prisma.annotations.create({
    data: {
      uid: uid,
      position: position,
      url: url,
      annotation_no: annotation_no,
      annotation_id: annotation_id,
      annotation_type: annotation_type,
      title: title
    },
  })
  return newAnnotation
}

/**
 * @function updateAnnotation
 * @description updates a database record for a 3d model annotation
 * 
 */
export const updateAnnotation = async (uid: string, position: string, annotation_type: string, annotation_id: string, title: string, url?: string) => {

  const updatedAnnotation = await prisma.annotations.update({
    where: {
      annotation_id: annotation_id
    },
    data: {
      uid: uid,
      position: position,
      url: url,
      annotation_type: annotation_type,
      title: title
    },
  })
  return updatedAnnotation
}

/**
 * @function createPhotoAnnotation
 * @description creates a database record for a 3d model photo annotation
 * 
 */
export const createPhotoAnnotation = async (url: string, author: string, license: string, annotator: string, annotation: string, annotation_id: string, website?: string, title?: string, photo?: Buffer | null) => {

  const newAnnotation = await prisma.photo_annotation.create({
    data: {
      url: url,
      author: author,
      license: license,
      annotator: annotator,
      annotation_id: annotation_id,
      annotation: annotation,
      website: website ? website : '',
      title: title ? title : '',
      photo: photo
    }
  })
  return newAnnotation
}

/**
 * @function udpatePhotoAnnotation
 * @description creates a database record for a 3d model photo annotation
 * 
 */
export const updatePhotoAnnotation = async (url: string, author: string, license: string, annotator: string, annotation: string, annotation_id: string, website?: string, title?: string, photo?: Buffer | null) => {

  const updatedAnnotation = await prisma.photo_annotation.update({
    where: {
      annotation_id: annotation_id
    },
    data: {
      url: url,
      author: author,
      license: license,
      annotator: annotator,
      annotation: annotation,
      website: website ? website : '',
      title: title ? title : '',
      photo: photo
    }
  })
  return updatedAnnotation
}

/**
 * @function createVideoAnnotation
 * @description creates a database record for a 3d model video annotation
 * 
 */
export const createVideoAnnotation = async (url: string, length: string, id: string) => {

  const newAnnotation = await prisma.video_annotation.create({
    data: {
      url: url,
      length: length,
      annotation_id: id
    }
  })
  return newAnnotation
}

/**
 * @function updateVideoAnnotation
 * @description updates a database record for a 3d model video annotation
 * 
 */
export const updateVideoAnnotation = async (url: string, length: string, id: string) => {

  const newAnnotation = await prisma.video_annotation.update({
    where: {
      annotation_id: id
    },
    data: {
      url: url,
      length: length,
    }
  })
  return newAnnotation
}

/**
 * @function createModelAnnotation
 * @description creates a database record for a 3d model Model annotation
 * 
 */
export const createModelAnnotation = async (uid: string, annotation: string, id: string) => {

  const newAnnotation = await prisma.model_annotation.create({
    data: {
      uid: uid,
      annotation: annotation,
      annotation_id: id
    }
  })
  return newAnnotation
}

/**
 * @function updateModelAnnotation
 * @description updates a database record for a 3d model Model annotation
 * 
 */
export const updateModelAnnotation = async (uid: string, annotation: string, id: string) => {

  const newAnnotation = await prisma.model_annotation.update({
    where: {
      annotation_id: id
    },
    data: {
      uid: uid,
      annotation: annotation,
    }
  })
  return newAnnotation
}

/**
 * @function deleteAnnotation
 * @description deletes an annotation an reduces the numbers of all higher indexed annotations by 1
 * 
 */
export const deleteAnnotation = async (id: string, modelUid: string) => {

  // Get annotation pending deletion and store its number
  const annotationPendingDeletion = await prisma.annotations.findUnique({ where: { annotation_id: id } })
  const annotationPendingDeletionNumber = annotationPendingDeletion?.annotation_no

  // Get remaining annotations with higher annotation numbers
  const remainingAnnotations = await prisma.annotations.findMany({
    where: {
      uid: modelUid,
      annotation_no: {gt: annotationPendingDeletionNumber}
    },
    orderBy: {annotation_no: 'asc'}
  })

  // Promises array; push deletion of annotation with given annoation_id
  let tx = []
  tx.push(prisma.annotations.delete({ where: { annotation_id: id } }))

  // Push updates to all remaining annotations higher in number; number is decresed by 1
  for (let i in remainingAnnotations) {
    tx.push(prisma.annotations.update({
      where: { annotation_id: remainingAnnotations[i].annotation_id },
      data: { annotation_no: remainingAnnotations[i].annotation_no - 1 }
    }))
  }

  // Await promises to resolve
  await prisma.$transaction(tx)

  return 
}

/**
 * @function deletePhotoAnnotation
 * @description delete photo annotation
 * 
 */
export const deletePhotoAnnotation = async (id: string) => {

  const deletion = await prisma.photo_annotation.delete({
    where: { annotation_id: id }
  })
  return deletion
}

/**
 * @function deleteVideoAnnotation
 * @description delete video annotation
 * 
 */
export const deleteVideoAnnotation = async (id: string) => {

  const deletion = await prisma.video_annotation.delete({
    where: { annotation_id: id }
  })
  return deletion
}

/**
 * @function deleteModelAnnotation
 * @description delete model annotation
 * 
 */
export const deleteModelAnnotation = async (id: string) => {

  const deletion = await prisma.model_annotation.delete({
    where: { annotation_id: id }
  })
  return deletion
}

/**
 * @function updateCommunityId
 * @description update the communityId (inat post id) for a user submittal
 * 
 */
export const updateCommunityId = async (confirmation: string, id: number) => {

  const update = await prisma.userSubmittal.update({
    where: { confirmation: confirmation },
    data: { communityId: id }
  })
  return update
}

/**
 * @function userIsAdmin
 * @description return boolean value indicating whether or not the email argument belongs to an administrator
 * 
 */
export const userIsAdmin = async (email: string) => {

  const user = await prisma.authed.findUnique({
    where: { email: email },
  })

  return user !== null ? true : false
}

/**
 * @function getAdmin
 * @description return admin object or null
 * 
 */
export const getAdmin = async (email: string) => {

  const user = await prisma.authed.findUnique({
    where: { email: email },
  })

  return user
}


// /**
//  * @function getAnnotationPositionsAndTitles
//  * @description get annotation postions and titles
//  *
//  */
// export const getAnnotationPositionsAndTitles = async (uid: string) => {

//   const positionsAndTitles : {position: string, }

//   const firstAnnotationPosition = getFirstAnnotationPostion(uid)
// }










//  /**
//  * @function getProviderAccountId
//  * @description return an array of providers corresponding to the userId argument
//  *
//  */
// export const getProviderAccountId = async (userId: string, provider: string) => {
//   const accountsObj =  await prisma.account.findMany({
//      where: { userId : userId },
//    });
//    let providers = []
//    for(let accounts in accountsObj){
//     providers.push(accountsObj[accounts].provider)
//    }
//    return providers
//  };

//   /**
//  * @function getiNatTokenExpiration
//  * @description get the expiration time of user's iNaturalist api token
//  *
//  */
// export const getiNatTokenExpiration = async (userId: string, provider: string) => {
//   const providerAccount = await prisma.account.findMany({
//     where: { userId : userId, provider : provider }
//   });
//   return providerAccount[0].expires_at
// };

//  /**
//  * @function updateInaturalistTokenExpiration
//  * @description manually updates the expiration of the inaturalist
//  *
//  */
// export const updateInaturalistTokenExpiration = async (confirmation: string, thumbUrl: string) => {
//   await prisma.userSubmittal.update({
//     where: { confirmation : confirmation },
//     data: { thumbnail : thumbUrl }
//   });
// };