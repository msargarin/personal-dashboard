'use client';

import { WeatherWidget } from "@/app/weather/widget";
import { TasksWidget } from "@/app/tasks/components";
import { NewsList } from "@/app/news/components";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { LocationWidget } from "@/app/location/widget";
import { TasksProvider } from "@/app/tasks/utils";
import { useSetLocation } from "@/app/location/utils";
import { useEffect, useState } from "react";

export default function Home() {
  const username = "";
  const setLocation = useSetLocation();

  // Flag for loading location from localstorage
  const [ loadingLocation, setLoadingLocation ] = useState<boolean>(true)

  useEffect(() => {
    // Check localstorage for location data
    let localStoreLocation = localStorage.getItem('location');
    if (localStoreLocation) {
      if (setLocation){
        // Set location if available
        setLocation(JSON.parse(localStoreLocation));
      }

      // Unset the loading location from localstore flag
      setLoadingLocation(false);
    } else {
      // No location data in localstore
      // Unset the loading location from localstore flag
      setLoadingLocation(false);
    }
  }, [setLocation])

  return (
    <main className="p-2">
      <h1 className="mb-0 text-medium text-2xl md:text-3xl mb-1">
        Hello {username || "guest"}!
      </h1>
      <div className="mb-4 text-md text-gray-700 flex items-center">
        <CalendarIcon className="inline h-4 w-4 mr-1" />
        {new Date().toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' })}

        <span className="mr-2"></span>

        <LocationWidget loadingLocation={loadingLocation} />
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-3 gap-6">
        <WeatherWidget loadingLocation={loadingLocation} />

        <TasksProvider>
          <TasksWidget />
        </TasksProvider>
      </div>
      <div className="mt-6 grid grid-cols-1">
        <NewsList loadingLocation={loadingLocation} showCategories={false} size={6} />
      </div>
    </main>
  );
}
