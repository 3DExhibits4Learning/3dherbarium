/**
 * @file /app/common-name/[specimenName]/page.tsx
 * @fileoverview page containing a list of potential matches based on the user's "common name" query;
 * In this context, a "common name" query is any search not matching a species of genus. This page is routed
 * to from the iNaturalist page.
 */

import { fetchCommonNameInfo } from "@/functions/server/fetchFunctions";
import { CommonNameInfo, SiteReadyModels } from "@/ts/types";

import CommonNameList from "@/components/CommonName/CommonNameList";
import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";
import PageWrapper from "@/components/Shared/PageWrapper";


const CommonNameSearchPage = async (props: { params: Promise<{ specimenName: string }> }) => {
  const params = await props.params;

  const specimenName: string = params.specimenName || '';
  const commonNameInfo: CommonNameInfo[] = await fetchCommonNameInfo(specimenName);

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <title>3D Herbarium Common Name Search</title>
      <Header headerTitle={specimenName} pageRoute="inaturalist" searchTerm={specimenName} />
      <PageWrapper>
        <div className="h-12 bg-[#00856A] dark:bg-[#3d3d3d] text-white flex pl-8 mb-8 items-center">
          <p>Common Name Search Results</p>
        </div>
        <section id='common-name-container' className='pb-4 px-4'>
          <CommonNameList commonNameInfo={commonNameInfo} pageRoute="inaturalist" />
        </section>
        <Foot />
      </PageWrapper>
    </>
  );
};

export default CommonNameSearchPage;