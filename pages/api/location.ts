import { NextApiRequest, NextApiResponse } from 'next';

// Import the newsdata.io API key from the .env file
const apiKey = process.env.GOOGLE_API_KEY;
const apiUrl = process.env.GOOGLE_GEOCODING_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('geocoding api hit');  // DEBUG

  // Return an error if API key is not found
  if (!apiKey) {
    res.status(500).json({ error: 'Geocoding API key not found.' });
    return;
  }

  // Extract the categories from the request object
  const { q } = req.query;

  try {
    const response = await fetch(`${apiUrl}?key=${apiKey}&address=${q}`);
    const data = await response.json();

    if (data.status === 'OK') {
      // Extract necessary data
      let locations:Array<Object> = [];
      data.results.map((row:any, _:Number) => {
        let location = {
          city: null,
          country: {
            name: null,
            code: null
          },
          coordinates: {
            lat: null,
            lon: null
          }
        };

        // Set city and country for location
        // Filter address components to just 'locality', 'administrative_area_level_1' and 'country'
        //  since these correspond to the city and country component
        row.address_components
          .filter((addr:any) => (
            addr.types.includes('locality')
            || addr.types.includes('administrative_area_level_1')
            || addr.types.includes('country')))
          .map((addr:any, _:Number) => {
            // Set city and country
            if (addr.types.includes('locality')){
              location.city = addr.long_name
            } else if (addr.types.includes('administrative_area_level_1')) {
              // Set city with 'administrative_area_level_1' if it is not yet set
              if (!location.city){
                location.city = addr.long_name
              }
            } else if (addr.types.includes('country')){
              location.country.name = addr.long_name
              location.country.code = addr.short_name.toLowerCase()
            }
          })

          // Set coordinates for location
          location.coordinates.lat = row.geometry.location.lat
          location.coordinates.lon = row.geometry.location.lng

          // Append location to array
          locations.push(location)
        })

      // Filter out results with no city
      locations = locations.filter((loc:any) => Boolean(loc.city))

      // Forward the response to the front-end
      res.status(200).json(locations);
    } else if (data.status === 'ZERO_RESULTS') {
      // Forward the an empty array as response to the front-end
      res.status(200).json([]);
    } else {
      // TODO: Log errors

      // Forward the an empty array as response to the front-end
      res.status(200).json([]);
    }
  } catch (error) {
    // TODO: Log errors

    // Forward the an empty array as response to the front-end
    res.status(200).json([]);
  }
};
