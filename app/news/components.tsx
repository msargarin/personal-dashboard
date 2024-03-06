'use client';

import { useState, useEffect, useReducer } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { NewsData, categoryOptions } from "@/app/data";
import { useDebouncedCallback } from 'use-debounce';
import { useLocation } from "@/app/location/utils";
import { selectedCategoriesReducer } from "@/app/news/utils";

export function NewsList({
  loadingLocation,
  showCategories,
  size=10
}: {
  loadingLocation?: boolean,
  showCategories: boolean,
  size?: number
}) {
  const location:any = useLocation();

  const [newsList, setNewsList] = useState<NewsData[]>();
  const [newsAPIError, setNewsAPIError] = useState<boolean>(false);

  const [initializedCategories, setInitializedCategories] = useState<boolean>(false);
  const [selectedCategories, dispatchSelectedCategoriesReducer] = useReducer(selectedCategoriesReducer, []);
  const [notSelectedCategories, setNotSelectedCategories] = useState<string[]>([]);

  // Extract country code from location data
  let country_code = '';
  if (location) {
    country_code = location.country.code.toLowerCase()
  }

  // Debounce API calls to prevent fetching in short order
  const fetchNewsList = useDebouncedCallback(async (size: number, country_code?: string) => {
    let query = `size=${size}`;

    // Reset news list to inform user that we need to reload
    setNewsList(undefined);

    // Set country paramater
    if (country_code) {
      query += `&country=${country_code}`;
    }

    // Set categories paramater
    if (selectedCategories && selectedCategories.length !== 0) {
      query += `&categories=${selectedCategories.join(',')}`;
    }

    try {
      // Send request to api
      const response = await fetch(`/api/news?${query}`);
      const data = await response.json();

      // Handle errors returned by API
      if (data.status === 'error'){
        // Schedule another fetch in 30mins if error is due to rate limit
        if (data.results.code === 'RateLimitExceeded' || data.results.code === 'TooManyRequests'){
          // Set error flag to inform user
          setNewsAPIError(true);

          // Schedule another fetch
          setTimeout(() => {
            fetchNewsList(size, country_code);
          }, 1800000)
        }
      } else {
        // Load results to component
        setNewsList(data.results);

        // Unset error flag
        setNewsAPIError(false);
      }
      // ;
    } catch (error) {
      console.error('Error fetching news data:', error);
    }
  }, 3000)

  useEffect(() => {
    if (showCategories && !initializedCategories){
      // Initialize selected categories from localstore if available
      // Check localstorage for categories data
      let localStoreCategories = localStorage.getItem('categories');
      if (localStoreCategories) {
        // Set categories if available
        dispatchSelectedCategoriesReducer({
          type: "initialized",
          categories: JSON.parse(localStoreCategories),
        });

        // Set initialized categories flag
        setInitializedCategories(true)
      }
    }

    // Initialize not selected category options
    if (selectedCategories){
      setNotSelectedCategories(
        categoryOptions.filter((c) => !selectedCategories.includes(c))
      )
    } else {
      setNotSelectedCategories(categoryOptions);
    }

    // Execute news data fetch
    fetchNewsList(size, country_code);
  }, [size, country_code, fetchNewsList, selectedCategories, showCategories, initializedCategories]);

  return (
    <div className="rounded-xl bg-gray-100 p-2 shadow-sm">
      <div className="flex p-4">
        <h1 className="font-medium text-xl">Latest News { location ? ` in ${location.country.name}` : '' }</h1>
      </div>

      <div className="container mx-auto p-2 pt-0">
        { showCategories ?
          <NewsCategories initializedCategories={initializedCategories} selectedCategories={selectedCategories} notSelectedCategories={notSelectedCategories} dispatchSelectedCategoriesReducer={dispatchSelectedCategoriesReducer} />
        : '' }

        { !newsList ? (
          <span className="w-full">
            { loadingLocation ? "Loading location ..." : (
              newsAPIError ? 'Sorry! We have encountered an error. We will try again shortly.' : 'Loading the latest news ...'
            )}
          </span>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {
              newsList.map((news, _) => {
                return (
                  <div key={news.article_id} className="bg-white rounded-lg border p-4">
                    <Image
                      src={news.image_url}
                      alt={news.title}
                      height="200"
                      width="300"
                      className="w-full h-48 rounded-md object-cover"
                    />
                    <div className="px-1 py-3">
                      <div className="font-bold text-xl mb-2">{news.title}</div>
                      <p className="truncate text-gray-700 text-base pb-2">
                        {news.description}
                      </p>
                      <Link
                        href={news.link}
                        target='_blank'
                        className="text-blue-500 hover:underline flex items-center"
                      >
                        <span className="mr-1">Read more</span>
                        <ArrowTopRightOnSquareIcon className="inline h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )
              })
            }
          </div>
        )}
      </div>
    </div>
  );
}

export function NewsCategories({
  initializedCategories,
  selectedCategories,
  notSelectedCategories,
  dispatchSelectedCategoriesReducer
}: {
  initializedCategories: boolean,
  selectedCategories: string[],
  notSelectedCategories: string[],
  dispatchSelectedCategoriesReducer: Function
}) {
  const [addingCategory, setAddingCategory] = useState<boolean>(false);

  // Handle click of the add category button
  function handleClickAddButton() {
    setAddingCategory(true);
  }

  // Handle click of the cancel button
  function handleClickCancelButton() {
    setAddingCategory(false);
  }

  // Handle selecting a category
  function handleSelectCategory(category:string) {
    dispatchSelectedCategoriesReducer({
      type: "added",
      category:category
    })

    setAddingCategory(false);
  }

  // Handle unselecting a category
  function handleUnselectCategory(category:string) {
    dispatchSelectedCategoriesReducer({
      type: "removed",
      category:category
    })
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm mb-4">
      <span className="font-medium text-lg">Selected categories:</span>
      <span className="ml-2">
        { initializedCategories ? (
          <>
            { selectedCategories.length === 0 ? (
              <div className="center relative inline-block select-none whitespace-nowrap rounded-lg bg-gradient-to-tr from-sky-200 to-sky-200 py-2 px-3.5 align-baseline font-sans text-sm font-bold uppercase leading-none ml-2 text-center">All categories</div>
            ) : (
              selectedCategories.map((c:string, _:number) => {
                return (
                  <div key={c} className="center relative inline-block select-none whitespace-nowrap rounded-lg bg-gradient-to-tr from-sky-200 to-sky-200 py-2 px-3.5 align-baseline font-sans text-sm font-bold uppercase leading-none ml-2">
                    <div className="mr-5 mt-px">{c}</div>
                    <div
                      className="absolute top-1 right-1 mx-px mt-[0.5px] w-max rounded-md bg-sky-200 transition-colors hover:bg-sky-600"
                      onClick={() => handleUnselectCategory(c)}
                    >
                      <div role="button" className="h-5 w-5 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"> <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </div>
                    </div>
                  </div>
                )
              })
            )}

            { selectedCategories.length < 5 ? (
              addingCategory ? (
                <div className="inline-flex flex-col justify-center absolute text-gray-500 ml-1">
                  <button
                      className="border-2 border-red-400 p-2 text-red-400 rounded-lg hover:text-white hover:bg-red-400 ml-2 text-sm"
                      onClick={handleClickCancelButton}
                  >
                    <svg className="w-4 h-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 50 50" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z"/>
                    </svg>
                    <span className="ml-1">Cancel</span>
                  </button>

                  <div className="relative">
                    <ul className="bg-white border border-gray-100 w-[200px] mt-2">
                      { notSelectedCategories.map((category:string, _:number) => {
                          return (
                            <li
                              className="pl-8 pr-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-sky-50 hover:text-gray-900"
                              key={category}
                              onClick={() => handleSelectCategory(`${category}`)}
                            >
                              {category}
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>
              ) : (
                <button
                    className="border-2 border-sky-500 p-2 text-sky-500 rounded-lg hover:text-white hover:bg-sky-500 ml-2 text-sm"
                    onClick={handleClickAddButton}
                >
                  <svg className="h-6 w-6 inline"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="9" />  <line x1="9" y1="12" x2="15" y2="12" />  <line x1="12" y1="9" x2="12" y2="15" /></svg>
                  <span className="ml-1">Add category</span>
                </button>
              )
            ) : ''}
          </>
        ) : (
          <span>Loading categories ...</span>
        )}
      </span>
    </div>
  )
}
