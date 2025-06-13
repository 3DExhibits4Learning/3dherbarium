/**
 * @file /api/types.ts
 * @fileoverview contains the type definitions of the API calls used throughout the application.
 */

import { Dispatch, SetStateAction, ReactElement } from "react"
import { specimen, annotations, photo_annotation, video_annotation, userSubmittal, model, model_annotation } from "@prisma/client"
import { LatLngLiteral } from "leaflet"

import Herbarium from "@/functions/client/utils/HerbariumClass"

export interface dataTransfer {
  initializeDataTransferHandler: Function
  terminateDataTransferHandler: Function
}

export interface action {
  type: string
}

export interface annotationModalProps {
  specimen: Herbarium,
  gMatch: { hasInfo: boolean, data?: GbifResponse }
  title: string
  index: number | null
}


export interface ConditionalChildren {
  children?: Array<ReactElement<any> | "" | undefined> | ReactElement<any> | "" | undefined
}


export interface SearchHeaderProps {
  headerTitle: string,
  pageRoute: string;
  searchTerm?: string;
  page?: string;
  hasModel?: boolean
  annotationsEnabled?: boolean
  setAnnotationsEnabled?: Dispatch<SetStateAction<boolean>>
}


export interface iNatApiResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: any[];
}

export interface iNatSpecimenObservation {
  photoUrl: string;
  title: string;
  userIcon: string;
  pictureHrefLink: string;
  userHrefLink: string;
  observedOnDate: string;
  location: string;
}

export interface iNatSpecimenLeader {
  count?: number;
  observation_count?: number;
  user: string;
}

export interface GbifResponse {
  usageKey?: number;
  scientificName?: string;
  canonicalName?: string;
  rank: 'GENUS' | 'SPECIES';
  status?: string;
  confidence: number;
  matchType: 'EXACT' | 'NONE';
  kingdom?: string;
  phylum?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  kingdomKey?: number;
  phylumKey?: number;
  classKey?: number;
  orderKey?: number;
  familyKey?: number;
  genusKey?: number;
  speciesKey?: number;
  synonym: boolean;
  class?: string;
  note?: string;
  alternatives?: any[];
};

export interface GbifMediaResponse {
  offset: number;
  limit: number;
  endOfRecords: boolean;
  count?: number;
  results: any[];
};

export interface GbifImageResponse {
  author: string | null;
  license?: string;
  year?: number;
  month?: number;
  day?: number;
  url: string;
};

export interface GbifProfile {
  habitat?: string;
  extinct?: string;
  terrestrial?: string;
  marine?: string;
  freshwater?: string;
};

export interface SpeciesListInfo {
  name: string;
  imgUrl: string;
  photoBy: string;
  license: string;
};

export interface CommonNameInfo {
  id: number;
  rank: string;
  iconic_taxon_id: number;
  name: string;
  default_photo?: {
    id: number;
    url: string;
    medium_url: string;
    photo_by: string;
    license: string;
  };
  wikipedia_url?: string;
  preferred_common_name: string;
};

export interface PlantIdSuggestion {
  id: number;
  plant_name: string;
  probability: number;
  confirmed: boolean;
  similar_images: {
    id: string;
    url: string;
    similarity?: number;
    url_small?: string;
  }[];
  plant_details: {
    common_names?: string[] | null;
    taxonomy: {
      class: string;
      genus: string;
      order: string;
      family: string;
      phylum: string;
      kingdom: string;
    };
    url: string;
    wiki_description?: {
      value: string;
      citation: string;
      license_name: string;
      license_url: string;
    } | null;
    synonyms?: string[] | null;
    name_authority: string;
    language: string;
    scientific_name: string;
    structured_name: {
      genus: string;
      species?: string; // Optional if present in the response
      hybrid?: string; // Optional if present in the response
    };
  };
};

