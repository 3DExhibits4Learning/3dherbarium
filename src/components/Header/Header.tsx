/**
 * @file /components/Header/Header.tsx
 * 
 * @fileoverview the header component used throughout the application.
 * It contains a search bar, the site logo, and links to the other pages.
 * It doubles as a drawer component to allow navigation in mobile browsers.
 */

'use client'

// Typical imports
import { MobileSearch } from "./MobileSearch"
import { useSession, } from "next-auth/react"
import { useParams } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { Navbar, NavbarContent, NavbarMenuToggle, NavbarBrand, NavbarMenu, NavbarMenuItem, Divider, Switch } from "@heroui/react"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { SearchIcon } from "./SearchIcon"
import { SearchHeaderProps } from "@/ts/types"
import { addDarkThemeListener, detectDarkTheme, removeDarkThemeListener} from "@/components/Header/headerLogic"

// Default imports
import LogoAndSignIn from "./LogoAndSignIn"
import AutoComplete from "./Autocomplete"
import Links from "./Links"
import MobileSessionOptions from "./MobileSessionOptions"
import MobileModelOptions from "./MobileModelOptions"
import MobileMenuOptions from "./MobileMenuOptions"

// Main JSX
export default function Header (props: SearchHeaderProps) {

  // Variable declarations
  const params = useParams()
  const { data: session } = useSession()

  const [autocompleteOptions, setAutocompleteOptions] = useState<any[]>([])
  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false)

  const searchQuery = useRef<string>(undefined)

  const headerTitle: string = props.headerTitle;
  const specimenName: string = (params['specimenName']) as string ?? headerTitle ?? ''

  const menuItems: string[] = [
    "Home",
    "Collections",
    "Plant.id",
    "Feed",
    "Accessibility"
  ]

  const userItems: string[] = [
    "Dashboard",
    "Submit a 3D Model",
  ]

  const fetchAutoCompleteOptions = async () => {
    const autocompleteOptions = await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?taxon_id=47126&rank=species,genus&q=${searchQuery.current}`).then(res => res.json()).then(json => json.results)
    setAutocompleteOptions(autocompleteOptions)
  }

  // Dark theme effects
  useEffect(() => detectDarkTheme(), [])
  useEffect(() => {addDarkThemeListener(); return () => removeDarkThemeListener()}, [])

  return <>
      <Navbar isBordered className="justify-between max-w-none bg-[#004C46] dark:bg-[#212121] text-white dark:text-white">

        {/* Mobile Menu Toggle */}

        <NavbarContent className="lg:hidden" justify="start">
          <NavbarMenuToggle />
        </NavbarContent>

        {/* Hidden switch for annotation switch reference */}

        {
          props.setAnnotationsEnabled &&
          <NavbarContent className="justify-start hidden">
            <Switch defaultSelected id="annotationSwitchMobileHidden" isSelected={props.annotationsEnabled} color='secondary' onValueChange={props.setAnnotationsEnabled}></Switch>
          </NavbarContent>
        }

        {/* Autocomplete search bar*/}

        <NavbarContent as="div" className="items-center hidden lg:flex" justify="start">
          <AutoComplete autocompleteOptions={autocompleteOptions} fetchAutoCompleteOptions={fetchAutoCompleteOptions} ref={searchQuery} />
        </NavbarContent>

        {/* Mobile Species Title*/}

        <NavbarContent className="lg:hidden pr-3" justify="center">
          <NavbarBrand>
            <p className="font-bold text-[white]"><i>{toUpperFirstLetter(decodeURIComponent(specimenName))}</i></p>
          </NavbarBrand>
        </NavbarContent>

        {/* Large screen link section */}

        <NavbarContent className="hidden lg:flex gap-4 ml-[6%]" justify="center">
          <Links page={props.page} />
        </NavbarContent>

        {/* Mobile search button/icon */}

        <NavbarContent as="div" className="items-center lg:hidden" justify="end">
          <button onClick={() => setMobileSearchOpen(true)}>
            <SearchIcon size={22} width="" height="" />
          </button>
        </NavbarContent>

        {/* Mobile Search Modal */}

        <MobileSearch isOpen={mobileSearchOpen} setIsOpen={setMobileSearchOpen} autocompleteOptions={autocompleteOptions} fetchAutoCompleteOptions={fetchAutoCompleteOptions} ref={searchQuery} />

        {/* Logo and Sign in Button*/}

        <LogoAndSignIn />


        {/***** MOBILE NAVBAR MENU *****/}


        <NavbarMenu className="z-20">

          {/* User section header */}

          <NavbarMenuItem>
            <h1 className="text-center">User</h1>
            <Divider />
          </NavbarMenuItem>

          {/* Mobile session-based options */}

          <MobileSessionOptions session={session} userItems={userItems} />

          {/* Navigation Section Header */}

          <NavbarMenuItem>
            <h1 className="text-center">Navigation</h1>
            <Divider />
          </NavbarMenuItem>

          {/* Static mobile navigation */}

          <MobileMenuOptions menuItems={menuItems} />

          {/* Mobile rendering conditional on whether there is a model */}

          {
            props.setAnnotationsEnabled &&
            <MobileModelOptions hasModel={props.hasModel} isSelected={props.annotationsEnabled} setIsSelected={props.setAnnotationsEnabled} />
          }
        </NavbarMenu>
      </Navbar >
    </>
}