import noImage from '../../../public/noImage.png'
import { handleImgError } from '@/utils/imageHandler'
import { SyntheticEvent, useContext } from 'react'
import { model } from '@prisma/client'
import { fullUserSubmittal } from '@/api/types'
import { Chip } from '@nextui-org/react'
import { toUpperFirstLetter } from '@/utils/toUpperFirstLetter'
import { QueryContext } from './SearchClient'

// Props interface
interface SearchPageModelListProps {
  models: model[]
  communityModels: fullUserSubmittal[]
  selectedModeler: string
  selectedAnnotator: string | undefined
  order: string
  communityIncluded: boolean
}

const SearchPageModelList = (props: SearchPageModelListProps) => {

  // Variable declarations
  const models = props.models
  const selectedModeler: string = props.selectedModeler
  const selectedAnnotator = props.selectedAnnotator
  const query = useContext(QueryContext).query
  var communityModels = props.communityModels

  // Filter by modeler and annotator
  var filteredModels: Array<fullUserSubmittal | model> = models.filter(model =>
    (selectedModeler === 'All' || model.modeled_by === selectedModeler) &&
    (selectedAnnotator === 'All' || model.annotator === selectedAnnotator)
  )

  // Filter by search query
  if (query) {
    filteredModels = filteredModels.filter(model => (model as model).spec_name.includes(query) || (model as model).pref_comm_name.includes(query))
    communityModels = communityModels.filter(model => model.speciesName.includes(query) || model.commonName.includes(query))
  }

  // Join and organize herbarium models and community models if there is no selected modeler or annotator
  if (selectedModeler === 'All' && selectedAnnotator === 'All' && props.communityIncluded) {
    filteredModels.push(...communityModels)
  }

  filteredModels = filteredModels.sort((a: any, b: any) => {

    var returnValue

    switch (props.order) {

      case 'Alphabetical': // These two data names should be unified in the database to avoid further blocks such as this one

        if (Object.keys(a).includes('speciesName') && Object.keys(b).includes('spec_name')) {
          const value = a.speciesName.localeCompare(b.spec_name) as number
          returnValue = value
        }
        else if (Object.keys(a).includes('spec_name') && Object.keys(b).includes('speciesName')) {
          const value = a.spec_name.localeCompare(b.speciesName) as number
          returnValue = value
        }
        else if (Object.keys(a).includes('speciesName') && Object.keys(b).includes('speciesName')) {
          const value = a.speciesName.localeCompare(b.speciesName) as number
          returnValue = value
        }
        else {
          const value = a.spec_name.localeCompare(b.spec_name) as number
          returnValue = value
        }

        break

      case 'Newest First': // These two data names should be unified in the database to avoid further blocks such as this one

        if (Object.keys(a).includes('dateTime') && Object.keys(b).includes('spec_acquis_date')) {
          const value = a.dateTime.localeCompare(b.spec_acquis_date) as number
          returnValue = -value
        }
        else if (Object.keys(a).includes('spec_acquis_date') && Object.keys(b).includes('dateTime')) {
          const value = a.spec_acquis_date.localeCompare(b.dateTime) as number
          returnValue = -value
        }
        else if (Object.keys(a).includes('dateTime') && Object.keys(b).includes('dateTime')) {
          const value = a.dateTime.localeCompare(b.dateTime) as number
          returnValue = -value
        }
        else {
          const value = a.spec_acquis_date.localeCompare(b.spec_acquis_date) as number
          returnValue = -value
        }

        break

      case 'Reverse Alphabetical': // These two data names should be unified in the database to avoid further blocks such as this one

        if (Object.keys(a).includes('speciesName') && Object.keys(b).includes('spec_name')) {
          const value = a.speciesName.localeCompare(b.spec_name) as number
          returnValue = -value
        }
        else if (Object.keys(a).includes('spec_name') && Object.keys(b).includes('speciesName')) {
          const value = a.spec_name.localeCompare(b.speciesName) as number
          returnValue = -value
        }
        else if (Object.keys(a).includes('speciesName') && Object.keys(b).includes('speciesName')) {
          const value = a.speciesName.localeCompare(b.speciesName) as number
          returnValue = -value
        }
        else {
          const value = a.spec_name.localeCompare(b.spec_name) as number
          returnValue = -value
        }

        break
    }

    return returnValue as number
  })

  return (
    <>
      {filteredModels && filteredModels.length === 0 &&
        <div className='h-[35rem] rounded mx-auto flex items-center justify-center'>
          <p className='text-2xl px-5'>No models found matching the current filters. Try adjusting your filter settings for broader results.</p>
        </div>
      }
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-5 gap-4 mx-5'>
        {filteredModels && filteredModels.map((model: model | fullUserSubmittal, index: number) => {
          return (
            <>
              {
                Object.keys(model).includes('spec_name') &&
                <div key={index} className='noselect'>
                  <article className='rounded-md overflow-hidden mx-1'>
                    <section className='rounded shadow-md mx-auto'>
                      <a href={"/collections/" + (model as model).spec_name} tabIndex={-1}>
                        <img
                          alt={'Image of ' + (model as model).spec_name}
                          role='button'
                          src={model.thumbnail ?? ''}
                          className='w-full h-[calc(100vh-275px)] min-h-[25rem] max-h-[30rem] object-cover relative z-5 rounded-t-md'
                          onError={(e: SyntheticEvent<HTMLImageElement, Event>) => { handleImgError(e.currentTarget, noImage); }}
                        />
                      </a>
                    </section>
                    <section className='bg-[#CDDAD5] dark:bg-[#3d3d3d] h-[5rem] max-h-[calc(100vh-300px)*0.2] opacity-[0.99] px-5 py-3 rounded-b-md text-center relative z-10 flex flex-col justify-center items-center space-y-1.5 mt-[-1px]'>
                      <section className='flex items-center space-x-0.5rem'>
                        <a
                          href={"/collections/" + (model as model).spec_name}
                          rel='noopener noreferrer'
                          className='text-[#004C46] dark:text-[#C3D5D1] text-xl'
                        >
                          <i className='font-medium'>{(model as model).spec_name.charAt(0).toUpperCase() + (model as model).spec_name.slice(1)}</i>
                        </a>
                      </section>
                      <section className='text-md font-medium text-black dark:text-white'>
                        {toUpperFirstLetter((model as model).pref_comm_name)}
                      </section>
                    </section>
                  </article>
                </div>
              }

              {
                Object.keys(model).includes('speciesName') &&
                <div key={index} className='noselect'>
                  <article className='rounded-md overflow-hidden mx-1'>
                    <Chip size='lg' className='z-[1] absolute ml-4 mt-2 text-white'>Community</Chip>
                    <section className='rounded shadow-md mx-auto'>
                      <a href={"/collections/" + (model as fullUserSubmittal).speciesName + `?communityId=${(model as fullUserSubmittal).modeluid}`} tabIndex={-1}>
                        <img
                          alt={'Image of ' + (model as fullUserSubmittal).speciesName}
                          role='button'
                          className='w-full h-[calc(100vh-275px)] min-h-[25rem] max-h-[30rem] object-cover relative z-5 rounded-t-md'
                          src={(model as fullUserSubmittal).thumbnail ?? ''}
                          onError={(e: SyntheticEvent<HTMLImageElement, Event>) => { handleImgError(e.currentTarget, noImage); }}
                        />
                      </a>
                    </section>
                    <section className='bg-[#CDDAD5] dark:bg-[#3d3d3d] h-[5rem] max-h-[calc(100vh-300px)*0.2] opacity-[0.99] px-5 py-3 rounded-b-md text-center relative z-10 flex flex-col justify-center items-center space-y-1.5 mt-[-1px]'>
                      <section className='flex items-center space-x-0.5rem'>
                        <a
                          href={"/collections/" + (model as fullUserSubmittal).speciesName}
                          rel='noopener noreferrer'
                          className='text-[#004C46] dark:text-[#C3D5D1] text-xl'
                        >
                          <i className='font-medium'>{(model as fullUserSubmittal).speciesName.charAt(0).toUpperCase() + (model as fullUserSubmittal).speciesName.slice(1)}</i>
                        </a>
                      </section>
                      <section className='text-sm font-medium text-black dark:text-white'>
                        {toUpperFirstLetter((model as fullUserSubmittal).commonName)}
                      </section>
                    </section>
                  </article>
                </div >
              }
            </>
          )
        })}
      </section >
    </>
  );

};

export default SearchPageModelList;