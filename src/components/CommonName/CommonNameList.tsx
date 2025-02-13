/**
 * @file /components/CommonName/CommonNameList.tsx
 * @fileoverview renders a list of cards containing images and common names correlating to the 
 * search query looked up by the user.
 */

'use client';

import { useEffect, useState } from "react";

import noImage from '../../../public/noImage.png';
import { handleImgError } from "@/functions/client/utils/imageHandler";
import { CommonNameInfo } from "@/ts/types";

type CommonNameSwiperProps = {
  commonNameInfo: CommonNameInfo[];
  pageRoute?: string;
};

const CommonNameList = (props: CommonNameSwiperProps) => {

  const pageRoute: string | undefined = props.pageRoute || 'inaturalist';
  const info: CommonNameInfo[] = props.commonNameInfo;

  return (
    <section className='grid grid-cols-1 sm:grid-cols-2 md-custom:grid-cols-3 1xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-5 gap-4 mx-2.5'>
      {info && info.length > 0 && info.map((specimen: CommonNameInfo, index: number) => (
        <div key={index} className='noselect'>
          <article className='rounded-md overflow-hidden mx-1'>
            <section id='observation-info-card' className='rounded shadow-md mx-auto'>
              <a href={`/${pageRoute}/` + specimen.name} tabIndex={-1}>
                <img
                  alt={'Species ' + specimen.name}
                  role='button'
                  src={specimen.default_photo?.medium_url ?? ''}
                  className='w-full h-[calc(90vh-275px)] min-h-[17.5rem] max-h-[27.5rem] rounded-tr rounded-tl relative z-5'
                  onError={(e) => { handleImgError(e.currentTarget, noImage); }}
                />
              </a>
            </section>
            <section className='bg-[#98B8AD] dark:bg-[#3d3d3d] opacity-[0.99] px-5 py-3 rounded-b-md text-center relative z-10 flex flex-col justify-center items-center h-[10rem] mt-[-10px]'>
              <section className='flex flex-col items-center'>
                <a
                  href={`/${pageRoute}/` + specimen.name}
                  rel='noopener noreferrer'
                  className='text-[#002923] dark:text-[#C3D5D1] text-[1.2rem] sm:flex md:flex flex-col font-bold'
                >
                  <i>{specimen.name}&nbsp;</i> <span> ({specimen.rank})</span>
                </a>
                <br />
                <p className='text-black dark:text-white'>License: {specimen.default_photo?.license}</p>
                <p className='text-black dark:text-white'>Image by: {specimen.default_photo?.photo_by}</p>
              </section>
            </section>
          </article>
        </div>
      ))}

      {info && info.length <= 0 &&
        <p>No results, try searching again.</p>
      }
    </section>
  );
};

export default CommonNameList;
