import { NextApiRequest, NextApiResponse } from 'next';

// Import the newsdata.io API key from the .env file
const apiKey = process.env.NEWSDATAIO_API_KEY;
const apiUrl = process.env.NEWSDATAIO_URL_LATEST;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('news api hit');  // DEBUG

  // Return an error if API key is not found
  if (!apiKey) {
    res.status(500).json({ error: 'News API key not found.' });
    return;
  }

  // Extract the categories from the request object
  const { size, categories, country } = req.query;

  try {
    // Send request to newsdata.io API
    let query = '';

    // Set fetch count to size if available, otherwise default to 10 (limit of free newdata.io api)
    let fetch_count = 10;
    if (size !== null) {
      fetch_count = Number(size)
    }

    // Include categories with request if available
    if (categories) {
      query =`&category=${categories}`;
    }

    // Include country with request if available
    if (country) {
      query = query + `&country=${country}`;
    }

    // Send request
    const response = await fetch(`${apiUrl}?apikey=${apiKey}&language=en&image=1&prioritydomain=top&size=${fetch_count}${query}`);
    const data = await response.json();

    // Forward the response to the front-end
    res.status(200).json(data);
  } catch (error) {
    // Raise errors
    res.status(500).json({ error: error || 'Server error while trying to fetch news' });
  }
};
