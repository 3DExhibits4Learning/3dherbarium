/**
 * @file /api/fetchFunctions.ts
 * @fileoverview the API functions used throughout the application
 */

import { iNatUrl, gbifUrl } from '@/functions/server/utils/urlConfig';
import { GbifMediaResponse, GbifImageResponse, GbifResponse, iNatApiResponse, iNatSpecimenObservation, iNatSpecimenLeader, SpeciesListInfo, CommonNameInfo, GbifProfile } from '@/ts/types';

const plantIdKey = process.env.PLANTID_KEY

/**
 * @function basicFetch
 * @description This basicFetch function acts as a generic fetch call to any endpoint.
 * Its return type is inferred from the original function call.
 * The fetch return is cached for 1 day (86400 seconds).
 * 
 * @param {string} endpoint the URL endpoint
 * 
 * @returns {Promise<ReturnType>} a json of the ReturnType when the endpoint is resolved
 */
export const basicFetch = async <ReturnType>(endpoint: string): Promise<ReturnType> => {
  const response: Response = await fetch(endpoint, { next: { revalidate: 86400 } });
  if (!response.ok) throw new Error('Error with fetching endpoint: ' + endpoint);

  const data: ReturnType = await response.json();

  return data;
};


/**
 * @function getSearchParams
 * @description search parameters for iNAT API request.
 * 
 * @param {string} date0 
 * @param {string} date1 
 * @param {string} searchGrade 
 * @param {string} locationEnable
 * @param {string} radius
 * @param {string} lat
 * @param {string} lng
 * 
 * @returns {string} the query parameters as a string.
 */
export const getSearchParams = (date0: string, date1: string, searchGrade: string, locationEnable: string, radius: string, lat?: string, lng?: string): string => {
  let searchParams: string = '';
  if (searchGrade == 'verifiableGrade') {
    searchParams = '&per_page=30&has[]=photos&order_by=observed_on&verifiable=true';
  }
  else if (searchGrade == 'researchGrade') {
    searchParams = '&per_page=30&has[]=photos&order_by=observed_on&quality_grade=research';
  }
  else {
    searchParams = '&per_page=30&has[]=photos&order_by=observed_on';
  }

  const firstDate = new Date(date0);
  const secondDate = new Date(date1);
  if (date0 && date1 && firstDate < secondDate) {
    searchParams += ('&d1=' + date0 + '&d2=' + date1);
  }

  if (locationEnable === 'true' && radius && lat && lng) {
    searchParams += '&lat=' + lat + '&lng=' + lng + '&radius=' + radius;
  }

  return searchParams;
};


/**
 * @function fetchSpecimenObservations
 * @description calls the /observations?taxon_name endpoint of the iNaturalist API.
 * This gets the information about the users who post pictures of the specimen.
 * 
 * @param {string} specimenName the name of the specimen
 * @param {string} searchParams the search parameters at the end of the query string
 * 
 * @returns {Promise<iNatSpecimenObservation[]>} an array containing the observation information about the specimen.
 */
export const fetchSpecimenObservations = async (specimenName: string, searchParams: string): Promise<iNatSpecimenObservation[]> => {
  if (!specimenName || !searchParams) return [];

  const config: string = 'observations?taxon_name';
  const endpoint: string = iNatUrl(config, specimenName, searchParams);

  const iNatObservations: iNatApiResponse = await basicFetch<iNatApiResponse>(endpoint);

  if (!iNatObservations) return [];

  const specimenObservationInfoArr: iNatSpecimenObservation[] = [];
  for (let result of iNatObservations.results) {
    const iconic_taxon_id: number = result.taxon?.iconic_taxon_id ?? 0;
    if (!result || iconic_taxon_id !== 47126) continue;
    const specimenObservationInfo: iNatSpecimenObservation = {
      photoUrl: result.photos?.[0]?.url?.replace('square', 'large') ?? '',
      title: result.species_guess ?? result.taxon?.preferred_common_name ?? specimenName,
      userIcon: result.user?.icon ?? '../../public/blankIcon.jpg',
      pictureHrefLink: result.uri,
      userHrefLink: result.user?.login ?? '',
      observedOnDate: result.observed_on_details?.date ?? '',
      location: result.place_guess ?? ''
    };
    specimenObservationInfoArr.push(specimenObservationInfo);
  }

  return specimenObservationInfoArr;
};


