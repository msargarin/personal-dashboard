'use client';

import { MapPinIcon } from "@heroicons/react/24/solid";
import { useDebouncedCallback } from "use-debounce";
import { useRef, useState } from "react";
import { useLocation, useSetLocation } from "@/app/location/utils";
import { LocationData } from "@/app/data";

export function LocationWidget({
  loadingLocation
} : {
  loadingLocation:boolean
}) {
  const location:any = useLocation();
  const setLocation = useSetLocation();

  const [searchResults, setSearchResults] = useState<Array<Object>>([]);
  const [searchingLocation, setSearchingLocation] = useState<boolean>(false);
  const [inputLocation, setInputLocation] = useState<string>('');

  const locationSearchBox = useRef(null)

  // Handle click of location
  const handleLocationClick = () => {
    // Reset content on location search box
    setInputLocation('')

    // TODO: Fix focusing on location box
    // locationSearchBox.current?.focus();

    // Reset results
    setSearchResults([]);

    // Set searchingLocation flag
    setSearchingLocation(true);
  }

  // Handle focus out from location search box
  const handleCancelLocationSearch = () => {
    // Unset searchingLocation flag
    setSearchingLocation(false);
  }

  // Handle debounced location search
  const handleSearch = useDebouncedCallback(async () => {
    if (inputLocation.length >= 3){
      // Send request to api
      const response = await fetch(`/api/location?q=${inputLocation}`);
      const data = await response.json();

      // Show results
      setSearchResults(data)

      console.log('location fetched');  // DEBUG
    } else {
      console.log("need at least 3 characters");  // DEBUG
    }
  }, 500)

  // Handle location selection
  const handleSelectLocation = (e:any) => {
    let location:any = searchResults[e.target?.dataset.id];

    // Set current location
    if (setLocation){
      setLocation(location);
    }

    // Save to localstorage
    localStorage.setItem('location', JSON.stringify(location));

    // Unset searchingLocation flag
    setSearchingLocation(false);
  }

  return (
    <>
      <MapPinIcon className="inline h-4 w-4 mr-1" />
      <span
        title="Click to change location"
        className={`underline cursor-pointer ${ searchingLocation ? "hidden" : "" }`}
        onClick={handleLocationClick}
      >
        {
          !location ?
            loadingLocation ? "Loading location ..." : "Location unknown"
          :
          `${location.city}, ${location.country.name}`
        }
      </span>
      <div className={`ml-1 ${ searchingLocation ? "" : "hidden" }`}>
        <div className="relative">
            <input
              ref={locationSearchBox}
              type="text" className="p-2 pl-8 rounded border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder={ location ? location.city : 'search city ...'}
              onChange={(e) => {
                setInputLocation(e.target.value);
                handleSearch();
              }}
              value={inputLocation}
            />
            <svg className="w-4 h-4 absolute left-2.5 top-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <svg className="w-4 h-4 absolute right-2.5 top-3.5 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 50 50" stroke="currentColor" onClick={handleCancelLocationSearch}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z"/>
            </svg>
        </div>

        { searchResults.length > 0 && (
          <ul className="bg-white border border-gray-100 w-full mt-2">
            {
              searchResults.map((data:any, id:Number) => {
                return (
                  <li key={data.city} className="pl-8 pr-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-sky-50 hover:text-gray-900" data-id={id} onClick={handleSelectLocation}>
                    {data.city}, {data.country.name}
                  </li>
                )
              })
            }
          </ul>
        )}
      </div>
    </>
  );
}
