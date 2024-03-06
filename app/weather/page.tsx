'use client';

import { useState, useEffect } from "react";
import Image from 'next/image';
import { WeatherData } from "@/app/data";
import { fetchWeatherNowData, fetchWeatherForecastData } from '@/app/weather/utils';
import { useLocation } from "@/app/location/utils";

export default function Weather() {
  const location:any = useLocation();

  const [weatherNowData, setWeatherNowData] = useState<WeatherData>();
  const [weatherForecastData, setWeatherForecast] = useState<any>();

  useEffect(() => {
    // Execue weather now data fetch
    fetchWeatherNowData(location, setWeatherNowData);

    // Execue weather forecast data fetch
    fetchWeatherForecastData(location, setWeatherForecast);
  }, [location]);

  return (
    <div className="bg-gray-100 p-4 shadow-sm">
      <div className="flex p-2">
        <h1 className="font-medium text-xl">Weather { location ? ` in ${location.city}` : '' }</h1>
      </div>
      <div className="container mx-auto p-4 bg-sky-300 rounded-lg min-h-[200px]">
        { !weatherNowData ? (
          <span>Loading weather today ...</span>
        ) : (
          <div className="flex grid text-xl">
            <h1 className="absolute">Today</h1>

            <div className="flex justify-center">
              <div className="flex flex-col text-center justify-center sm:ml-2 md:ml-6 lg:ml-12">
                <Image
                  src={`https://openweathermap.org/img/wn/${weatherNowData.weather[0].icon}@2x.png`}
                  height='150'
                  width='150'
                  alt={weatherNowData.weather[0].main}
                />
              </div>

              <div className='flex flex-col text-center justify-center ml-2 md:ml-6 lg:ml-12'>
                <h2 className='font-bold'>
                  {Math.round(weatherNowData.main.temp)}<small className='align-top'>&deg;C</small>
                </h2>
                <div>{weatherNowData.weather[0].main}</div>
              </div>

              <div className='flex flex-col text-center justify-center ml-2 md:ml-6 lg:ml-12'>
                <div>
                  <span className='font-bold'>Min:</span> {Math.round(weatherNowData.main.temp_min)}<small className='align-top'>&deg;C</small>
                </div>
                <div>
                  <span className='font-bold'>Max:</span> {Math.round(weatherNowData.main.temp_max)}<small className='align-top'>&deg;C</small>
                </div>
              </div>

              <div className='flex flex-col text-center justify-center ml-2 md:ml-6 lg:ml-12'>
                <div>
                  <span className='font-bold'>Feels like:</span> {Math.round(weatherNowData.main.feels_like)}<small className='align-top'>&deg;C</small>
                </div>
                <div>
                  <span className='font-bold'>Humidity:</span> {Math.round(weatherNowData.main.humidity)}<small className='align-top'>%</small>
                </div>
              </div>

              <div className='flex-col text-center justify-center ml-2 md:ml-6 lg:ml-12 hidden lg:flex'>
                <div>
                  <span className='font-bold'>Sunrise:</span> {new Date(weatherNowData.sys.sunrise).toLocaleTimeString()}
                </div>
                <div>
                  <span className='font-bold'>Sunset:</span> {new Date(weatherNowData.sys.sunset).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto p-4 bg-white rounded-lg min-h-[200px] mt-4">
      { !weatherForecastData ? (
          <span>Loading weather forecast ...</span>
        ) : (
          <div className="flex grid text-xl">
            <h1 className="absolute">Forecast</h1>

            <div className="flex justify-center">
            {
              weatherForecastData.list.map((data:WeatherData, i:number) => {
                return (
                  <div key={data.dt_txt} className={`flex flex-col text-center mx-8 ${ i > 3 ? 'hidden lg:block' : ''} ${ i > 2 ? 'hidden xl:block' : ''}`}>
                    <Image
                      src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                      height='150'
                      width='150'
                      alt={data.weather[0].main}
                    />
                    <h2 className='font-bold'>
                      {Math.round(data.main.temp)}<small className='align-top'>&deg;C</small>
                    </h2>
                    <div>{data.weather[0].main}</div>

                    <h1>{new Date(data.dt_txt).toLocaleDateString('en-au')}</h1>
                  </div>
                )
              })
            }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