/**
 * @function fetchSpecimenIdentificationsLeaders
 * @description calls the iNat API to retrieve identifications information for a specimen.
 * 
 * @param {string} specimenName the name of the specimen
 * @param {string} searchParams the search parameters at the end of the query string
 * @param {number} resultCount the number of results returned, default is 10
 *
 * @returns {Promise<iNatSpecimenLeader[]>} an array containing the top {resultCount} identifiers and their identification count.
 */
export const fetchSpecimenIdentificationsLeaders = async (specimenName: string, searchParams: string, resultCount: number = 10): Promise<iNatSpecimenLeader[]> => {
  if (!specimenName || !searchParams) return [];

  const config: string = 'observations/identifiers?q';
  const endpoint: string = iNatUrl(config, specimenName, searchParams);

  const iNatIdentifications: iNatApiResponse = await basicFetch<iNatApiResponse>(endpoint);

  if (!iNatIdentifications) return [];

  const specimenIdentificationsInfoArr: iNatSpecimenLeader[] = [];
  let tempCount: number = 0;
  for (let result of iNatIdentifications.results) {
    if (!result) continue;
    tempCount++;
    const identification: iNatSpecimenLeader = {
      count: result.count,
      user: result.user?.login || ''
    }
    specimenIdentificationsInfoArr.push(identification);
    if (tempCount > resultCount - 1) break;
  }

  return specimenIdentificationsInfoArr;
};


/**
 * @function fetchSpecimenObservationsLeaders
 * @description calls the iNat API to retrieve observation information for a specimen.
 * 
 * @param {string} specimenName the name of the specimen
 * @param {string} searchParams the search parameters at the end of the query string
 * @param {number} resultCount the number of results returned, default is 10
 * 
 * @returns {Promise<iNatSpecimenLeader[]>}} an array containing the top {resultCount} observers and their observation count.
 */
export const fetchSpecimenObservationsLeaders = async (specimenName: string, searchParams: string, resultCount: number = 10): Promise<iNatSpecimenLeader[]> => {
  if (!specimenName || !searchParams) return [];

  const config: string = 'observations/observers?q';
  const endpoint: string = iNatUrl(config, specimenName, searchParams);

  const iNatObservations: iNatApiResponse = await basicFetch<iNatApiResponse>(endpoint);

  if (!iNatObservations) return [];

  const specimenObservationsInfoArr: iNatSpecimenLeader[] = [];
  let tempCount: number = 0;
  for (let result of iNatObservations.results) {
    if (!result) continue;
    const identification: iNatSpecimenLeader = {
      count: result.observation_count,
      user: result.user?.login || ''
    }
    specimenObservationsInfoArr.push(identification);
    if (++tempCount > resultCount - 1) break;
  }

  return specimenObservationsInfoArr;
};


/**
 * @function fetchSpecimenGbifInfo
 * @description calls the GBIF API match endpoint 
 * 
 * @param {string} specimenName 
 * 
 * @returns {Promise<{ hasInfo: boolean; data?: GbifResponse }>} whether GBIF data is available, and if so, returns the data
 */
export const fetchSpecimenGbifInfo = async (specimenName: string): Promise<{ hasInfo: boolean; data?: GbifResponse }> => {
  const gbifUrl: string = 'https://api.gbif.org/v1/species/match?kingdom=plantae&name=';
  const gbifInfo: GbifResponse = await basicFetch<GbifResponse>(gbifUrl + specimenName);

  if (gbifInfo.matchType !== 'EXACT') {
    return { hasInfo: false };
  }

  return { hasInfo: true, data: gbifInfo };
};


