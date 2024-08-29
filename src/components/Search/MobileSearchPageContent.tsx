/**
 * @file /component/Search/MobileSearchPageContent.tsx
 * @fileoverview mobile only page listing mobile friendly 3D models
 */

'use client';

import PageWrapper from "../Shared/PageWrapper";
import SearchPageModelList from "./SearchPageModelList";
import { SiteReadyModels } from "@/api/types";
import Foot from "../Shared/Foot";
import { userSubmittal } from "@prisma/client";


type SearchPageContentProps = {
  models: SiteReadyModels[];
  communityModels: userSubmittal[] 
};

const MobileSearchPageContent = (props: SearchPageContentProps) => {

  return (
    <PageWrapper>
      <SearchPageModelList models={props.models} selectedModeler={''} selectedAnnotator={''} communityModels={[]}/>
      <br />
      <Foot />
    </PageWrapper>
  )
};

export default MobileSearchPageContent;