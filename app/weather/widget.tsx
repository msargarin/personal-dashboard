import { WeatherData } from "@/app/data";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { useLocation } from "@/app/location/utils";

export function WeatherWidget({
  loadingLocation
} : {
  loadingLocation:boolean
}) {
  const location:any = useLocation();

  const [weatherData, setWeatherData] = useState<WeatherData>();

  useEffect(() => {
    // Define function to fetch weather data
    const fetchWeatherData = async () => {
      try {
        // Only send request to weather API if location is available
        if (location && location.coordinates) {
          // Send request to api
          const response = await fetch(`/api/weather?lat=${location.coordinates.lat}&lon=${location.coordinates.lon}`);
          const data: WeatherData = await response.json();

          // Load results to component
          setWeatherData(data);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Execue weather data fetch
    fetchWeatherData();
  }, [location]);

  return (
    <div className='rounded-xl bg-sky-300 py-4 text-2xl flex justify-center items-center h-[200px]'>
      {!location ? (
        <span>
          { loadingLocation ? "Loading location ..." : "Location not available" }
        </span>
      ) : (
        !weatherData ? (
          <span>Loading weather data ...</span>
        ) : (
          <>
            <Image
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              height='150'
              width='150'
              alt={weatherData.weather[0].main}
            />
            <div className='flex flex-col justify-center items-center'>
              <h2 className='font-bold'>
                {Math.round(weatherData.main.temp)}<small className='align-top'>&deg;C</small>
              </h2>
              <div>{weatherData.weather[0].main}</div>
            </div>
          </>
        )
      )}
    </div>
  );
}