/**
 * @function fetchSpeciesList 
 * @description returns a list of species names from a specific genus that are available from iNaturalist API.
 * 
 * @param {string | undefined} genus the genus of the specimen 
 * @returns {Promise<SpeciesListInfo[]>} an array of the species names under the provided genus along with an image.
 */
export const fetchSpeciesList = async (genus: string | undefined): Promise<SpeciesListInfo[]> => {
  if (!genus) return [];
  const config: string = "taxa?rank=species&q";
  const url: string = iNatUrl(config, genus, '');
  const speciesListInfo: iNatApiResponse = await basicFetch<iNatApiResponse>(url);

  const speciesList: SpeciesListInfo[] = [];
  for (let result of speciesListInfo.results) {
    const iconic_taxon_id: number = result.iconic_taxon_id ?? 0;
    if (!result || iconic_taxon_id !== 47126) continue;
    const species: string = result.name ?? '';
    const imgUrl: string = result.default_photo?.medium_url ?? '';
    const attribution: string = result.default_photo?.attribution ?? '';
    const regex: RegExp = /\(c\) ([^,]+), some rights reserved \((CC BY[^)]*)\)/;
    const match: RegExpMatchArray | null = attribution.match(regex);
    const photoBy: string = match && match[1] ? match[1] : '';
    const license: string = match && match[2] ? match[2] : '';
    if (species && imgUrl && photoBy && license) {
      speciesList.push({ name: species, imgUrl: imgUrl, photoBy: photoBy, license: license });
    }
  }

  return speciesList;
};


/**
 * @function fetchGbifImages
 * @description calls the GBIF API occurrence endpoint 
 * 
 * @param {number} key Gbif species/genus/usage key
 * @returns {Promise<GbifImageResponse[]>} Returns image data from GBIF after genus/species has been matched to input
 */

export const fetchGbifImages = async (key: number | undefined, rank: string): Promise<GbifImageResponse[]> => {
  if (!key) return [];

  const config: string = rank == 'SPECIES' ? 'occurrence/search?basisOfRecord=PRESERVED_SPECIMEN&mediaType=StillImage&speciesKey' : 'occurrence/search?basisOfRecord=PRESERVED_SPECIMEN&mediaType=StillImage&genusKey';
  const endpoint: string = gbifUrl(config, key);
  const gbifOccurrences: GbifMediaResponse = await basicFetch<GbifMediaResponse>(endpoint);

  if (!gbifOccurrences) return [];

  const gbifOccurrenceArray: GbifImageResponse[] = [];

  for (let result of gbifOccurrences.results) {
    if (!result) continue;
    const specimenObservationInfo: GbifImageResponse = {
      author: result.media?.[0]?.creator ?? result.recordedBy, // extensions
      license: result.license ?? result.media?.[0]?.license, //extensions
      year: result.year,
      month: result.month,
      day: result.day,
      url: result.media?.[0]?.identifier ?? result.media?.[0]?.references
    };
    gbifOccurrenceArray.push(specimenObservationInfo);
  }


  return gbifOccurrenceArray;
};


/**
 * @function fetchHSCImages
 * @description calls the GBIF API occurrence endpoint for HSC images
 * 
 * @param {string} species to search for
 * @returns {Promise<GbifImageResponse[]>} Returns image data from GBIF for specimens that have been imaged by the HSC
 */
