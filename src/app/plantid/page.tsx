/**
 * @file /app/plantid/page.tsx
 * 
 * @fileoverview the plantID page where users can upload an image of a plant to identify what it could possibly be.
 */

'use client'

// Typical imports
import { handlePlantIdSubmit } from '@/functions/server/fetchFunctions'
import { PlantIdApiResponse, PlantIdSuggestion } from '@/ts/types'
import { trimString } from '@/functions/client/utils/trimString'
import { useState } from 'react'
import { useIsClient } from '@/functions/client/utils/isClient'

// Default imports
import dynamic from 'next/dynamic'
import Foot from '@/components/Shared/Foot'

// Dynamic imports
const Header = dynamic(() => import('@/components/Header/Header'), { ssr: false })

var searchTerm: string | null

export default function PlantIdPage() {

  const isClient: boolean = useIsClient()

  if (isClient) {
    searchTerm = sessionStorage.getItem("searchTerm")
    if (!searchTerm) {
      sessionStorage.setItem("searchTerm", "sequoia sempervirens")
      searchTerm = "sequoia sempervirens"
    }
  }

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [plantIdResults, setPlantIdResults] = useState<PlantIdApiResponse | null>(null)

  /**
   * @function handlePlantIdSubmitWithTimeout 
   * @description runs the image through the plantID API; returns an error if the API takes
   * longer than 15 seconds to resolve.
   * @see handlePlantIdSubmit
   * 
   * @param {string[]} base64Strings the array of base64 encoded photos
   */
  const handlePlantIdSubmitWithTimeout = async (base64Strings: string[]): Promise<void> => {
    try {
      const plantIdPromise = handlePlantIdSubmit(base64Strings);
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 15000))

      const result = await Promise.race([plantIdPromise, timeoutPromise])

      if (result === timeoutPromise) {
        console.error("handlePlantIdSubmit timed out")
      } else {
        setPlantIdResults(result as PlantIdApiResponse)
      }
    } catch (error) {
      console.error("Error occurred during plant identification", error)
    } finally {
      setLoading(false)
    }
  };

  /**
   * @function handleImageSelect 
   * @description allows users to select an image from their native gallery / file system.
   * The image is converted to a base64 string and passed to the handlePlantIdSubmitWithTimeout function.
   * @see handlePlantIdSubmitWithTimeout
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event 
   */
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event) return
    setPlantIdResults(null)
    try {
      const files = event.target.files
      if (!files || !files.length) return

      const filesArr = Array.from(files)
      setSelectedPhoto(URL.createObjectURL(files[0]));
      setLoading(true)

      const base64Strings = await Promise.all(
        filesArr.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = e => {
              const base64String = e.target?.result
              resolve(base64String)
            }
            reader.onerror = () => reject(new Error('Problem reading the file'))
            reader.readAsDataURL(file)
          })
        }),
      )
      await handlePlantIdSubmitWithTimeout(base64Strings as string[]);
    } catch (error) {
      console.error("Error processing images", error);
    } finally {
      setLoading(false);
    }
  };

  return <div className="flex flex-col min-h-screen">

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
    <title>3D Herbarium Plant.id</title>

    <Header headerTitle='plantid' searchTerm={searchTerm as string} pageRoute='collections' />

    {
      isClient &&
      <>
        <section className="flex flex-col min-h-[calc(100vh-177px)]">

          <h1 className="text-xl p-5">Identify a plant through just an image. JPEGs and PNGs only!</h1>
          <input id='plantIdFileInput' type="file" accept="image/*" multiple onChange={handleImageSelect} className="m-5" />
          {loading && <p className="text-lg p-5">Loading...</p>}
          {
            !loading && selectedPhoto &&
            <section className="flex flex-col items-center justify-center p-5">
              <h2 className="text-center mb-4">Uploaded Image:</h2>
              <img src={selectedPhoto} className="w-[60%] md:w-[25%] h-auto object-cover rounded" alt="User Uploaded Image" />
            </section>
          }
          <br />
          {
            plantIdResults &&
            <>
              {
                plantIdResults.suggestions.map((suggestion: PlantIdSuggestion, index: number) =>

                  <section key={suggestion.id + '-' + index} className='sm:text-left text-center p-5 flex flex-col md:flex-row items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0 mb-5'>

                    <div className="min-w-[80px] flex-shrink-0 text-center text-dark font-bold overflow-hidden">{(suggestion.probability * 100).toFixed(2)}%</div>

                    <div className="flex justify-center md:justify-start space-x-4 w-full md:w-auto">
                      <div className="w-48 md:w-48 h-48 md:h-48 bg-cover bg-center rounded" style={{ backgroundImage: `url(${suggestion.similar_images[0].url})` }}></div>
                      <div className="w-48 md:w-48 h-48 md:h-48 bg-cover bg-center rounded" style={{ backgroundImage: `url(${suggestion.similar_images[1].url})` }}></div>
                    </div>

                    <div className="flex-grow">
                      <h3 className='text-xl pb-1'>
                        <a className="underline text-[#004C46] dark:text-[#C3D5D1]" href={`/collections/${suggestion.plant_details.scientific_name}`}>{suggestion.plant_details.scientific_name}</a>{" "}
                        ({'species' in suggestion.plant_details.structured_name ? 'Species' : 'Genus'})
                      </h3>
                      <i><p className="pb-1">{suggestion.plant_details.common_names ? suggestion.plant_details.common_names.join(', ') : ''}</p></i>
                      <p>Probability: <b>{(suggestion.probability * 100).toFixed(2)}%</b></p><br />
                      <p className="pb-1">{suggestion.plant_details.wiki_description && 'value' in suggestion.plant_details.wiki_description ? trimString(suggestion.plant_details.wiki_description.value, 375) : ''}</p>
                      <p><a href={suggestion.plant_details.url} target="_blank" rel="noopener noreferrer" className="underline text-[#004C46] dark:text-[#C3D5D1]">Learn More</a></p>
                    </div>

                  </section>)
              }
            </>
          }
        </section>
        <Foot />
      </>
    }
  </div>
}