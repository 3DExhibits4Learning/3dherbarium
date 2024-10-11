/**
 * @file /collections/search/page.tsx
 * @fileoverview page containing the list of site ready 3D models, for when users visit /collections/search
 */

import SearchClient from "@/components/Search/SearchClient";
import Foot from "@/components/Shared/Foot";

const SearchPage = async () => {

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <title>3D Herbarium Model Search Page</title>
      <SearchClient />
      <Foot />
    </>
  )
}

export default SearchPage;