export const fetchHSCImages = async (species: string): Promise<GbifImageResponse[]> => {
  const endpoint: string = "https://api.gbif.org/v1/occurrence/search?datasetKey=6958627a-e1cd-489f-b4f3-6e7760203b9d&mediaType=StillImage&scientificName=" + species
  const gbifOccurrences: GbifMediaResponse = await basicFetch<GbifMediaResponse>(endpoint)

  if (gbifOccurrences.count == 0) return []

  const gbifOccurrenceArray: GbifImageResponse[] = []

  for (let result of gbifOccurrences.results) {
    if (!result) continue;
    const specimenObservationInfo: GbifImageResponse = {
      author: result.media?.[0]?.creator ?? result.recordedBy, // extensions
      license: result.license ?? result.media?.[0]?.license, //extensions
      year: result.year,
      month: result.month,
      day: result.day,
      url: result.media?.[0]?.identifier, //extensions
    };
    gbifOccurrenceArray.push(specimenObservationInfo);
  }

  return gbifOccurrenceArray;
}


/**
 * @function fetchGbifProfile
 * @description calls the GBIF API species profile endpoint 
 * 
 * @param {string} key Gbif species/genus/usage key
 * @returns {Promise<GbifMediaResponse[]>} Returns species profile data for the species associated with key parameter
 */
export const fetchGbifProfile = async (key: number | undefined): Promise<GbifProfile> => {

  const endpoint: string = 'https://api.gbif.org/v1/species/' + key + '/speciesProfiles'
  const gbifProfileArray: GbifMediaResponse = await basicFetch<GbifMediaResponse>(endpoint);

  if (!gbifProfileArray) return {};

  const profileTerms = ["habitat", "extinct", "marine", "freshwater"]

  const gbifProfile: any = {
    habitat: "",
    extinct: "",
    marine: "",
    freshwater: "",
  };

  for (let term of profileTerms) {
    for (let result of gbifProfileArray.results) {
      if (result.hasOwnProperty(term)) {
        gbifProfile[term] = result[term];
        break;
      }
    }
  }

  return gbifProfile;
};


/**
 * @function fetchGbifVernacularNames
 * @description calls the GBIF API vernacularNames endpoint 
 * 
 * @param {number} key Gbif species/genus/usage key
 * @returns {Promise<GbifMediaResponse[]>} Returns species profile data for the species associated with key parameter
 */
export const fetchGbifVernacularNames = async (key: number | undefined): Promise<string[]> => {

  const endpoint: string = 'https://api.gbif.org/v1/species/' + key + '/vernacularNames'
  const gbifNameArray: GbifMediaResponse = await basicFetch<GbifMediaResponse>(endpoint);

  if (!gbifNameArray) return [];

  var commonNames = [];
  var duplicateCheck: string[] = [];

  for (let name of gbifNameArray.results) {
    if (!name.language) { continue; }
    else {
      if (name.language !== "eng") { continue; }
      else {
        if (!duplicateCheck.includes(name.vernacularName.toLowerCase()))
          commonNames.push(name.vernacularName)
        duplicateCheck.push(name.vernacularName.toLowerCase())
      }
    }
  }
  return commonNames;
};


/**
 * @function fetchWikiSummary
 * @description calls the Wikidpedia API page summary endpoint
 * 
 * @param {string} species to find Wikipedia summary for
 * @returns {Promise<any>} Returns Wikipedia summary 
 */
export const fetchWikiSummary = async (species: string): Promise<any> => {

  const endpoint: string = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + species;
  try {
    const summary: any = await basicFetch<object>(endpoint);
    if (!("extract_html" in summary)) return '';
    return summary;
  }
  catch (e) {
    return "";
  }
};


/**
 * @function fetchCommonNameInfo
 * @description calls the iNat taxa endpoint to retrieve the information about a common name.
 * 
 * @param {string} searchInput the search query (should be a common name)
 * @returns {Promise<CommonNameInfo[]>} an array containing the common name info
 */