export interface PlantIdApiResponseSuccess {
  id: number;
  custom_id: null;
  meta_data: {
    latitude: null;
    longitude: null;
    date: string;
    datetime: string;
  };
  uploaded_datetime: number;
  finished_datetime: number;
  images: {
    file_name: string;
    url: string;
  }[];
  suggestions: PlantIdSuggestion[];
  modifiers: string[];
  secret: string;
  fail_cause: null;
  countable: true;
  feedback: null;
  is_plant: true;
  is_plant_probability: number;
};

export interface PlantIdApiResponseError {
  id: number;
  custom_id: null;
  meta_data: {
    latitude: null;
    longitude: null;
    date: string;
    datetime: string;
  };
  uploaded_datetime: number;
  finished_datetime: number;
  images: {
    file_name: string;
    url: string;
  }[];
  suggestions: PlantIdSuggestion[];
  modifiers: string[];
  secret: string;
  fail_cause: null;
  countable: true;
  feedback: null;
  is_plant: false;
  is_plant_probability: number;
};

export type PlantIdApiResponse = PlantIdApiResponseSuccess | PlantIdApiResponseError;


export interface Models {
  confirmation: string
  email: string
  artistName: string
  speciesName: string
  createdWithMobile: boolean
  methodology: string
  modeluid: string
  dateTime: Date
  status: string
  thumbnail: string
  lat: number
  lng: number
}[]

export interface ModelsWithTagsAndSoftware extends Models {
  software: string[]
  tags: string[]

}

export interface PublishedModelProps {
  models: ModelsWithTagsAndSoftware[],
  setViewerUid: Dispatch<SetStateAction<string>>,
  selectedKeys: Set<string>,
  setSelectedKeys: any,
  setPendingSelectedKeys: Dispatch<SetStateAction<Set<string>>>
  setActiveSpeciesName: Dispatch<SetStateAction<string>>
}

export interface userUpdateProps {
  confirmation: string,
  artist: string,
  species: string,
  method: string,
  mobile: boolean,
  software: string[],
}

export interface PendingModelProps {
  models: ModelsWithTagsAndSoftware[],
  setViewerUid: Dispatch<SetStateAction<string>>,
  selectedKeys: Set<string>,
  setSelectedKeys: any,
  setPublishedSelectedKeys: Dispatch<SetStateAction<Set<string>>>
  setActiveSpeciesName: Dispatch<SetStateAction<string>>
}

export interface modelerInsertion {
  species: string
  acquisitionDate: string
}

export interface specimenInsertion extends modelerInsertion {
  procurer: string
  isLocal: boolean
  genus: string
  height: string
  position: LatLngLiteral
  locality: string
  photo: File
}

export interface imageInsertion {
  sid: string
  species: string
  acquisitionDate: Date
  imagedBy: string
  imagedDate: string
  numberOfImages: string
}

export interface modelInsertion {
  sid: string
  commonName: string
  modeler: string
  isViable: boolean
  isBase: boolean
}

export interface specimenWithImageSet extends specimen {
  image_set: any[]
}[]

export interface image_set {
  spec_name: string;
  spec_acquis_date: Date;
  set_no: number;
  imaged_by: string;
  imaged_date: Date;
  images_link: string | null;
  no_of_images: number;
  uid: string | null;
}

export interface imageSetWithModel extends image_set {
  model: any
}[]

export interface fullAnnotation extends annotations {
  annotation: photo_annotation | video_annotation | model_annotation
}

export interface fullUserSubmittal extends userSubmittal {
  tags: string[],
  software: string[]
}

export interface ModelUploadResponse {
  options_errors: string
  uri: string
  uid: string
}

export interface ModelUpdateObject {
  species: string
  artist: string
  isMobile: string
  methodology: string
  software: string[]
  tags: string[]
  position: LatLngLiteral
  confirmation: string
}

export interface ModelDeleteObject {
  confirmation: string
  modelUid: string
}

export interface ApproveModelObject {
  confirmation: string
  species: string
  latitude: number
  longitude: number
  files: string[]
  wild: boolean
  email: string
  uid: string
}
