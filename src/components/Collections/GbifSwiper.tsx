/**
 * @file GbifSwiper.tsx
 * 
 * @fileoverview Client component which provides the image swiper/carousel on the Collections page
 */

'use client'

// Typical imports
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules'
import { toUpperFirstLetter } from '@/functions/server/utils/toUpperFirstLetter'
import { GbifImageResponse } from '@/ts/types'
import { useRef } from 'react'
import { isMobileOrTablet } from '@/functions/client/utils/isMobile'

// Default imports
import noImage from '../../../public/noImage.png'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const handleImgError = (currentTarget: HTMLImageElement) => {
  currentTarget.onerror = null
  currentTarget.src = noImage.src
}

type GbifOccurrenceSwiperProps = {
  info: GbifImageResponse[]
  swiperHeight: number
  imageHeight: number
}

const OccurrenceSwiper: React.FC<GbifOccurrenceSwiperProps> = (props) => {
  const observationsInfo = props.info
  const swiperRef = useRef<SwiperRef | null>(null)

  return <Swiper
    ref={swiperRef}
    className='mt-1 w-full h-[calc(100vh-212px)] lg:h-[calc(100vh-222px)] min-h-[300px]'
    style={{
      maxHeight: props.swiperHeight,
      '--swiper-pagination-bottom': '1px',
      '--swiper-pagination-bullet-size': '12px',
    } as any}
    spaceBetween={0}
    slidesPerView={1}
    navigation={true}
    keyboard={true}
    cssMode={isMobileOrTablet() ? true : false}
    pagination={{ clickable: true, dynamicBullets: true, type: 'bullets', }}
    modules={[Navigation, Pagination, Mousewheel, Keyboard]}
    mousewheel={{
      forceToAxis: true,
    }}
    breakpoints={{
      1024: {
        slidesPerView: 2,
        spaceBetween: 0
      },
      1280: {
        slidesPerView: 3,
        spaceBetween: 0
      },
    }}
  >
    <div className='mx-7 rounded-md overflow-hidden'>
      {
        observationsInfo.map((observation, index: number) => <SwiperSlide
          key={index}
          className='noselect swiper-slide-custom px-2 sm:px-3.5'>
          <article className='rounded-md overflow-hidden'>
            <section
              id='observation-info-card'
              className='rounded shadow-md mx-auto'>
              <img
                alt={'Specimen Observation Photo ' + index}
                src={observation.url}
                className='w-full h-[calc(100vh-348px)] lg:h-[calc(100vh-363px)] z-5 min-h-[200px]'
                style={{ maxHeight: props.imageHeight }}
                tabIndex={0}
                onError={(e) => { handleImgError(e.currentTarget); }}
                onFocus={(e) => {
                  if (swiperRef.current) {
                    const slide = e.currentTarget.closest('.swiper-slide')
                    if (slide && slide.parentElement) {
                      const slideIndex = Array.from(slide.parentElement.children).indexOf(slide)
                      if (slideIndex !== swiperRef.current.swiper.activeIndex) {
                        swiperRef.current.swiper.slideTo(slideIndex)
                      }
                    }
                  }
                }}
              />
            </section>
            <section className='bg-[#98B8AD] dark:bg-[#3d3d3d] opacity-[0.99] px-5 rounded-br-md rounded-bl-md text-center relative z-10 flex flex-col justify-center items-center h-28'>
              <p className='font-medium text-black  dark:text-white text-xl'>{toUpperFirstLetter(observation.author)}</p>
              <p className='text-black h-[50px] dark:text-white overflow-auto'>{observation.license}</p>
            </section>
          </article>
        </SwiperSlide>)
      }
    </div>
  </Swiper>

}

export default OccurrenceSwiper