export const fetchCommonNameInfo = async (searchInput: string): Promise<CommonNameInfo[]> => {
  if (!searchInput) return [];

  const config: string = "taxa?rank=species,genus&q";
  const url: string = iNatUrl(config, searchInput, '');
  const commonNameInfo: iNatApiResponse = await basicFetch(url);

  const commonNameInfoList: CommonNameInfo[] = [];
  for (let result of commonNameInfo.results) {
    const iconic_taxon_id: number = result.iconic_taxon_id ?? 0;
    if (!result || iconic_taxon_id != 47126) continue;

    const regex: RegExp = /\(c\) ([^,]+), some rights reserved \((CC BY[^)]*)\)/;
    const attribution: string = result.default_photo?.attribution ?? '';
    const match: RegExpMatchArray | null = attribution.match(regex);
    const photoBy: string = match && match[1] ? match[1] : '';
    const license: string = match && match[2] ? match[2] : '';
    if (!photoBy || !license) continue;

    const commonName: CommonNameInfo = {
      id: result.id,
      rank: result.rank,
      iconic_taxon_id: iconic_taxon_id,
      name: result.name,
      default_photo: {
        id: result.default_photo?.id ?? '',
        url: result.default_photo?.url ?? '',
        medium_url: result.default_photo?.medium_url ?? '',
        photo_by: photoBy,
        license: license
      },
      wikipedia_url: result.wikipedia_url ?? '',
      preferred_common_name: result.preferred_common_name
    };
    commonNameInfoList.push(commonName);
  }

  return commonNameInfoList;

};


/**
 * @function handlePlantIdSubmit 
 * @description calls the plantID API passing the user submitted image as data.
 * 
 * @param {string[]} userImages the submitted user images
 * @returns the plantID information in JSON format
 */
export const handlePlantIdSubmit = async (userImages: string[]) => {
  const data = {
    api_key: await fetch('/api/plantId').then(res => res.json().then(res => res.response)),
    images: userImages,
    modifiers: ["crops_fast", "similar_images"],
    plant_language: "en",
    plant_details:
      [
        "common_names",
        "url",
        "name_authority",
        "wiki_description",
        "taxonomy",
        "synonyms"
      ],
  };
  let json = {};
  const res = await fetch('https://api.plant.id/v2/identify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  json = await res.json();
  return json;
};


/**
 * @function autocompleteSearch
 * @description Gets the species autocomplete information when searching through the iNAT / Collections pages. 
 * The information comes from the iNaturalist API.
 * 
 * @param {string} query The query string to search for.
 * @returns {Promise<string[]>} The species autocomplete information as an array of strings.
 */
export const autocompleteSearch = async (query: string): Promise<string[]> => {
  if (!query) return [];
  let arr: string[] = [];

  const config: string = 'taxa/autocomplete?rank=species&q=';
  const endpoint: string = iNatUrl(config, query, '');
  const iNatAutocomplete: iNatApiResponse = await basicFetch<iNatApiResponse>(endpoint);

  const MAX_ARRAY_LENGTH = 15;
  const ICONIC_TAXON_ID = 47126;

  const queryLower = query.toLowerCase();
  const sortedFilteredTerms = iNatAutocomplete.results
    .filter(result => result?.iconic_taxon_id === ICONIC_TAXON_ID && typeof result?.matched_term === 'string')
    .sort((a, b) => {
      const aStartsWithQuery = a.matched_term.toLowerCase().startsWith(queryLower);
      const bStartsWithQuery = b.matched_term.toLowerCase().startsWith(queryLower);

      if (aStartsWithQuery && !bStartsWithQuery) {
        return -1;
      } else if (!aStartsWithQuery && bStartsWithQuery) {
        return 1;
      }
      return 0;
    })
    .slice(0, MAX_ARRAY_LENGTH)
    .map(({ matched_term }) => matched_term);

  return sortedFilteredTerms;
};

export const getUserObservationsOfSpecies = async (iNatId: string, species: string) => {
  const observations = await fetch(`https://api.inaturalist.org/v1/observations?user_id=4${iNatId}&rank=species&taxon_name=${species}`)
  .then(res => res.json())
  return observations
}