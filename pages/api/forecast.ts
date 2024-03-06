import { WeatherData } from '@/app/data';
import { NextApiRequest, NextApiResponse } from 'next';

// Import the OpenWeatherMap API key from the .env file
const apiKey = process.env.OPENWEATHERMAP_API_KEY;
const apiUrl = process.env.OPENWEATHERMAP_URL_FORECAST;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('weather forecast api hit');  // DEBUG

  // Return an error if API key is not found
  if (!apiKey) {
    res.status(500).json({ error: 'Weather API key not found.' });
    return;
  }

  // Extract the query parameters from the request object
  const { lat, lon } = req.query;

  // Return an error if query parameters are incomplete
  if (!lat && !lon) {
    res.status(400).json({ error: 'Provide complete coordinates.' });
    return;
  }

  try {
    // Send request to OpenWeatherMap API
    const response = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=40`);
    const data = await response.json();

    // Pick out every 8th data to get weather for next 5 days
    let parsedData = {
      ...data,
      list: data.list.filter((d:WeatherData, i:number) => (i+1) % 8 === 0)
    }

    // Forward the response to the front-end
    res.status(200).json(parsedData);
  } catch (error) {
    // TODO: Log errors

    // Forward the an empty array as response to the front-end
    res.status(200).json([]);
  }
};
