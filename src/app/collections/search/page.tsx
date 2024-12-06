/**
 * @file /collections/search/page.tsx
 * @fileoverview page containing the list of site ready 3D models, for when users visit /collections/search
 */

import SearchClient from "@/components/Search/SearchClient";
import Foot from "@/components/Shared/Foot";

export default function SearchPage(){
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <meta name="description" content="A digital herbarium featuring annotated 3D models of various botanical specimens"></meta>
      <title>3D Herbarium Model Search Page</title>
      <SearchClient />
      <Foot />
    </>
  )
}