/**
 * @file /collections/search/page.tsx
 * 
 * @fileoverview page containing the list of site ready 3D models, for when users visit /collections/search
 */

// Default imports
import SearchClient from "@/components/Search/SearchClient";
import Foot from "@/components/Shared/Foot";

// Main JSX
export default function SearchPage(){
  return <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <meta name="description" content="A 3D digital herbarium featuring annotated 3D models of plants"></meta>
      <title>3D Digital Herbarium</title>
      <SearchClient />
      <Foot />
    </>
}